export default function Button({ type, title, className, onClick, disabled }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={className}
      type={type}
    >
      {title}
    </button>
  );
}
