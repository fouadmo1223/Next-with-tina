import Container from "@/components/layout/Container";
import { Reveal, RevealSection } from "@/components/animation/Reveal";
import { ROUTES } from "@/constants";
import BlogPostCard from "@/components/common/BlogPostCard";
import MobileCardsSwiper from "@/components/common/MobileCardsSwiper";
import DoubleWaveLink from "@/components/common/DoubleWaveLink";

const cardsDelay = 1.1;
const cardStagger = .3;

// Every part is optional: a part with no value is simply not shown.
// On wider screens, three posts show a large one beside two small ones. One or two posts use large cards.
export default function BlogSection({ heading, intro, viewAll, viewAllHref = ROUTES.blog, readMore, posts = [] }) {
  const [featured, ...others] = posts.slice(0, 3);

  return (
    <RevealSection aria-labelledby={heading ? "home-blog-heading" : undefined} className="relative isolate overflow-hidden bg-[#eef7f5] py-8 lg:py-20">
      <Container>
        {(heading || intro || viewAll) && (
          <div className="flex flex-wrap items-end justify-between gap-6">
            {(heading || intro) && (
              <div className="max-w-[720px]">
                {heading && <Reveal as="h2" id="home-blog-heading" className="text-[clamp(28px,3vw,42px)] leading-[1.35] font-semibold text-[#6c3d8e]">{heading}</Reveal>}
                {intro && <Reveal as="p" delay={.4} className="mt-3 text-[15px] leading-[1.8] text-[#5d5861]">{intro}</Reveal>}
              </div>
            )}
            {viewAll && (
              <Reveal delay={.75}>
                <DoubleWaveLink still href={viewAllHref} className="inline-flex min-h-12 items-center justify-center rounded-[11px] border border-[#6c3d8e] px-10 py-3 text-[15px] font-bold text-[#6c3d8e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#884fb4]">{viewAll}</DoubleWaveLink>
              </Reveal>
            )}
          </div>
        )}
        {featured && (
          <>
            <div className="mt-9 sm:hidden">
              <MobileCardsSwiper>
                {[featured, ...others].map((post, index) => (
                  <BlogPostCard key={post.key ?? post.id ?? index} post={post} readMore={readMore} delay={cardsDelay + index * cardStagger} />
                ))}
              </MobileCardsSwiper>
            </div>
            {others.length === 2 ? (
              <div className="mt-9 hidden gap-5 sm:grid lg:mt-10 lg:grid-cols-[minmax(0,1fr)_335px] lg:gap-10">
                <BlogPostCard post={featured} readMore={readMore} featured delay={cardsDelay} />
                <div className="grid gap-5">
                  {others.map((post, index) => (
                    <BlogPostCard key={post.key ?? post.id ?? index} post={post} readMore={readMore} delay={cardsDelay + (index + 1) * cardStagger} />
                  ))}
                </div>
              </div>
            ) : (
              // One or two posts: equal halves, each card as tall as the large card.
              <div className="mt-9 hidden gap-5 sm:grid lg:mt-10 lg:grid-cols-2 lg:gap-10">
                {[featured, ...others].map((post, index) => (
                  <BlogPostCard key={post.key ?? post.id ?? index} post={post} readMore={readMore} featured delay={cardsDelay + index * cardStagger} />
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </RevealSection>
  );
}
