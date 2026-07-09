import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Booking, BookingInput } from "@/lib/types";

type BookingRecord = {
  id: string;
  customer_name: string;
  vehicle_number: string;
  date: string;
  service_type: string;
  status: Booking["status"];
};

const formatBooking = (booking: BookingRecord): Booking => ({
  id: booking.id,
  customerName: booking.customer_name,
  vehicleNumber: booking.vehicle_number,
  date: booking.date,
  serviceType: booking.service_type,
  status: booking.status,
});

export async function GET() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Failed to load bookings." },
      { status: 500 }
    );
  }

  const bookings = (data ?? []).map(formatBooking);

  return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
  const booking: BookingInput = await request.json();

  const newBooking = {
    customer_name: booking.customerName,
    vehicle_number: booking.vehicleNumber,
    date: booking.date,
    service_type: booking.serviceType,
    status: booking.status,
  };

  const { data, error } = await supabase
    .from("bookings")
    .insert(newBooking)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Failed to create booking." },
      { status: 500 }
    );
  }

  return NextResponse.json(formatBooking(data), {
    status: 201,
  });
}
