import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "../components/ui/Cards";
import { Button } from "../components/ui/Buttons";
import { AnimatePresence, motion } from "framer-motion";
import { questions as defaultQuestions, randomizeQuestionsAndOptions, url } from "../utils";
import bg from "../assets/bg.png";
import { ClockIcon } from "../components/ui/Clock";
import QuizForm from "./QuizForm";
import { QuizStart } from "./QuizStart";
import btn from "../assets/btn.svg";
import Tableno from "./Tableno";
import { Waiting } from "./Waiting";
import Footer from "../components/ui/Footer";

export default function QuizApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [showLanding, setShowLanding] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const [teamName, setTeamName] = useState("");
  const [id, setID] = useState("");
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [tableNo, setTableNo] = useState("");

  // Randomize and memoize questions once
  const questions = useMemo(() => randomizeQuestionsAndOptions(defaultQuestions), []);
  const currentQuestion = questions[currentIndex];

  // Poll server to check if quiz has started
  useEffect(() => {
    if (!isWaiting) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${url}/api/quiz/is-started`);
        const data = await res.json();

        if (data.isStarted) {
          setIsWaiting(false);
          setShowQuiz(true);
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Failed to check quiz start", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isWaiting]);

  // Timer logic
  useEffect(() => {
    if (showQuiz && !hasSubmitted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showQuiz && timeLeft === 0) {
      handleNext(score);
    }
  }, [showQuiz, timeLeft, hasSubmitted]);

  const handleOptionClick = (option) => {
    if (!hasSubmitted) setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;

    let s = score;
    const isCorrect = selectedOption === currentQuestion.answer;

    if (isCorrect) {
      s += 10;
      setScore((prev) => prev + 10);
    }

    setHasSubmitted(true);

    setTimeout(() => handleNext(s), 1000);
  };

  const handleNext = (score) => {
    setSelectedOption(null);
    setHasSubmitted(false);
    setTimeLeft(20);
    setTotalTimeSpent((prev) => prev + (20 - timeLeft));

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      fetch(`${url}/api/score`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: score,
          timeTaken: totalTimeSpent,
          id: id,
        }),
      })
        .then((res) => res.json())
        .then(() => setShowFinalScore(true))
        .catch((err) => {
          console.error("Score update failed", err);
          setShowFinalScore(true);
        });
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
        {showLanding && (
          <Tableno
            tableno={tableNo}
            onChange={(e) => setTableNo(e.target.value)}
            onClick={() => {
              setShowLanding(false);
              setShowIntro(true);
            }}
          />
        )}

        {showIntro && !showQuiz && (
          <QuizStart onStart={() => setShowIntro(false)} />
        )}

        {isWaiting && <Waiting />}

        {!showLanding &&
          !showIntro &&
          !showQuiz &&
          !showFinalScore &&
          !isWaiting && (
            <motion.div
              key="form"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: showQuiz ? "-100%" : 0, opacity: showQuiz ? 0 : 1 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-50"
            >
              <QuizForm
                onSubmit={async () => {
                  try {
                    const res = await fetch(`${url}/api/score`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        teamName,
                        tableNo: Number(tableNo),
                        score: 0,
                        timeTaken: 0,
                      }),
                    });
                    const data = await res.json();
                    setID(data._id);
                    if (!isWaiting) setIsWaiting(true);
                  } catch (err) {
                    console.error("Error creating score", err);
                  }
                }}
                shouldExit={showQuiz}
                setTeamName={setTeamName}
                teamName={teamName}
                tableNo={tableNo}
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
              <CardContent className="p-6 space-y-14">
                <div className="relative flex justify-between items-center text-xl h-16 m-3 mb-24">
                  <span className="font-extrabold flex items-center gap-1 text-5xl">
                    <ClockIcon />
                    <span
                      className={`${
                        timeLeft < 6
                          ? "text-red-600 animate-blink text-5xl"
                          : "text-black text-5xl"
                      }`}
                    >
                      00:{timeLeft.toString().padStart(2, "0")}
                    </span>
                  </span>

                  <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl font-extrabold text-center">
                    Question <br />
                    {currentIndex + 1} / {questions.length}
                  </span>

                  <span className="font-extrabold text-5xl">{score} ⭐</span>
                </div>

                <div className="text-2xl font-medium text-center bg-black text-white p-10 rounded-xl">
                  {currentQuestion.question}
                </div>

                <div className="grid grid-cols-2 gap-8 gap-y-10">
                  {currentQuestion.options.map((option) => {
                    const isCorrect = option === currentQuestion.answer;
                    const isSelected = selectedOption === option;

                    let optionStyle =
                      "bg-black border border-gray-300 text-white text-2xl";

                    if (hasSubmitted) {
                      if (isCorrect) {
                        optionStyle =
                          "bg-green-500 text-white border-green-600 text-3xl font-bold shadow-md";
                      } else if (isSelected) {
                        optionStyle =
                          "bg-red-500 text-white border-red-600 text-2xl";
                      } else {
                        optionStyle =
                          "bg-gray-200 text-gray-700 border-gray-300 text-black text-2xl";
                      }
                    } else if (isSelected) {
                      optionStyle =
                        "border-4 border-white bg-black text-white text-2xl";
                    }

                    return (
                      <Button
                        key={option}
                        onClick={() => handleOptionClick(option)}
                        disabled={hasSubmitted}
                        className={`w-full text-center justify-start px-4 py-4 rounded transition-colors duration-300 border ${optionStyle}`}
                      >
                        {option}
                      </Button>
                    );
                  })}
                </div>

                <div className="flex justify-center mt-6">
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedOption || hasSubmitted}
                    className={`text-white text-2xl font-bold py-2 hover:opacity-80 transition disabled:opacity-40 disabled:cursor-not-allowed`}
                    style={{
                      backgroundImage: `url(${btn})`,
                      backgroundSize: "100% 100%",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      width: "200px",
                      height: "80px",
                    }}
                  >
                    Submit
                  </Button>
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
            className="p-10 text-center"
          >
            <h1 className="text-5xl font-extrabold ">Well Done, Creator!</h1>
            <h2 className="text-5xl font-extrabold  mt-16 mb-16">Your final score is</h2>
            <div className="text-6xl font-bold text-white">⭐{score}</div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
