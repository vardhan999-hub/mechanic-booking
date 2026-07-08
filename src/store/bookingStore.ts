import { create } from "zustand";
import { Booking, BookingInput } from "@/lib/types";
import { logAnalytics } from "@/lib/analytics";
import { assertCan } from "@/lib/authorization";

const API_BASE = "/api";

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  addBooking: (input: BookingInput) => Promise<void>;
  updateBooking: (id: string, input: BookingInput) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  getBooking: (id: string) => Booking | undefined;
}

async function withNetworkErrorHandling<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error("Network issue detected. Please check your connection and try again.");
    }
    throw err;
  }
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      await withNetworkErrorHandling(async () => {
        const res = await fetch(`${API_BASE}/bookings`);
        if (!res.ok) throw new Error("Failed to load bookings.");
        const data: Booking[] = await res.json();
        set({ bookings: data, isLoading: false });
      });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : "Something went wrong." });
    }
  },

  addBooking: async (input) => {
    set({ error: null });
    try {
      assertCan("booking:create");
      await withNetworkErrorHandling(async () => {
        const res = await fetch(`${API_BASE}/bookings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        if (!res.ok) throw new Error("Failed to create booking.");
        const created: Booking = await res.json();
        set({ bookings: [...get().bookings, created] });
        logAnalytics("create-booking");
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Something went wrong." });
      throw err;
    }
  },

  updateBooking: async (id, input) => {
    set({ error: null });
    try {
      assertCan("booking:update");
      await withNetworkErrorHandling(async () => {
        const res = await fetch(`${API_BASE}/bookings/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        if (!res.ok) throw new Error("Failed to update booking.");
        const updated: Booking = await res.json();
        set({ bookings: get().bookings.map((b) => (b.id === id ? updated : b)) });
        logAnalytics("update-booking");
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Something went wrong." });
      throw err;
    }
  },

  deleteBooking: async (id) => {
    set({ error: null });
    try {
      assertCan("booking:delete");
      await withNetworkErrorHandling(async () => {
        const res = await fetch(`${API_BASE}/bookings/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete booking.");
        set({ bookings: get().bookings.filter((b) => b.id !== id) });
        logAnalytics("delete-booking");
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Something went wrong." });
      throw err;
    }
  },

  getBooking: (id) => get().bookings.find((b) => b.id === id),
}));