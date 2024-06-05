import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import { ReactNode } from 'react';

interface Props {
  items: { content: ReactNode, key: string | number }[]
}

export const Carousel = ({ items }: Props) => (
  <Swiper
    slidesPerView={1.8}
    spaceBetween={20}
    breakpoints={{
      640: {
        slidesPerView: 1.8,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 2.8,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 3.8,
        spaceBetween: 30
      },
      1280: {
        slidesPerView: 5.2,
        spaceBetween: 30
      }
    }}
  >
    {items.map(({ content, key }) => (
      <SwiperSlide key={key}>
        {content}
      </SwiperSlide>
    ))}
  </Swiper>
) 