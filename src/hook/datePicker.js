import React, { useState } from 'react';
import { DateRangePicker } from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import 'bootstrap-daterangepicker/daterangepicker.css';

const DatePicker = ({ startDate, endDate, onDateChange }) => {
  const [inputValue, setInputValue] = useState(
    `${startDate.format('MM/DD/YYYY')} - ${endDate.format('MM/DD/YYYY')}`
  );

  const handleCallback = (start, end) => {
    setInputValue(`${start.format('MM/DD/YYYY')} - ${end.format('MM/DD/YYYY')}`);
    onDateChange(start, end);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="custom-date-picker">
      <DateRangePicker
        initialSettings={{
          startDate: startDate.toDate(),
          endDate: endDate.toDate(),
          ranges: {
            Today: [moment().toDate(), moment().toDate()],
            Yesterday: [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()],
            'Last 7 Days': [moment().subtract(6, 'days').toDate(), moment().toDate()],
            'Last 30 Days': [moment().subtract(29, 'days').toDate(), moment().toDate()],
            'This Month': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
            'Last Month': [
              moment().subtract(1, 'month').startOf('month').toDate(),
              moment().subtract(1, 'month').endOf('month').toDate(),
            ],
            'This Year': [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
            'Last Year': [
              moment().subtract(1, 'year').startOf('year').toDate(),
              moment().subtract(1, 'year').endOf('year').toDate(),
            ],
          },
        }}
        onCallback={handleCallback}
      >
        <div className="date-range-wrapper">
          <div id="reportrange daterangepicker" className="new-date">
            <input
              type="text"
              className="date-input"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </DateRangePicker>
      <span className="icon-end">
        <i className="ri-arrow-down-s-line" />
      </span>
    </div>
  );
};

export default DatePicker;