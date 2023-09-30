import PropTypes from 'prop-types';
import React from 'react';
import support1 from '../../assets/img/icon-img/support-1.png';
import support2 from '../../assets/img/icon-img/support-2.png';
import support3 from '../../assets/img/icon-img/support-3.png';
import support4 from '../../assets/img/icon-img/support-4.png';

const featureIconData = [
    {
        id: 1,
        image: support1,
        title: 'Free Shipping',
        subtitle: 'Free shipping on all order',
    },
    {
        id: 2,
        image: support2,
        title: 'Support 24/7',
        subtitle: 'Free shipping on all order',
    },
    {
        id: 3,
        image: support3,
        title: 'Money Return',
        subtitle: 'Free shipping on all order',
    },
    {
        id: 4,
        image: support4,
        title: 'Order Discount',
        subtitle: 'Free shipping on all order',
    },
];

const FeatureIcon = ({ spaceTopClass, spaceBottomClass }) => {
    return (
        <div
            className={`support-area ${spaceTopClass ? spaceTopClass : ''} ${
                spaceBottomClass ? spaceBottomClass : ''
            }`}
        >
            <div>
                <div>
                    <div className="row">
                        {featureIconData.map((singleFeature) => {
                            return (
                                <div className="col-lg-3 col-sm-6" key={singleFeature.id}>
                                    <div className="support-wrap mb-30">
                                        <div className="support-icon">
                                            <img
                                                className="animated"
                                                src={singleFeature.image}
                                                alt=""
                                            />
                                        </div>
                                        <div className="support-content">
                                            <h5>{singleFeature.title}</h5>
                                            <p>{singleFeature.subtitle}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

FeatureIcon.propTypes = {
    spaceBottomClass: PropTypes.string,
    spaceTopClass: PropTypes.string,
};

export default FeatureIcon;
