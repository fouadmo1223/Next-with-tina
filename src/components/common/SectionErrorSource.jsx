"use client";

import { useEffect, useState } from "react";

const stackLine = /^\s*at (?:(.+?) \()?(.+?):(\d+):(\d+)\)?$/;
const serverFrame = /^(?:about|rsc):\/\/React\/Server\//;
const base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function parseFrames(stack = "") {
  return stack.split("\n").flatMap((text) => {
    const match = text.match(stackLine);
    if (!match) return [];
    const [, methodName = "", file, line, column] = match;
    return [{ file, methodName, line: Number(line), column: Number(column) }];
  });
}

const isProjectFile = (file) => /(^|[\\/])src[\\/]/.test(file) && !/node_modules|\.next/.test(file);
const projectPath = (file) => file.replace(/\\/g, "/").replace(/^.*?(?=(^|\/)src\/)\/?/, "");

// Server frames: Next's dev server maps them back to the source, as its error overlay does.
async function findServerSource(frames) {
  if (!frames.length) return null;
  const body = { frames: frames.map(({ file, methodName, line, column }) => ({ file, methodName, arguments: [], line1: line, column1: column })), isServer: true, isEdgeServer: false, isAppDirectory: true };
  const response = await fetch("/__nextjs_original-stack-frames", { method: "POST", body: JSON.stringify(body) });
  if (!response.ok) return null;
  const source = (await response.json()).map((result) => result.value?.originalStackFrame).find((frame) => frame?.file && !frame.ignored && isProjectFile(frame.file));
  return source ? { file: projectPath(source.file), line: source.line1, column: source.column1 } : null;
}

// Decodes one source map segment into its relative fields.
function decodeSegment(segment) {
  const fields = [];
  let value = 0;
  let shift = 0;
  for (const char of segment) {
    const digit = base64.indexOf(char);
    value += (digit & 31) << shift;
    if (digit & 32) {
      shift += 5;
    } else {
      fields.push(value & 1 ? -(value >> 1) : value >> 1);
      value = 0;
      shift = 0;
    }
  }
  return fields;
}

// Finds where a line and column of a compiled chunk came from, in a sectioned source map.
function lookUp(sourceMap, line, column) {
  const section = sourceMap.sections.findLast(({ offset }) => offset.line < line || (offset.line === line - 1 && offset.column < column));
  if (!section) return null;
  const targetLine = line - 1 - section.offset.line;
  const targetColumn = targetLine === 0 ? column - 1 - section.offset.column : column - 1;
  let source = 0;
  let originalLine = 0;
  let originalColumn = 0;
  let found = null;
  section.map.mappings.split(";").some((lineMappings, index) => {
    let generatedColumn = 0;
    for (const segment of lineMappings.split(",").filter(Boolean)) {
      const fields = decodeSegment(segment);
      generatedColumn += fields[0];
      if (fields.length < 4) continue;
      source += fields[1];
      originalLine += fields[2];
      originalColumn += fields[3];
      if (index === targetLine && generatedColumn <= targetColumn) found = { file: section.map.sources[source], line: originalLine + 1, column: originalColumn + 1 };
    }
    return index >= targetLine;
  });
  return found;
}

// Browser frames: the chunk's source map is served next to it.
async function findBrowserSource(frames) {
  const maps = new Map();
  for (const { file, line, column } of frames) {
    const url = file.split("?")[0];
    if (!maps.has(url)) maps.set(url, await fetch(`${url}.map`).then((response) => (response.ok ? response.json() : null)).catch(() => null));
    const sourceMap = maps.get(url);
    const source = sourceMap?.sections && lookUp(sourceMap, line, column);
    if (source && isProjectFile(source.file)) return { ...source, file: projectPath(source.file) };
  }
  return null;
}

async function findSource(error) {
  const frames = parseFrames(error.stack);
  return await findServerSource(frames.filter(({ file }) => serverFrame.test(file))) ?? await findBrowserSource(frames.filter(({ file }) => /^https?:/.test(file)));
}

// Only rendered in development; shows where a section failed.
export default function SectionErrorSource({ error }) {
  const [source, setSource] = useState(undefined);

  useEffect(() => {
    let current = true;
    findSource(error).catch(() => null).then((found) => {
      if (current) setSource(found);
    });
    return () => {
      current = false;
    };
  }, [error]);

  return (
    <div dir="ltr" className="mx-auto mt-4 max-w-[900px] rounded-[10px] border border-[#e5484d] bg-[#fff5f5] p-3 text-left font-mono text-[13px] leading-[1.6] break-words text-[#b42318]">
      <p className="font-bold">{error.message}</p>
      {source === undefined && <p>Finding the source…</p>}
      {source && <p>{source.file}:{source.line}:{source.column}</p>}
      {source === null && <pre className="overflow-x-auto text-[12px] whitespace-pre-wrap">{error.stack}</pre>}
    </div>
  );
}
