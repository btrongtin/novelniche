import PropTypes from "prop-types";
import React from "react";

const SectionTitleFour = ({ titleText, spaceBottomClass }) => {
  return (
    <div
      className={`section-title-3 section-title  ${spaceBottomClass ? spaceBottomClass : ""}`}
    >
      <a href="#" className="">{titleText}</a>
    </div>
  );
};

SectionTitleFour.propTypes = {
  spaceBottomClass: PropTypes.string,
  titleText: PropTypes.string
};

export default SectionTitleFour;
