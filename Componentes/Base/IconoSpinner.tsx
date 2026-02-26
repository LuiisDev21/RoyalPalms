"use client";

export function IconoSpinner({ ClaseAdicional }: { ClaseAdicional?: string }) {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ${ClaseAdicional ?? ""}`}
      aria-hidden
    />
  );
}
