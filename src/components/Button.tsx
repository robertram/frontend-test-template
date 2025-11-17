interface SeeMoreButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export default function SeeMoreButton({ 
  onClick, 
  disabled = false,
  children = "SEE MORE", 
  className = ""
}: SeeMoreButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer px-6 py-3 bg-[#585660] text-white font-bold text-base uppercase rounded-md hover:bg-gray-700 active:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

