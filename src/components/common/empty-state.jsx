/**
 * Empty State Component
 * Props: title, description, action (optional button config)
 */
export function EmptyState({ title = "Nothing here", description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl">
        🔍
      </div>
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-xs">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
