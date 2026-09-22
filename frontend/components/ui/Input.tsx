/** Input — accessible text input with label, error message, and optional hint. */
export function Input({
  label,
  error,
  hint,
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
}) {
  // TODO: implement with Tailwind + aria-invalid for error state
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} {...props} />
      {hint && <p>{hint}</p>}
      {error && <p id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
}
