import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

export function Rating({ value = 0, count, size = 12 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.4 && value - full < 0.9;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full)
      stars.push(<FaStar key={i} size={size} className="text-amber-400" />);
    else if (i === full && half)
      stars.push(
        <FaStarHalfAlt key={i} size={size} className="text-amber-400" />
      );
    else
      stars.push(
        <FaRegStar key={i} size={size} className="text-amber-300/70" />
      );
  }
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex">{stars}</span>
      {count != null && (
        <span className="text-xs text-ink-900/60 dark:text-white/60">
          {value.toFixed(1)}{" "}
          <span className="opacity-70">({count})</span>
        </span>
      )}
    </span>
  );
}
