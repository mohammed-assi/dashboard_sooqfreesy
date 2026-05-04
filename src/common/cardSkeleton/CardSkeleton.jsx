import React from "react";

function CardSkeleton() {
  return Array.from({ length: 4 }).map((_, index) => (
    <div
      key={index}
      className="w-full h-48 rounded-xl bg-gray-200 animate-pulse shadow"
    >
      <div className="h-full flex flex-col items-center justify-center gap-3 p-4">
        <div className="w-20 h-20 rounded-full bg-gray-300" />
        <div className="w-3/4 h-4 bg-gray-300 rounded" />
      </div>
    </div>
  ));
}

export default CardSkeleton;
