import React from 'react';
import DashboardTopCard from './DashboardTopCard';

const TopCardHolder = ({ data }) => {
  if (!data) return;
  const topCardData = [
    {
      id: '1',
      bgClass: 'bg-order',
      title: 'Orders Received',
      iconClass: 'fa fa-cart-plus',
      footer: 'Completed orders',
      amount: data.totalOrder || 0,
      footerAmount: data.totalCompletedOrder || 0,
    },
    {
      id: '2',
      bgClass: 'bg-customer',
      title: 'Total Customer',
      iconClass: 'fa fa-regular fa-user',
      footer: 'New users',
      amount: data.totalUser || 0,
      footerAmount: data.totalNewUser || 0,
    },
    {
      id: '3',
      bgClass: 'bg-product',
      title: 'Total Products',
      iconClass: 'fa fa-solid fa-book',
      footer: 'New products',
      amount: data.totalProduct || 0,
      footerAmount: data.totalNewProduct || 0,
    },
    {
      id: '4',
      bgClass: 'bg-income',
      title: 'Income this month',
      iconClass: 'fa fa-money',
      footer: 'Purchased orders',
      amount: data.totalIncomeThisMonth[0]?.amount || 0,
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
