import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/Cards";
import { Button } from "../components/ui/Buttons";
import { AnimatePresence, motion } from "framer-motion";
import { questions } from "../utils";
import bg from "../assets/bg.png";
import { ClockIcon } from "../components/ui/Clock";
import QuizForm from "./QuizForm";
import { QuizStart } from "./QuizStart";

export default function QuizApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (showQuiz) {
      if (timeLeft === 0) {
        handleNext();
        return;
      }
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, showQuiz]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option === currentQuestion.answer) {
      setScore((prev) => prev + 10);
    }
    setTimeout(() => handleNext(), 1000);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setTimeLeft(20);
    setTotalTimeSpent((prev) => prev + (20 - timeLeft));
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Call API when quiz ends
      const payload = {
        tableNo: Number(1) || 0, // fallback to 0 if not a number
        score: +score,
        teamName: teamName,
        timeTaken: totalTimeSpent + (20 - timeLeft),
      };
      fetch("http://localhost:5001/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          // Optionally handle response
        })
        .catch((err) => {
          // Optionally handle error
        });
      setShowFinalScore(true);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-2"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <AnimatePresence mode="wait">
        {showIntro && <QuizStart onStart={() => setShowIntro(false)} />}

        {!showIntro && !showQuiz && !showFinalScore && (
          <motion.div
            key="form"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: showQuiz ? "-100%" : 0, opacity: showQuiz ? 0 : 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50"
          >
            <QuizForm
              onSubmit={() => setShowQuiz(true)}
              shouldExit={showQuiz}
              setTeamName={setTeamName}
              teamName={teamName}
            />
          </motion.div>
        )}

        {showQuiz && !showFinalScore && (
          <motion.div
            key={`question-${currentIndex}`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-9/10"
          >
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="relative flex justify-between items-center text-lg h-16 m-3 mb-11">
                  <span className="font-extrabold flex items-center gap-1 text-2xl">
                    <ClockIcon />
                    <span className={`${timeLeft < 6 ? "text-red-600 animate-blink text-3xl" : "text-black-600 text-3xl"}`}>
                      00:{timeLeft.toString().padStart(2, '0')}
                    </span>
                  </span>

                  <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-extrabold text-center">
                    Question<br />{currentIndex + 1} / {questions.length}
                  </span>

                  <span className="font-extrabold text-3xl">{score} ⭐</span>
                </div>

                <div className="text-lg font-medium text-center bg-black text-white p-5 rounded-xl">
                  {currentQuestion.question}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {currentQuestion.options.map((option) => {
                    const isCorrect = option === currentQuestion.answer;
                    const isSelected = selectedOption === option;

                    let optionStyle =
                      "bg-black border border-gray-300 text-white";
                    if (selectedOption) {
                      if (isCorrect) {
                        optionStyle =
                          "bg-green-500 text-white border-green-600 text-lg font-bold shadow-md";
                      } else if (isSelected) {
                        optionStyle = "bg-red-500 text-white border-red-600";
                      } else {
                        optionStyle =
                          "bg-gray-200 text-gray-700 border-gray-300 text-black";
                      }
                    }

                    return (
                      <Button
                        key={option}
                        onClick={() => handleOptionClick(option)}
                        disabled={!!selectedOption}
                        className={`w-full text-center justify-start px-4 py-2 rounded transition-colors duration-300 border ${optionStyle}`}
                      >
                        {option}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {showFinalScore && (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="p-10 text-center "
          >
            <h1 className="text-4xl font-extrabold uppercase">
              Well Done, Creator!
            </h1>
            <h2 className="text-4xl font-extrabold uppercase mt-10 mb-10">
              Your final score is
            </h2>
            <div className="text-5xl font-bold text-white">⭐{score}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
