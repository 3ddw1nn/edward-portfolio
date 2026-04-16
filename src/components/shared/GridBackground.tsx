export function GridBackground({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 bg-paper-grid pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
