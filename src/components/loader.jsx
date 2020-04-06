import React from "react";
import { motion } from "framer-motion";

const containerStyle = {
  position: "relative",
  width: "3rem",
  height: "3rem",
  boxSizing: "border-box",
};

const circleStyle = {
  display: "block",
  width: "4rem",
  height: "4rem",
  border: "1rem solid #f3f3f3",
  borderTop: "1rem solid #657dea",
  borderRadius: "50%",
  position: "absolute",
  boxSizing: "border-box",
  top: 0,
  left: 0,
};

const spinTransition = {
  loop: Infinity,
  ease: "linear",
  duration: 1,
};

export default function Loader() {
  return (
    <div style={containerStyle}>
      <motion.span
        style={circleStyle}
        animate={{ rotate: 360 }}
        transition={spinTransition}
      />
    </div>
  );
}
