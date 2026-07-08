"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import { useBookingStore } from "@/store/bookingStore";
import { BookingInput } from "@/lib/types";
import { LoadingIndicator, EmptyState } from "@/components/StatusIndicators";

export default function EditBookingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { bookings, isLoading, fetchBookings, updateBooking, getBooking } = useBookingStore();

  useEffect(() => {
    if (bookings.length === 0) fetchBookings();
  }, [bookings.length, fetchBookings]);

  const booking = getBooking(params.id);

  async function handleSubmit(input: BookingInput) {
    await updateBooking(params.id, input);
    router.push("/bookings");
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Edit Booking</h1>
      {isLoading ? (
        <LoadingIndicator />
      ) : !booking ? (
        <EmptyState message="This booking could not be found. It may have been deleted." />
      ) : (
        <BookingForm initialValues={booking} submitLabel="Save Changes" onSubmit={handleSubmit} />
      )}
    </main>
  );
}