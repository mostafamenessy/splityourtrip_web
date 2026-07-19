import React, { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import dayjs from 'dayjs';

const Calendar = ({ disabledDates, setSelectionRange }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const today = dayjs();

    const handleDateChange = (newValue) => {
        const [newStartDate, newEndDate] = newValue;

        if (newStartDate && newEndDate && newStartDate.isValid() && newEndDate.isValid()) {
            setStartDate(newStartDate);
            setEndDate(newEndDate);
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            const startFormatted = startDate.format('YYYY-MM-DD');
            const endFormatted = endDate.format('YYYY-MM-DD');
            setSelectionRange({
                startDate: startFormatted,
                endDate: endFormatted,
                key: 'selection',
            });
        }
    }, [startDate, endDate, setSelectionRange]);

    const shouldDisableDate = (date) => {
        return disabledDates.some(disabledDate => date.isSame(disabledDate, 'day'));
    };

    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDateRangePicker
                    startText="Start Date"
                    endText="End Date"
                    value={
                        startDate && endDate
                            ? [startDate, endDate]
                            : [today, today]
                    }
                    onChange={handleDateChange}
                    shouldDisableDate={shouldDisableDate}
                    minDate={today}
                    sx={{
                        '.MuiPickersLayout-contentWrapper': {
                            alignItems: 'center',
                        },
                    }}
                />
            </LocalizationProvider>
        </div>
    );
};

export default Calendar;
