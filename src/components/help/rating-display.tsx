interface RatingDisplayProps {
  rating: number; // 1 to 5
  label: string; // e.g., "User Rating", "Quality Rating"
}

// Rating display component
export const RatingDisplay = ({ rating, label }: RatingDisplayProps) => {
  const Star = ({ filled }: { filled: boolean }) => (
    <svg
      className={`h-4 w-4 ${filled ? "fill-current" : ""}`}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );

  const getColorClass = () => {
    switch (rating) {
      case 1:
        return "text-red-400";
      case 2:
        return "text-orange-400";
      case 3:
        return "text-yellow-400";
      case 4:
        return "text-green-400";
      case 5:
        return "text-green-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`flex ${getColorClass()}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} filled={star <= rating} />
        ))}
      </div>
      <span>{label}</span>
    </div>
  );
};
