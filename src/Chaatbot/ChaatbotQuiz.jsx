import React, { useState, useRef } from 'react';
import { Card, CardContent } from "../components/ui/Cards";
import { Button } from "../components/ui/Buttons";
import { AnimatePresence, motion } from "framer-motion";
import { ChaatBotQuestion } from '../utils';
import bg from '../assets/bg2.png';
import { ChaatbotStart } from './ChaatbotStart';
import ChaatbotForm from './ChaatbotForm';
import logo from '../assets/creator-logo.svg';
import btn from '../assets/btn.svg';
import { QRCodeSVG } from 'qrcode.react';
import { TypingText } from '../components/ui/TypingText';

export default function ChaatbotQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", "1": "", "2": "", "3": "" });
  const [qrValue, setQrValue] = useState('');

  const canvasRef = useRef(null);
  const currentQuestion = ChaatBotQuestion[currentIndex];

  const handleOptionClick = (option) => {
    const data = {
      ...formData,
      [`${currentIndex + 1}`]: option,
    };
    setFormData(data);

    if (currentIndex + 1 < ChaatBotQuestion.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowQuiz(false);
      setShowLoading(true);
      setTimeout(() => {
        generateCanvasAndQr(data);
        setShowLoading(false);
        setShowFinalScore(true);
      }, 4000);
    }
  };

  const generateCanvasAndQr = (data) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = 1024;
    canvas.height = 1366;

    const bgImage = new Image();
    const logoImage = new Image();
    bgImage.src = bg;
    logoImage.src = logo;

    let bgLoaded = false;
    let logoLoaded = false;

    const draw = () => {
      if (!bgLoaded || !logoLoaded) return;

      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      const logoWidth = 230;
      const logoHeight = 149;
      const logoX = (canvas.width - logoWidth) / 2;
      const logoY = 100;
      ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);

      ctx.fillStyle = "#000";
      ctx.textAlign = "center";

      let currentY = logoY + logoHeight + 80;
      ctx.font = "bold 30px sans-serif";
      ctx.fillText("Here's what we have cooked up for you", canvas.width / 2, currentY);
      currentY += 60;

      const cardWidth = 400;
      const cardHeight = 60;
      const cardX = (canvas.width - cardWidth) / 2;
      const cardY = currentY;
      const radius = 25;

      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.moveTo(cardX + radius, cardY);
      ctx.lineTo(cardX + cardWidth - radius, cardY);
      ctx.quadraticCurveTo(cardX + cardWidth, cardY, cardX + cardWidth, cardY + radius);
      ctx.lineTo(cardX + cardWidth, cardY + cardHeight - radius);
      ctx.quadraticCurveTo(cardX + cardWidth, cardY + cardHeight, cardX + cardWidth - radius, cardY + cardHeight);
      ctx.lineTo(cardX + radius, cardY + cardHeight);
      ctx.quadraticCurveTo(cardX, cardY + cardHeight, cardX, cardY + cardHeight - radius);
      ctx.lineTo(cardX, cardY + radius);
      ctx.quadraticCurveTo(cardX, cardY, cardX + radius, cardY);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.font = "20px sans-serif";
      ctx.fillText(`${data[1]} + ${data[2]} + ${data[3]}`, canvas.width / 2, cardY + cardHeight / 2 + 5);

      currentY = cardY + cardHeight + 65;
      ctx.fillStyle = "#000";
      ctx.font = "bold 30px sans-serif";
      ctx.fillText("Spice things up", canvas.width / 2, currentY);

      currentY += 56;
      ctx.font = "bold 30px sans-serif";
      ctx.fillText(`Grab a plate of ${data.name} Chilli-Tangy Papdi Chaat!`, canvas.width / 2, currentY);

      const dataURL = canvas.toDataURL("image/png");
      console.log(dataURL)
      // setQrValue(dataURL);
    };

    bgImage.onload = () => { bgLoaded = true; draw(); };
    logoImage.onload = () => { logoLoaded = true; draw(); };

    bgImage.onerror = logoImage.onerror = (e) => {
      console.error("Image load error", e);
      setShowFinalScore(true);
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <AnimatePresence mode="wait">
        {showLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="flex flex-col items-center justify-start min-h-screen gap-16 p-24" >
            <img src={logo} className="w-8/12" alt="Loading..." />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <TypingText text={"Reading your vibe...\nmixing the perfect chaat..."} speed={50} pause={1500} />
          </motion.div>
        ) : showIntro ? (
          <ChaatbotStart onStart={() => setShowIntro(false)} />
        ) : !showQuiz && !showFinalScore ? (
          <motion.div key="form" initial={{ y: 0, opacity: 1 }} animate={{ y: showQuiz ? "-100%" : 0, opacity: showQuiz ? 0 : 1 }} transition={{ duration: 0.6 }} className="inset-0 z-50">
            <ChaatbotForm onSubmit={() => setShowQuiz(true)} setTeamName={setFormData} teamName={formData} />
          </motion.div>
        ) : showQuiz && !showFinalScore ? (
          <motion.div key={`question-${currentIndex}`} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} transition={{ duration: 0.4 }} className="inset-0 w-full z-50 p-14 flex flex-col items-center gap-24 flex-1">
            <img src={logo} alt="Creator Logo" className="w-6/12" />
            <div className="text-center space-y-12 w-full">
              <h1 className="text-5xl font-bold">{currentQuestion.type || `Hey ${formData.name}`}</h1>
              <div className="text-5xl font-bold">{currentQuestion.question}</div>
              <div className={`grid gap-4 gap-x-4 ${currentQuestion.options.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                {currentQuestion.options.map((option) => (
                  <Button key={option} onClick={() => handleOptionClick(option)} disabled={!!selectedOption} className="text-3xl text-white" style={{ backgroundImage: `url(${btn})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', height: '100px' }}>
                   <div className="text-3xl">{option.split(" ")[0]}</div>
    <span className="text-3xl mt-2">{option.split(" ").slice(1).join(" ")}</span>
                    </Button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : showFinalScore ? (
          <motion.div key="final" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="p-10 text-center flex flex-col items-center gap-20 flex-1">
            <img src={logo} className="w-6/12" alt="Creator Logo" />
            <p className="text-5xl font-bold">Here's what we have cooked up for you</p>
            <Button onClick={() => generateCanvasAndQr(formData)} className="px-8 py-8 text-white bg-black tracking-wide text-4xl font-bold">{formData[1]} + {formData[2]} + {formData[3]}</Button>
            <p className="text-5xl font-bold">Spice things up</p>
            <p className="text-5xl font-bold">Grab a plate of {formData.name}'s Chilli-Tangy Papdi Chaat!</p>
            {qrValue && (
              <div className="flex flex-col items-center gap-2">
                <QRCodeSVG value={qrValue} size={180} />
                <a href={qrValue} download="chaat-result.png" className="text-blue-500 underline mt-2">Download Image</a>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
