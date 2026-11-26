// Booking choices used by the service request form.
export const BOOKING_PERIODS = [
  { key: "hours", max: 12 },
  { key: "days", max: 30 },
  { key: "months", max: 24 },
];
export const BOOKING_TIMES = Array.from({ length: 24 }, (_, index) => `${String((index + 8) % 24).padStart(2, "0")}:00`);
