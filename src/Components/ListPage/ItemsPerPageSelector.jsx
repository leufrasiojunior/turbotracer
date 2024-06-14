import React from "react";

const ItemsPerPageSelector = ({ take, handleItemsPerPageChange }) => {
  return (
    <label htmlFor="itemsPerPage" className="d-flex align-items-center">
      Show
      <select
        className="custom-select custom-select-sm form-control form-control-sm"
        id="itemsPerPage"
        value={take}
        onChange={handleItemsPerPageChange}
        style={{
          display: "flex",
          marginLeft: "7px",
          marginRight: "7px",
          paddingLeft: "8px",
          paddingRight: "24px",
          width: "49px !important",
        }}
      >
        <option value={5}>5</option>
        <option value={15}>15</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
      Entries
    </label>
  );
};

export default ItemsPerPageSelector;
