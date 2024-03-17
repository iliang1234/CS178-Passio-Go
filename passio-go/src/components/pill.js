import React from "react";

const Pill = ({ className = "", variant = "SEC" }) => {
  const getVariantClass = (variant) => {
    switch (variant) {
      case "SEC":
        return "pill-sec";
      case "Yard":
        return "pill-yard";
      case "Quad":
        return "pill-quad";
      default:
        return "pill-sec";
    }
  };

  const fullClassName = `d-inline-block inline-flex align-items-center px-2 pill-padding-y rounded-pill pill-text-small ${getVariantClass(
    variant
  )} ${className}`;

  return (
    <div className={fullClassName}>
      <div>{variant}</div>
    </div>
  );
};

export default Pill;
