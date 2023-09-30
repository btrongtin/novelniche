import React from 'react';

const DashboardTopCard = ({
    bgClass,
    title,
    iconClass,
    amount,
    footer,
    footerAmount,
}) => {
    return (
        <div className={`card ${bgClass} order-card shadow`}>
            <div className="card-block">
                <p
                    className="m-b-20 text-white font-weight-bold"
                    style={{ fontSize: '1rem' }}
                >
                    {title}
                </p>
                <p className="text-white flex-center-between">
                    <i className={`${iconClass}`}></i>
                    <span
                        className="font-weight-bold"
                        style={{ fontSize: '1.5rem' }}
                    >
                        {amount}
                    </span>
                </p>
                <p className="m-b-0 text-white flex-center-between">
                    <span>{footer}</span>
                    <span>{footerAmount}</span>
                </p>
            </div>
        </div>
    );
};

export default DashboardTopCard;
