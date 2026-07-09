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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const booking: BookingInput = await request.json();

  const updatedBooking = {
    customer_name: booking.customerName,
    vehicle_number: booking.vehicleNumber,
    date: booking.date,
    service_type: booking.serviceType,
    status: booking.status,
  };

  const { data, error } = await supabase
    .from("bookings")
    .update(updatedBooking)
    .eq("id", params.id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Booking not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(formatBooking(data));
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to delete booking." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
