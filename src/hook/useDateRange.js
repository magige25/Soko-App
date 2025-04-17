import React, { useState } from 'react';
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css'; // Import CSS here as fallback

export const PredefinedDateRanges = ({ onDateChange }) => {
  const [state, setState] = useState({
    start: moment().subtract(6, 'days').startOf('day'), // Default to 7 days ago
    end: moment().endOf('day'), // Default to today
  });

  const { start, end } = state;

  const handleCallback = (event, picker) => {
    const startDate = moment(picker.startDate);
    const endDate = moment(picker.endDate);
    setState({ start: startDate, end: endDate });
    onDateChange(startDate, endDate);
  };

  const label = `${start.format('MM/DD/YYYY')} - ${end.format('MM/DD/YYYY')}`;

  return (
    <DateRangePicker
      initialSettings={{
        startDate: start.toDate(),
        endDate: end.toDate(),
        ranges: {
          Today: [moment().startOf('day').toDate(), moment().endOf('day').toDate()],
          Yesterday: [moment().subtract(1, 'days').startOf('day').toDate(), moment().subtract(1, 'days').endOf('day').toDate()],
          'Last 7 Days': [moment().subtract(6, 'days').startOf('day').toDate(), moment().endOf('day').toDate()],
          'Last 30 Days': [moment().subtract(29, 'days').startOf('day').toDate(), moment().endOf('day').toDate()],
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
      onApply={handleCallback} // Use onApply for better event handling
    >
      <div className="new-date form-control" style={{ cursor: 'pointer', width: 'auto', display: 'inline-block' }}>
        <span>{label}</span>
        <i className="fa fa-calendar ms-2" />
      </div>
    </DateRangePicker>
  );
};

export const useDateRange = () => {
  const [dateRange, setDateRange] = useState({
    start: moment().subtract(6, 'days').startOf('day'),
    end: moment().endOf('day'),
  });

  const handleDateChange = (start, end) => {
    setDateRange({ start, end });
  };

  return {
    dateRange,
    PredefinedDateRanges: <PredefinedDateRanges onDateChange={handleDateChange} />,
  };
};