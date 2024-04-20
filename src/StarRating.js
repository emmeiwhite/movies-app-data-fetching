import { GoStar, GoStarFill } from "react-icons/go";
import "./StarRating.css";
import { useState } from "react";
export default function StarRating() {
  const [rating, setRating] = useState(0);

  function handleClick(rating) {
    setRating(rating);
  }

  function handleMouseEnter(rating) {
    setRating(rating);
  }

  return (
    <div className="star-ratings-wrapper">
      <div className="star-ratings">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            onClick={() => handleClick(i + 1)}
            onMouseEnter={() => handleMouseEnter(i + 1)}
            key={i}
            className={i < rating ? "filled" : ""}
          >
            <GoStar />
          </span>
        ))}
      </div>

      <h2 className="rating">{rating || ""}</h2>
    </div>
  );
}
