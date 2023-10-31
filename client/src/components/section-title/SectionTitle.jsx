import PropTypes from 'prop-types';
import React from 'react';

const SectionTitle = ({
  titleText,
  spaceBottomClass,
  colorClass,
  textClass,
}) => {
  return (
    <div
      className={`section-title-3 section-title  ${
        spaceBottomClass ? spaceBottomClass : ''
      } ${colorClass ? colorClass : 'section-title-green'}`}
    >
      <a href="#" className={`${textClass ? textClass : ''}`}>
        {titleText}
      </a>
    </div>
  );
};

SectionTitle.propTypes = {
  spaceBottomClass: PropTypes.string,
  titleText: PropTypes.string,
  colorClass: PropTypes.string,
  textClass: PropTypes.string,
};

export default SectionTitle;
