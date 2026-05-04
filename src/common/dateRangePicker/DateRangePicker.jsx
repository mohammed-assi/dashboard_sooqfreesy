import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = ({ fromDate, toDate, onChange }) => {
  const [startDate, setStartDate] = useState(fromDate || null);
  const [endDate, setEndDate] = useState(toDate || null);

  useEffect(() => {
    if (!startDate && endDate) {
      setEndDate(null);
      onChange?.({ from: null, to: null });
    }
  }, [startDate]);

  const handleFromChange = (date) => {
    setStartDate(date);
    onChange?.({ from: date, to: endDate });
  };

  const handleToChange = (date) => {
    setEndDate(date);
    onChange?.({ from: startDate, to: date });
  };

  const clearFromDate = () => {
    setStartDate(null);
    setEndDate(null);
    onChange?.({ from: null, to: null });
  };

  const clearToDate = () => {
    setEndDate(null);
    onChange?.({ from: startDate, to: null });
  };

  const inputClass =
    "w-30 text-sm px-2 py-[5px] border border-gray-300 rounded-md focus:outline-none focus:border-main";

  return (
    <div className="flex flex-col justify-end sm:flex-row sm:items-center gap-4">
      <div className="flex items-center gap-2 relative">
        <label className="text-sm font-medium text-gray-700">From:</label>
        <DatePicker
          selected={startDate}
          onChange={handleFromChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start date"
          className={inputClass}
        />
        {startDate && (
          <button
            onClick={clearFromDate}
            className="absolute right-1 text-red-400 hover:text-red-700 text-sm"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 relative">
        <label className="text-sm font-medium text-gray-700">To:</label>
        <DatePicker
          selected={endDate}
          onChange={handleToChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="End date"
          className={inputClass}
          disabled={!startDate}
        />
        {endDate && (
          <button
            onClick={clearToDate}
            className="absolute right-1 text-red-400 hover:text-red-700 text-sm"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;
