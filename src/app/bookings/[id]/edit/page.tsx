"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import BookingForm from "@/components/BookingForm";
import { EmptyState, LoadingIndicator } from "@/components/StatusIndicators";
import { BookingInput } from "@/lib/types";
import { useBookingStore } from "@/store/bookingStore";

export default function EditBookingPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const {
    bookings,
    isLoading,
    fetchBookings,
    getBooking,
    updateBooking,
  } = useBookingStore();

  useEffect(() => {
    if (!bookings.length) {
      fetchBookings();
    }
  }, [bookings.length, fetchBookings]);

  const booking = getBooking(id);

  const handleSubmit = async (values: BookingInput) => {
    await updateBooking(id, values);
    router.push("/bookings");
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-lg px-4 py-10">
        <h1 className="mb-6 text-2xl font-semibold text-slate-900">
          Edit Booking
        </h1>
        <LoadingIndicator />
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="mx-auto max-w-lg px-4 py-10">
        <h1 className="mb-6 text-2xl font-semibold text-slate-900">
          Edit Booking
        </h1>
        <EmptyState message="This booking could not be found. It may have been deleted." />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        Edit Booking
      </h1>

      <BookingForm
        initialValues={booking}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
      />
    </main>
  );
}
