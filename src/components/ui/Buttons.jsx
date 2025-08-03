// /components/ui/button.jsx
export function Button({ children, onClick, className = "", disabled = false , style}) {

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-xl  ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}
