"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  EmptyState,
  ErrorBanner,
  LoadingIndicator,
} from "@/components/StatusIndicators";
import { logAnalytics } from "@/lib/analytics";
import { useBookingStore } from "@/store/bookingStore";

export default function BookingsPage() {
  const {
    bookings,
    isLoading,
    error,
    fetchBookings,
    deleteBooking,
  } = useBookingStore();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleDelete = async (id: string, customerName: string) => {
    const confirmed = window.confirm(
      `Delete booking for ${customerName}? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    try {
      await deleteBooking(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <LoadingIndicator />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Mechanic Bookings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage service bookings for the shop floor.
          </p>
        </div>

        <Link
          href="/bookings/new"
          onClick={() => logAnalytics("navigate-new-booking")}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          + New Booking
        </Link>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} />
        </div>
      )}

      {!bookings.length ? (
        <EmptyState message="No bookings found. Create your first booking to get started." />
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              List of mechanic service bookings
            </caption>

            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Customer
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Vehicle
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Date
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Service
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {bookings.map((booking) => {
                const isDeleting = deletingId === booking.id;

                return (
                  <tr key={booking.id}>
                    <td className="px-4 py-3 text-slate-800">
                      {booking.customerName}
                    </td>

                    <td className="px-4 py-3 text-slate-800">
                      {booking.vehicleNumber}
                    </td>

                    <td className="px-4 py-3 text-slate-800">
                      {booking.date}
                    </td>

                    <td className="px-4 py-3 text-slate-800">
                      {booking.serviceType}
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/bookings/${booking.id}/edit`}
                        aria-label={`Edit booking for ${booking.customerName}`}
                        className="mr-3 text-sm font-medium text-slate-700 underline hover:text-slate-900"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() =>
                          handleDelete(booking.id, booking.customerName)
                        }
                        aria-label={`Delete booking for ${booking.customerName}`}
                        className="text-sm font-medium text-red-600 underline hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
