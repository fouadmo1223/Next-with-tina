import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/animation/Reveal";
import { ROUTES } from "@/constants";
import PostDate from "@/components/common/PostDate";
import { skipImageOptimizer } from "@/lib/utils";

const textStagger = .12;

// `listing` is the blog page's card: a tall image and the excerpt, with a thin border on the white page.
// Every part is optional: a part with no value is simply not shown.
export default function BlogPostCard({ post, readMore, featured, listing, delay = 0 }) {
  const textDelay = (step) => delay + .55 + step * textStagger;
  const showExcerpt = (featured || listing) && post.excerpt;
  const imageSize = featured ? "h-[210px] sm:h-[300px] lg:h-[350px]" : listing ? "aspect-[4/3]" : "h-[165px] lg:h-[115px]";
  // Dashboard posts bring their own href (or none); otherwise the card links to the post by its identifier.
  const href = post.href !== undefined ? post.href : post.identifier && ROUTES.blogPost(post.identifier);
  const Card = href ? Link : "div";

  return (
    <Reveal from="clipDown" duration={.8} delay={delay} ease={[0.65, 0, 0.35, 1]} className="h-full">
      <Card {...(href ? { href } : {})} className={`group flex h-full flex-col rounded-[18px] bg-white p-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#884fb4] ${listing ? "border border-[#ece6f1]" : ""}`}>
        {post.image && (
          <span className={`relative block overflow-hidden rounded-[12px] ${imageSize}`}>
            <Image src={post.image} alt={post.imageAlt ?? ""} fill sizes={featured ? "(max-width: 1023px) 92vw, 840px" : "(max-width: 1023px) 92vw, 400px"} unoptimized={skipImageOptimizer(post.image)} className="object-fill transition-transform duration-500 group-hover:scale-[1.04]" />
          </span>
        )}
        <span className={`flex flex-1 flex-col items-start ${featured || listing ? "p-4" : "px-3 pt-3 pb-2"}`}>
          {(post.tag || post.date) && (
            <Reveal as="span" duration={.45} delay={textDelay(0)} className="flex w-full flex-wrap items-center justify-between gap-2">
              {post.tag && <span className="rounded-full bg-[#EDF7F5] px-3 py-1 text-[12px] font-normal text-[#6C3D8E]">{post.tag}</span>}
              <PostDate date={post.date} />
            </Reveal>
          )}
          {post.title && <Reveal as="span" duration={.45} delay={textDelay(1)} className={`mt-2.5 block font-semibold text-[#6C3D8E] ${featured ? "text-[22px] leading-[1.4] lg:text-[24px]" : "text-[18px] leading-[1.4] lg:text-[20px]"}`}>{post.title}</Reveal>}
          {/* `line-clamp-3` cuts a long excerpt at three lines with an ellipsis, so every card's text block is the same height. */}
          {showExcerpt && <Reveal as="span" duration={.45} delay={textDelay(2)} className="mt-2 line-clamp-3 text-[15px] leading-[1.7] text-[#5d5861]">{post.excerpt}</Reveal>}
          {href && readMore && (
            <Reveal as="span" duration={.45} delay={textDelay(showExcerpt ? 3 : 2)} className="mt-auto flex items-center gap-2 pt-3 text-[16px] font-semibold text-[#6C3D8E]">
              {readMore}
              <svg viewBox="0 0 24 16" fill="none" aria-hidden="true" className="h-4 w-6 transition-transform duration-300 group-hover:-translate-x-1 ltr:-scale-x-100 ltr:group-hover:translate-x-1" stroke="#6C3D8E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 8H1m6-6.5L1 8l6 6.5" /></svg>
            </Reveal>
          )}
        </span>
      </Card>
    </Reveal>
  );
}
