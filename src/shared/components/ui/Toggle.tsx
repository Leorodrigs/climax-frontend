interface Props {
  checked: boolean;
  onChange: () => void;
  ariaLabel?: string;
}

export default function Toggle({ checked, onChange, ariaLabel }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer shrink-0
        ${checked ? "bg-cyan-500" : "bg-white/20"}`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300
          ${checked ? "translate-x-7" : "translate-x-1"}`}
      />
    </button>
  );
}
