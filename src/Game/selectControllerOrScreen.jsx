import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function SelectControllerOrScreen() {
  const navigate = useNavigate();

  const handleSelect = (option) => {
   switch (option) {
      case "iPad 1":
        navigate("/form1");
        break;
      case "iPad 2":
        navigate("/form2");
        break;
      case "Game Screen 1":
        navigate("/game1");
        break;
      case "Game Screen 2":
        navigate("/game2");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 p-4">
      <motion.div
        className="w-full max-w-md rounded-2xl shadow-xl bg-white overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 flex flex-col items-center gap-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Select Controller or Screen
          </h1>
          <div className="flex flex-col gap-4 w-full">
            {["iPad 1", "iPad 2", "Game Screen 1", "Game Screen 2"].map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-semibold shadow hover:bg-indigo-600 transition w-full"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SelectControllerOrScreen;