import React from 'react';
import DashboardTopCard from './DashboardTopCard';

const TopCardHolder = ({ data }) => {
    if (!data) return;
    const topCardData = [
        {
            id: '1',
            bgClass: 'bg-c-blue',
            title: 'Orders Received',
            iconClass: 'fa fa-cart-plus',
            footer: 'Completed orders',
            amount: data.totalOrder,
            footerAmount: data.totalCompletedOrder,
        },
        {
            id: '2',
            bgClass: 'bg-c-green',
            title: 'Total Customer',
            iconClass: 'fa fa-regular fa-user',
            footer: 'New users',
            amount: data.totalUser,
            footerAmount: data.totalNewUser,
        },
        {
            id: '3',
            bgClass: 'bg-c-yellow',
            title: 'Total Products',
            iconClass: 'fa fa-solid fa-book',
            footer: 'New products',
            amount: data.totalProduct,
            footerAmount: data.totalNewProduct,
        },
        {
            id: '4',
            bgClass: 'bg-c-pink',
            title: 'Income this month',
            iconClass: 'fa fa-money',
            footer: 'Purchased orders',
            amount: data.totalIncomeThisMonth[0].amount,
            footerAmount: data.totalPurchasedOrder,
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
