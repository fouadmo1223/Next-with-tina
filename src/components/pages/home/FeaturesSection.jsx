import Image from "next/image";
import Container from "@/components/layout/Container";
import { Reveal, RevealSection } from "@/components/animation/Reveal";
import FeatureCard from "./FeatureCard";

// Every part is optional: a part with no value is simply not shown.
export default function FeaturesSection({ headingStart, headingAccent, intro, features = [] }) {
  const hasHeading = headingStart || headingAccent;
  const cards = features.filter((feature) => feature.image || feature.title || feature.description);

  return (
    <RevealSection amount={.25} aria-labelledby={hasHeading ? "home-features-heading" : undefined} className="relative isolate overflow-hidden bg-[linear-gradient(45deg,#884fb4,#532e6f)] py-8 text-white md:bg-[linear-gradient(#fff_89%,#f1f8f7_89%)] lg:py-32">
      {/* Waits for the background to load, so the wipe reveals the image instead of an empty box. */}
      <Reveal from="clipRight" waitForImage duration={1.35} ease={[0.65, 0, 0.35, 1]} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden md:block">
        <Image src="/home/sec-bg.png" alt="" fill sizes="100vw" className="object-fill" />
      </Reveal>
      <Container className="relative z-10">
        {(hasHeading || intro) && (
          <div className="text-center">
            {hasHeading && (
              <Reveal as="h2" from="blurUp" duration={.7} delay={1.4} id="home-features-heading" className="text-[clamp(30px,3vw,44px)] leading-[1.35] font-semibold">
                {headingStart && <span className="text-white">{headingStart}</span>}
                {headingStart && headingAccent && " "}
                {headingAccent && <span className="text-[#c9e9e8]">{headingAccent}</span>}
              </Reveal>
            )}
            {intro && <Reveal as="p" from="fadeUp" delay={2.1} className="mx-auto mt-3 max-w-[700px] text-center text-[18px] leading-[1.6] font-normal text-white">{intro}</Reveal>}
          </div>
        )}
        {cards.length > 0 && (
          <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-11 lg:grid-cols-4 lg:gap-5">
            {cards.map((feature, index) => (
              <FeatureCard key={feature.key ?? index} image={feature.image} imageWidth={feature.width}
                title={feature.title} description={feature.description} index={index} />
            ))}
          </div>
        )}
      </Container>
    </RevealSection>
  );
}
