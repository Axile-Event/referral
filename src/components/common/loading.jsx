/**
 * Loading Spinner Component
 * Props: text (optional label)
 */
export function Loading({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm">{text}</p>
    </div>
  );
}
