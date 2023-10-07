import React from "react";
import { motion } from "framer-motion";

const Button = (props) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1, backgroundColor: props.color }}
      whileTap={{ scale: 0.9 }}
      className="btn"
    >
      {props.texto}
    </motion.button>
  );
};

export default Button;
