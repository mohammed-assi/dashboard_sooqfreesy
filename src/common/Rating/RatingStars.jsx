import React from "react";

const RatingStars = ({ rating }) => {
  const totalStars = 5;
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;

  return (
    <div className="flex items-center space-x-1">
      {[...Array(totalStars)].map((_, index) => {
        if (index < filledStars) {
          // full star
          return <i key={index} className="fa-solid fa-star text-yellow-500"></i>;
        } else if (index === filledStars && hasHalfStar) {
          // half star
          return <i key={index} className="fa-solid fa-star-half-stroke text-yellow-500"></i>;
        } else {
          // empty star
          return <i key={index} className="fa-regular fa-star text-yellow-500"></i>;
        }
      })}
      <span className="ml-2 text-sm font-medium text-gray-700">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingStars;
