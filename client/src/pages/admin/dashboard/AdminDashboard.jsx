import { useState, useEffect } from 'react';
import { getDashboard } from '../../../functions/admin';
import { useSelector } from 'react-redux';
import Laptop from '../../../images/laptop.png';
import Carousel from 'react-bootstrap/Carousel';
import ProductDistributionPieChart from '../../../components/dashboard/ProductDistributionPieChart';
import StoreIncomeLineChart from '../../../components/dashboard/StoreIncomeLineChart';
import LoadingCard from '../../../components/cards/LoadingCard';
import TopCardHolder from '../../../components/dashboard/TopCardHolder';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = () => {
    setLoading(true);
    getDashboard(user.token).then((res) => {
      setDashboardData(res.data);
      setLoading(false);
    });
  };

  return (
    <>
      <h4 className="mb-5">Dashboard</h4>
      {loading ? (
        <LoadingCard count={3} />
      ) : (
        <>
          <TopCardHolder data={dashboardData.topCardData} />

          <div className="row mb-4">
            <div className="col-md-6 col-lg-6">
              <StoreIncomeLineChart data={dashboardData.storeIncomeData} />
            </div>
            <div className="col-md-6 col-lg-6">
              <div className="card shadow h-100">
                <div className="card-header">Top Selling Products</div>
                <div className="card-body row">
                  {dashboardData.topSellingProductData &&
                    dashboardData.topSellingProductData.map((product) => (
                      <div key={product._id} className="col-md-12 col-lg-12">
                        <div className="row align-items-center">
                          <div className="col-md-3 col-lg-3">
                            <img
                              src={product.images[0].url}
                              alt=""
                              className="box-img"
                              style={{
                                width: '4rem',
                              }}
                            />
                          </div>
                          <div className="col-md-7 col-lg-7">
                            <div className="d-flex flex-column">
                              <span className="font-weight-bold">
                                {product.title}
                              </span>
                              <span className="text-secondary">
                                {product.author?.name || ''}
                              </span>
                            </div>
                          </div>
                          <div className="col-md-2 col-lg-2">
                            <b>{product.price} VND</b>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-5">
            <div className="col-lg-4 col-md-4">
              <div className="card shadow h-100">
                <div className="card-header">Top Order Users</div>
                <div className="card-body">
                  {dashboardData.topOrderUserData &&
                    dashboardData.topOrderUserData.map((user) => (
                      <div
                        key={user._id}
                        className="row align-items-center mb-3"
                      >
                        <div className="col-md-3 col-lg-3 rounded-circle">
                          <img
                            src={Laptop}
                            alt=""
                            className="box-img rounded-circle"
                          />
                        </div>
                        <div className="col-md-6 col-lg-6">
                          <div className="d-flex flex-column">
                            <span className="font-weight-bold">
                              {user.name}
                            </span>

                            <span
                              className="text-secondary"
                              dangerouslySetInnerHTML={{
                                __html: user.address || '98 Le Hong Phong',
                              }}
                            ></span>
                          </div>
                        </div>
                        <div className="col-md-3 col-lg-3">
                          <span className="badge badge-success px-3 py-2">
                            {user.totalOrders || 13}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="card shadow h-100">
                <div className="card-header">Recent Products</div>
                {dashboardData.recentProduct && (
                  <div className="card-body">
                    <h5 className="card-title">
                      <b>{dashboardData.recentProduct.title}</b>
                    </h5>
                    <Carousel
                      indicators={false}
                      className="mt-3"
                      style={{ height: '268px' }}
                    >
                      <Carousel.Item style={{ height: '268px' }}>
                        <img
                          className="d-block w-100 box-img"
                          src={dashboardData.recentProduct.images[0].url}
                          alt="First slide"
                        />
                      </Carousel.Item>
                      <Carousel.Item style={{ height: '268px' }}>
                        <img
                          className="d-block w-100 box-img"
                          src={
                            dashboardData.recentProduct.images[1]
                              ? dashboardData.recentProduct.images[1].url
                              : dashboardData.recentProduct.images[0].url
                          }
                          alt="Second slide"
                        />
                      </Carousel.Item>
                    </Carousel>
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <ProductDistributionPieChart
                data={dashboardData.productDistributionData}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminDashboard;
