import React from "react";
import "./BeforeAfterImage.css";

const BeforeAfterImage = ({ beforeSrc, afterSrc, altText }) => {
  return (
    <div className="before-after-container">
      <div className="image-comparison">
        <div className="before-image">
          <img src={beforeSrc} alt={`Before ${altText}`} />
          <span className="image-label">Before</span>
        </div>
        <div className="after-image">
          <img src={afterSrc} alt={`After ${altText}`} />
          <span className="image-label">After</span>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterImage;
