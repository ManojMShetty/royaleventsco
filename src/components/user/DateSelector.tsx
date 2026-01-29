import { useState } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";
import { differenceInDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

type DateSelectorProps = {
    onDateChange: (
        startDate: Date,
        endDate: Date,
        totalDays: number
    ) => void;
};

const DateSelector = ({ onDateChange }: DateSelectorProps) => {
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    const handleChange = (ranges: RangeKeyDict) => {
        const selection = ranges.selection;
        const start = selection.startDate!;
        const end = selection.endDate!;

        const days = differenceInDays(end, start) || 1;

        setDateRange([selection]);
        onDateChange(start, end, days);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-md w-fit">
            <h2 className="text-lg font-semibold mb-2">
                Select Dates
            </h2>

            <DateRange
                ranges={dateRange}
                onChange={handleChange}
                minDate={new Date()}
                rangeColors={["#2563eb"]}
            />

            <div className="mt-3 text-sm text-gray-700">
                <p>
                    <strong>Check-in:</strong>{" "}
                    {dateRange[0].startDate?.toDateString()}
                </p>
                <p>
                    <strong>Check-out:</strong>{" "}
                    {dateRange[0].endDate?.toDateString()}
                </p>
                <p>
                    <strong>Total Days:</strong>{" "}
                    {differenceInDays(
                        dateRange[0].endDate!,
                        dateRange[0].startDate!
                    ) || 1}
                </p>
            </div>
        </div>
    );
};

export default DateSelector;
