import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import { ReactNode } from 'react';

interface Props {
  items: { content: ReactNode, key: string | number }[]
}

export const Carousel = ({ items }: Props) => (
  <Swiper
    slidesPerView={5}
    spaceBetween={30}
    breakpoints={{
      // when window width is >= 320px
      320: {
        slidesPerView: 1.8,
        spaceBetween: 20
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 3,
        spaceBetween: 20
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 4,
        spaceBetween: 30
      },
      1000: {
        slidesPerView: 5,
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