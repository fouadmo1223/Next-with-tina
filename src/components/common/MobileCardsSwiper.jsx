"use client";

import { Children } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

export default function MobileCardsSwiper({ children }) {
  const cards = Children.toArray(children);

  return (
    <Swiper slidesPerView={cards.length > 1 ? 1.5 : 1} spaceBetween={16}>
      {cards.map((card) => <SwiperSlide key={card.key} className="!h-auto">{card}</SwiperSlide>)}
    </Swiper>
  );
}
