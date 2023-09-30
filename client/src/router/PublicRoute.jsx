import { Outlet } from 'react-router-dom';
import Header from '../components/nav/Header';
import Footer from '../components/nav/footer/Footer';

const PublicRoute = () => {
  return (
    <>
      <Header />
      <div className="mt-90">
        <Outlet />
      </div>
      <Footer
        backgroundColorClass="bg-gray"
        spaceTopClass="pt-100"
        spaceBottomClass="pb-70"
      />
    </>
  );
};

export default PublicRoute;
