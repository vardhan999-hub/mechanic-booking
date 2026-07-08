export type BookingStatus = "Pending" | "In Progress" | "Completed" | "Cancelled";

export interface Booking {
  id: string;
  customerName: string;
  vehicleNumber: string;
  date: string;
  serviceType: string;
  status: BookingStatus;
}

export type BookingInput = Omit<Booking, "id">;

export const SERVICE_TYPES = [
  "Oil Change",
  "Brake Inspection",
  "Full Service",
  "Tyre Replacement",
  "Battery Check",
  "Engine Diagnostics",
] as const;

export const BOOKING_STATUSES: BookingStatus[] = [
  "Pending",
  "In Progress",
  "Completed",
  "Cancelled",
];