import { GoStar, GoStarFill } from "react-icons/go";
import "./StarRating.css";
import { useState } from "react";
export default function StarRating() {
  const [isSelected, setIsSelected] = useState(false);

  function handleClick() {
    setIsSelected((prev) => !prev);
  }

  function handleMouseOver() {
    setIsSelected((prev) => !prev);
  }
  return (
    <div
      className="star-ratings"
      onClick={handleClick}
      onMouseOver={handleMouseOver}
    >
      {isSelected ? <GoStarFill /> : <GoStar />}
    </div>
  );
}
