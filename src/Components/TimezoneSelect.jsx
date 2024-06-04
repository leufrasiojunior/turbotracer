/* eslint-disable react/prop-types */

import Select from "react-select";

const TimezoneSelect = ({ options, defaultValue, onChange, enableShadow }) => {
  return (
    <div className={enableShadow == true ? "shadow-sm" : ""}>
      <Select
        options={options}
        // defaultValue={defaultValue}
        onChange={onChange}
        value={defaultValue}
      />
    </div>
  );
};

export default TimezoneSelect;
