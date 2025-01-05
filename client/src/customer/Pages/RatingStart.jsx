import React from 'react';

const RatingStar = ({ rating }) => {
  // Helper function to determine the star type based on index
  const getStarType = (index) => {
    if (rating >= index + 1) {
      return "fa-solid fa-star"; // Full star
    } else if (rating >= index + 0.5) {
      return "fa-solid fa-star-half-stroke"; // Half star
    } else {
      return "fa-regular fa-star"; // Empty star
    }
  };

  return (
    <div className="rating-star-container">
      {[...Array(5)].map((_, index) => (
        <i
          key={index}
          className={getStarType(index)}
          style={{ color: "black"}} // Gold color
        ></i>
      ))}
    </div>
  );
};

const SmallRatingStar = ({ rating }) => {
    // Helper function to determine the star type based on index
    const getStarType = (index) => {
      if (rating >= index + 1) {
        return "fa-solid fa-star fa-sm"; // Full star
      } else if (rating >= index + 0.5) {
        return "fa-solid fa-star-half-stroke fa-sm"; // Half star
      } else {
        return "fa-regular fa-star fa-sm"; // Empty star
      }
    };
  
    return (
      <div className="rating-star-container" style={{gap: "2px"}}>
        {[...Array(5)].map((_, index) => (
          <i
            key={index}
            className={getStarType(index)}
            style={{ color: "black"}} // Gold color
          ></i>
        ))}
      </div>
    );
  };

export {SmallRatingStar, RatingStar}