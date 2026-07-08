"use client";

import { useState, FormEvent } from "react";
import { Booking, BookingInput, SERVICE_TYPES, BOOKING_STATUSES } from "@/lib/types";
import { sanitizeText } from "@/lib/sanitize";

interface BookingFormProps {
  initialValues?: Booking;
  submitLabel: string;
  onSubmit: (input: BookingInput) => Promise<void>;
}

type FormErrors = Partial<Record<keyof BookingInput, string>>;

export default function BookingForm({ initialValues, submitLabel, onSubmit }: BookingFormProps) {
  const [customerName, setCustomerName] = useState(initialValues?.customerName ?? "");
  const [vehicleNumber, setVehicleNumber] = useState(initialValues?.vehicleNumber ?? "");
  const [date, setDate] = useState(initialValues?.date ?? "");
  const [serviceType, setServiceType] = useState(initialValues?.serviceType ?? SERVICE_TYPES[0]);
  const [status, setStatus] = useState(initialValues?.status ?? "Pending");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!customerName.trim()) next.customerName = "Customer name is required.";

    const vehiclePattern = /^[A-Z]{2}[ -]?\d{1,2}[ -]?[A-Z]{1,3}[ -]?\d{1,4}$/i;
    if (!vehicleNumber.trim()) {
      next.vehicleNumber = "Vehicle number is required.";
    } else if (!vehiclePattern.test(vehicleNumber.trim())) {
      next.vehicleNumber = "Enter a valid registration, e.g. AP16 AB 1234.";
    }

    if (!date) {
      next.date = "Service date is required.";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(date);
      if (selected < today) {
        next.date = "Service date cannot be in the past.";
      }
    }

    if (!serviceType) next.serviceType = "Service type is required.";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setSubmitError(null);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        customerName: sanitizeText(customerName),
        vehicleNumber: sanitizeText(vehicleNumber),
        date,
        serviceType,
        status,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not save booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldBase = "w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500";
  const fieldError = "border-red-500 ring-1 ring-red-500";
  const fieldOk = "border-slate-300";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-label="Booking form">
      <div>
        <label htmlFor="customerName" className="mb-1 block text-sm font-medium text-slate-700">Customer Name</label>
        <input id="customerName" name="customerName" type="text" value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className={`${fieldBase} ${errors.customerName ? fieldError : fieldOk}`}
          aria-invalid={Boolean(errors.customerName)}
          aria-describedby={errors.customerName ? "customerName-error" : undefined} />
        {errors.customerName && <p id="customerName-error" role="alert" className="mt-1 text-sm text-red-600">{errors.customerName}</p>}
      </div>

      <div>
        <label htmlFor="vehicleNumber" className="mb-1 block text-sm font-medium text-slate-700">Vehicle Number</label>
        <input id="vehicleNumber" name="vehicleNumber" type="text" value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          className={`${fieldBase} ${errors.vehicleNumber ? fieldError : fieldOk}`}
          aria-invalid={Boolean(errors.vehicleNumber)}
          aria-describedby={errors.vehicleNumber ? "vehicleNumber-error" : undefined} />
        {errors.vehicleNumber && <p id="vehicleNumber-error" role="alert" className="mt-1 text-sm text-red-600">{errors.vehicleNumber}</p>}
      </div>

      <div>
        <label htmlFor="date" className="mb-1 block text-sm font-medium text-slate-700">Service Date</label>
        <input id="date" name="date" type="date" min={new Date().toISOString().split("T")[0]} value={date}
          onChange={(e) => setDate(e.target.value)}
          className={`${fieldBase} ${errors.date ? fieldError : fieldOk}`}
          aria-invalid={Boolean(errors.date)}
          aria-describedby={errors.date ? "date-error" : undefined} />
        {errors.date && <p id="date-error" role="alert" className="mt-1 text-sm text-red-600">{errors.date}</p>}
      </div>

      <div>
        <label htmlFor="serviceType" className="mb-1 block text-sm font-medium text-slate-700">Service Type</label>
        <select id="serviceType" name="serviceType" value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className={`${fieldBase} ${errors.serviceType ? fieldError : fieldOk}`}
          aria-invalid={Boolean(errors.serviceType)}>
          {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="status" className="mb-1 block text-sm font-medium text-slate-700">Status</label>
        <select id="status" name="status" value={status}
          onChange={(e) => setStatus(e.target.value as Booking["status"])}
          className={`${fieldBase} ${fieldOk}`}>
          {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {submitError && <p role="alert" className="text-sm text-red-600">{submitError}</p>}

      <button type="submit" disabled={isSubmitting}
        className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}