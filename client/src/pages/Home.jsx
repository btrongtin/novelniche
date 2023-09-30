import HeroSlider from '../components/hero-slider/HeroSlider';
import SectionTitle from '../components/section-title/SectionTitle';
import Banner from '../assets/img/banner.jpg';
import FeatureIcon from '../components/home/FeatureIcon';
import FeatureProducts from '../components/home/FeatureProducts';

const Home = () => {
  return (
    <>
      <HeroSlider />

      <div className="container product-area pb-60 section-padding-1 pt-60">
        <SectionTitle
          titleText={'New Arrivals'}
          positionClass="text-center"
          spaceBottomClass="mb-30"
        />
        {/* <NewArrivals /> */}
        <FeatureProducts
          filterBy="createdAt"
          size={5}
          spaceBottomClass="mb-25"
        />

        <SectionTitle
          titleText={'Tiktok Make Me Buy It'}
          positionClass="text-center"
          spaceBottomClass="mb-30 mt-30"
        />
        {/* <BestSellers /> */}
        <FeatureProducts filterBy="sold" size={10} spaceBottomClass="mb-25" />

        <div className="banner mt-5 mb-5">
          <img
            src={Banner}
            alt="banner"
            style={{ width: '100%', maxWidth: '100%' }}
          />
        </div>

        <FeatureIcon
          spaceBottomClass="pb-960"
          spaceTopClass="pt-60"
          containerClass="container-fluid"
          responsiveClass="res-mrg-md-mt"
        />
      </div>

      <br />
      <br />
    </>
  );
};

export default Home;
