import React from 'react';
import DashboardTopCard from './DashboardTopCard';
import { numberWithCommas } from '../../utils';

const TopCardHolder = ({ data }) => {
  if (!data) return;
  const topCardData = [
    {
      id: '1',
      bgClass: 'bg-order',
      title: 'Tổng đơn hàng',
      iconClass: 'fa fa-cart-plus',
      footer: 'Đơn hàng hoàn thành',
      amount: data.totalOrder || 0,
      footerAmount: data.totalCompletedOrder || 0,
    },
    {
      id: '2',
      bgClass: 'bg-customer',
      title: 'Tổng khách hàng',
      iconClass: 'fa fa-regular fa-user',
      footer: 'Khách hàng mới',
      amount: data.totalUser || 0,
      footerAmount: data.totalNewUser || 0,
    },
    {
      id: '3',
      bgClass: 'bg-product',
      title: 'Số lượng sách',
      iconClass: 'fa fa-solid fa-book',
      footer: 'Sách mới',
      amount: data.totalProduct || 0,
      footerAmount: data.totalNewProduct || 0,
    },
    {
      id: '4',
      bgClass: 'bg-income',
      title: 'Doanh thu tháng',
      iconClass: 'fa fa-money',
      footer: 'Đơn đã thanh toán',
      amount: numberWithCommas(data.totalIncomeThisMonth[0]?.amount || 0) + 'đ',
      footerAmount: data.totalPurchasedOrder || 0,
    },
  ];

  return (
    <div className="row">
      {topCardData.map((card) => {
        return (
          <div key={card.id} className="col-md-3 col-lg-3">
            <DashboardTopCard
              bgClass={card.bgClass}
              title={card.title}
              iconClass={card.iconClass}
              footer={card.footer}
              amount={card.amount}
              footerAmount={card.footerAmount}
            />
          </div>
        );
      })}
    </div>
  );
};

export default TopCardHolder;
