"use client";

import { useRouter } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import { useBookingStore } from "@/store/bookingStore";
import { BookingInput } from "@/lib/types";

export default function NewBookingPage() {
  const router = useRouter();
  const addBooking = useBookingStore((s) => s.addBooking);

  async function handleSubmit(input: BookingInput) {
    await addBooking(input);
    router.push("/bookings");
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">New Booking</h1>
      <BookingForm submitLabel="Create Booking" onSubmit={handleSubmit} />
    </main>
  );
}