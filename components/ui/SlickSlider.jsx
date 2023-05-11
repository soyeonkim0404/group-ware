//slick slide
import React from 'react';
import Slider from 'react-slick';
import Link from 'next/link';

const SlickSlider = ({ state }) => {
  const settings = {
    vertical: true,
    verticalSwiping: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    pauseOnHover: true,
    NextArrow: false,
    prevArrow: false,
  };

  return (
    <>
      <Slider {...settings}>
        {state.map((item, idx) => (
          <div key={idx}>
            <Link href={item.path}>
              <p>{item.title}</p>
            </Link>
          </div>
        ))}
      </Slider>
    </>
  );
};

export default SlickSlider;
