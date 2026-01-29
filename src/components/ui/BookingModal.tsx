type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    venueName: string;
    startDate: Date;
    endDate: Date;
    days: number;
    venueTotal: number;
    foodTotal: number;
    grandTotal: number;
};

const BookingModal = ({
    open,
    onClose,
    onConfirm,
    venueName,
    startDate,
    endDate,
    days,
    venueTotal,
    foodTotal,
    grandTotal,
}: Props) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">

                <h2 className="text-xl font-semibold mb-4">
                    Confirm Your Booking
                </h2>

                <div className="text-sm text-gray-700 space-y-2">
                    <p><strong>Venue:</strong> {venueName}</p>
                    <p>
                        <strong>Dates:</strong>{" "}
                        {startDate.toDateString()} → {endDate.toDateString()}
                    </p>
                    <p><strong>Days:</strong> {days}</p>

                    <hr />

                    <p>Venue Total: ₹{venueTotal}</p>
                    <p>Food Total: ₹{foodTotal}</p>

                    <p className="text-lg font-bold text-green-600">
                        Grand Total: ₹{grandTotal}
                    </p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Confirm Booking
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
