import Container from "@/components/layout/Container";
import { Reveal, RevealSection } from "@/components/animation/Reveal";
import { ROUTES } from "@/constants";
import FaqAccordion from "@/components/common/FaqAccordion";
import LetterRollLink from "@/components/common/LetterRollLink";

const itemsDelay = .5;
const itemStagger = .1;

// columns holds the questions per column as { id, question, answer }; viewAll is the optional button's label.
// Every part is optional: a part with no value is simply not shown.
export default function FaqSection({ heading, columns: allColumns = [], viewAll, className = "pt-14 pb-8 sm:pt-16 lg:pt-20" }) {
  const columns = allColumns.filter((column) => column.length > 0);
  const buttonDelay = itemsDelay + (columns[0]?.length ?? 0) * itemStagger + .25;

  return (
    <RevealSection aria-labelledby={heading ? "faq-heading" : undefined} className={`relative isolate overflow-hidden bg-white ${className}`}>
      <Container>
        {heading && <Reveal as="h2" id="faq-heading" className="text-[clamp(28px,3vw,42px)] leading-[1.35] font-semibold text-[#6c3d8e]">{heading}</Reveal>}
        {columns.length > 0 && <FaqAccordion columns={columns} itemsDelay={itemsDelay} itemStagger={itemStagger} />}
        {viewAll && (
          <Reveal delay={buttonDelay} className="mt-8 text-center">
            <LetterRollLink still href={ROUTES.faq} className="inline-flex min-h-12 items-center justify-center rounded-[11px] border border-[#85b7bc] bg-[#85b7bc] px-8 py-3 text-[14px] font-bold text-white transition-colors hover:border-[#6c3d8e] hover:bg-transparent hover:text-[#6c3d8e] focus-visible:border-[#6c3d8e] focus-visible:bg-transparent focus-visible:text-[#6c3d8e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#884fb4]">{viewAll}</LetterRollLink>
          </Reveal>
        )}
      </Container>
    </RevealSection>
  );
}
