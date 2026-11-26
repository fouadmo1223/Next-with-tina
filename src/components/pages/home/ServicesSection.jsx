import Container from "@/components/layout/Container";
import { Reveal, RevealSection } from "@/components/animation/Reveal";
import DrawnShape from "@/components/common/DrawnShape";
import ServiceCard from "./ServiceCard";
import ServicesSlider from "./ServicesSlider";

const introDelay = .45;
const cardsDelay = .9;
const cardStagger = .15;

const decorations = [
  { viewBox: "0 0 260 600", opacity: .65, fill: true, className: "top-0 -left-16 w-[200px]", d: "M0 0C283.012 0 315.667 94.5498 190.489 218.958C76.1956 338.389 326.553 398.105 239.472 532.465C201.374 592.181 97.9658 607.109 0 597.157V0Z" },
  { viewBox: "0 0 161.147 340.35", className: "top-0 right-0 w-[130px]", d: "M0.578111 0.160586C25.5781 90.1606 95.5781 110.161 80.5781 190.161C65.5781 270.161 140.578 280.161 160.578 340.161" },
  { viewBox: "0 0 260 600", opacity: .6, fill: true, className: "top-[42%] -right-16 w-[200px]", d: "M260 0C7.99509 15 -18.5317 130 114.102 220C246.737 310 -51.6903 370 7.99508 485C41.1536 560 133.998 590 260 600V0Z" },
  { viewBox: "0 0 170.798 420.675", className: "-bottom-10 -left-20 w-[150px]", d: "M0.197473 0.566572C201.035 70.5666 205.933 125.567 107.964 205.567C19.7914 285.567 181.441 340.567 166.746 420.567" },
];

// Every part is optional: a part with no value is simply not shown.
export default function ServicesSection({ heading, intro, services = [], dotLabels }) {
  const drawDelay = cardsDelay + Math.max(services.length - 1, 0) * cardStagger + 1.3;

  return (
    <RevealSection aria-labelledby={heading ? "home-services-heading" : undefined} className="relative isolate overflow-hidden bg-[#f1f8f7] py-8 lg:py-20">
      {decorations.map((decoration, index) => (
        <DrawnShape key={decoration.d} {...decoration} index={index} after={drawDelay} />
      ))}
      <Container>
        {(heading || intro) && (
          <div className="text-center">
            {heading && <Reveal as="h2" duration={.7} id="home-services-heading" className="text-[clamp(28px,3vw,42px)] leading-[1.35] font-semibold text-[#6c3d8e]">{heading}</Reveal>}
            {intro && <Reveal as="p" delay={introDelay} className="mx-auto mt-3 max-w-[560px] text-[15px] leading-[1.8] text-[#5d5861]">{intro}</Reveal>}
          </div>
        )}
        {services.length > 0 && <ServicesSlider count={services.length} dotLabels={dotLabels}>
          {services.map((service, index) => (
            <div key={service.id ?? service.slug ?? index} className="max-md:w-full max-md:shrink-0 max-md:snap-center">
              <ServiceCard href={service.href} image={service.image}
                title={service.title} description={service.description}
                points={service.points} cta={service.cta}
                delay={cardsDelay + index * cardStagger} />
            </div>
          ))}
        </ServicesSlider>}
      </Container>
    </RevealSection>
  );
}
