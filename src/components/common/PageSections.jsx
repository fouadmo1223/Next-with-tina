// Stacks a page's sections with no gap between them; each section's own padding sets its spacing. The rule is in globals.css.
// Sections whose backgrounds run into each other go in one plain <div> here, so they stay joined.
export default function PageSections({ children }) {
  return <div className="page-sections">{children}</div>;
}
