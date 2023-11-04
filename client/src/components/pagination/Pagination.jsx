import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

function Pagination({ current, totalRecord, pageSize, handleClick }) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalRecord / pageSize); i++) {
    pageNumbers.push(
      <BootstrapPagination.Item
        key={i}
        active={i === current}
        onClick={() => handleClick(i)}
      >
        {i}
      </BootstrapPagination.Item>
    );
  }

  return (
    <>
      <BootstrapPagination className="d-flex justify-content-center mt-5 itemPagination">
        {pageNumbers}
      </BootstrapPagination>
    </>
  );
}

export default Pagination;
