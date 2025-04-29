// src/components/SkeletonCard.tsx
import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="max-w-72 max-h-72 w-full h-full bg-white rounded-xl shadow-md overflow-hidden p-4 m-4 animate-pulse transition-all duration-300">
      {/* Header with icon and title placeholders */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Icon placeholder */}
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          {/* Title placeholder */}
          <div className="h-6 bg-gray-200 rounded w-2/3"></div>
        </div>
        {/* Share and Delete icon placeholders */}
        <div className="flex gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Content placeholder (e.g., iframe or blockquote) */}
      <div className="w-full pt-4">
        <div className="w-full h-48 bg-gray-200 rounded"></div> {/* Matches iframe height */}
      </div>
    </div>
  );
};

export default SkeletonCard;