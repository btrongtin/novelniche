import Swiper from 'react-id-swiper';
import BannerImageOne from '../../assets/img/heroslider/slider_1.jpg';
import BannerImageTwo from '../../assets/img/heroslider/slider_2.jpg';

const HeroSlider = () => {
    const params = {
        effect: 'fade',
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        watchSlidesVisibility: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        renderPrevButton: () => (
            <button className="swiper-button-prev ht-swiper-button-nav">
                <i className="pe-7s-angle-left" />
            </button>
        ),
        renderNextButton: () => (
            <button className="swiper-button-next ht-swiper-button-nav">
                <i className="pe-7s-angle-right" />
            </button>
        ),
    };
    return (
        <div className="slider-area" style={{marginTop: '-90px'}}>
            <div className="slider-active nav-style-1">
                <Swiper {...params}>
                    <div
                        className={`single-slider-2 slider-height-2 d-flex align-items-center bg-img swiper-slide`}
                        style={{
                            backgroundImage: `url(${BannerImageOne})`,
                        }}
                    ></div>
                    <div
                        className={`single-slider-2 slider-height-2 d-flex align-items-center bg-img swiper-slide`}
                        style={{
                            backgroundImage: `url(${BannerImageTwo})`,
                        }}
                    ></div>
                </Swiper>
            </div>
        </div>
    );
};

export default HeroSlider;
