type MessageProps = {
  message: string;
};

export function LoadingIndicator() {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 py-12 text-slate-500"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5 animate-spin"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          className="opacity-25"
        />

        <path
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          fill="currentColor"
          className="opacity-75"
        />
      </svg>

      <span className="text-sm">Loading bookings...</span>
    </div>
  );
}

export function EmptyState({ message }: MessageProps) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 py-12 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}

export function ErrorBanner({ message }: MessageProps) {
  return (
    <div
      role="alert"
      className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {message}
    </div>
  );
}
