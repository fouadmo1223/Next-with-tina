import Image from "next/image";
import Container from "@/components/layout/Container";
import { Reveal, RevealSection } from "@/components/animation/Reveal";
import TestimonialsSlider from "./TestimonialsSlider";
import { skipImageOptimizer } from "@/lib/utils";

const visibleCards = 3;
const cardsDelay = .9;
const cardStagger = .18;
const controlsDelay = cardsDelay + visibleCards * cardStagger + .3;
const starPath = "M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.6 7.7l5.8-.8L10 1.6Z";

function Stars({ rating, label }) {
  return (
    <div role="img" aria-label={label} className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.max(0, Math.min(1, rating - star + 1));
        return (
          <span key={star} aria-hidden="true" className="relative size-5">
            <svg viewBox="0 0 20 20" className="absolute inset-0 size-5 fill-[#e6dfec]"><path d={starPath} /></svg>
            <span className="absolute inset-y-0 start-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <svg viewBox="0 0 20 20" className="size-5 max-w-none fill-[#f5b301]"><path d={starPath} /></svg>
            </span>
          </span>
        );
      })}
    </div>
  );
}

function TestimonialCard({ item, delay }) {
  const step = (index) => delay + .2 + index * .1;
  return (
    <Reveal as="figure" duration={.7} delay={delay} className="flex h-full flex-col rounded-[16px] bg-[#f3edf7] p-6 lg:p-7">
      <Reveal delay={step(0)} duration={.45} aria-hidden="true" className="flex gap-1">
        <Image src="/home/comment-coma.svg" alt="" width={23} height={42} className="h-[42px] w-[23px]" />
        <Image src="/home/comment-coma.svg" alt="" width={23} height={42} className="h-[42px] w-[23px]" />
      </Reveal>
      {item.rating > 0 && (
        <Reveal delay={step(1)} duration={.45} className="mt-3">
          <Stars rating={item.rating} label={item.ratingLabel} />
        </Reveal>
      )}
      {/* Keeps the caption at the card's bottom even when there's no quote. */}
      {item.quote ? <Reveal as="blockquote" delay={step(2)} duration={.45} className="mt-4 flex-1 text-[16px] leading-[1.8] text-[#3d3442]">{item.quote}</Reveal> : <div className="flex-1" />}
      {(item.avatar || item.name || item.role) && (
        <Reveal as="figcaption" delay={step(3)} duration={.45} className="mt-5 flex items-center gap-3 border-t border-[#e0d1ed] pt-4">
          {item.avatar && (
            <span aria-hidden="true" className="relative size-12 shrink-0 overflow-hidden rounded-full bg-[#e0d1ed]">
              <Image src={item.avatar} alt="" fill sizes="48px" unoptimized={skipImageOptimizer(item.avatar)} className="object-cover" />
            </span>
          )}
          {(item.name || item.role) && (
            <span>
              {item.name && <span className="block text-[16px] font-bold text-[#2f2835]">{item.name}</span>}
              {item.role && <span className="mt-0.5 block text-[13px] text-[#5d5861]">{item.role}</span>}
            </span>
          )}
        </Reveal>
      )}
    </Reveal>
  );
}

// Every part is optional: a part with no value is simply not shown.
export default function TestimonialsSection({ heading, intro, items = [], labels }) {
  const cards = items.filter((item) => item.quote || item.name || item.role || item.avatar || item.rating > 0);
  return (
    <RevealSection aria-labelledby={heading ? "home-testimonials-heading" : undefined} className="relative isolate overflow-hidden bg-white py-8 lg:py-20">
      <Container>
        <TestimonialsSlider controlsDelay={controlsDelay}
          labels={labels}
          header={(heading || intro) && (
            <div className="max-w-[640px]">
              {heading && <Reveal as="h2" id="home-testimonials-heading" className="text-[clamp(28px,3vw,42px)] leading-[1.35] font-semibold text-[#6c3d8e]">{heading}</Reveal>}
              {intro && <Reveal as="p" delay={.45} className="mt-3 text-[15px] leading-[1.8] text-[#5d5861]">{intro}</Reveal>}
            </div>
          )}
          slides={cards.map((item, index) => (
            <TestimonialCard key={item.key ?? index} item={item} delay={cardsDelay + Math.min(index, visibleCards - 1) * cardStagger} />
          ))}
        />
      </Container>
    </RevealSection>
  );
}
