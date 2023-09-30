import React from 'react';
import { Card, Skeleton } from 'antd';

const LoadingCard = ({ count }) => {
  const cards = () => {
    let totalCards = [];

    for (let i = 0; i < count; i++) {
      totalCards.push(
        <Card className="col-md-4 col-xl-3 col-md-6 col-lg-4 col-sm-6" key={i}>
          <Skeleton active></Skeleton>
        </Card>
      );
    }

    return totalCards;
  };

  return <div className="row five-column mb-5">{cards()}</div>;
};

export default LoadingCard;
