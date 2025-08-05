import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { ChaatBotQuestion, chaatNamesByFlavour } from '../utils';
import bg from '../assets/bg2.png';
import logo from '../assets/creator-logo.svg';
import btn from '../assets/btn.svg';
import { QRCodeSVG } from 'qrcode.react';
import { TypingText } from '../components/ui/TypingText';
import { ChaatbotStart } from './ChaatbotStart';
import ChaatbotForm from './ChaatbotForm';
import { Button } from "../components/ui/Buttons";

export default function ChaatbotQuiz() {
  const [step, setStep] = useState("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "", "1": "", "2": "", "3": "",
    chaatName: "", image: ""
  });
  const [qrValue, setQrValue] = useState('');
  const canvasRef = useRef(null);

  const currentQuestion = ChaatBotQuestion[currentIndex];

  const handleOptionClick = (option) => {
    const updatedForm = {
      ...formData,
      [`${currentIndex + 1}`]: option,
    };
    setFormData(updatedForm);

    if (currentIndex + 1 < ChaatBotQuestion.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setStep("loading");
      generateCanvasAndQr(updatedForm);
    }
  };

  const generateCanvasAndQr = (data) => {
    const flavour = data[3]?.split(" ")[1];
    const chaatOptions = chaatNamesByFlavour[flavour] || [];
    const chaatName = chaatOptions[Math.floor(Math.random() * chaatOptions.length)] || "Surprise Chaat";
    const updatedForm = { ...data, chaatName };
    setFormData(updatedForm);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = 1024;
    canvas.height = 1366;

    const bgImage = new Image();
    const logoImage = new Image();
    bgImage.src = bg;
    logoImage.src = logo;

    let bgLoaded = false, logoLoaded = false;

    const draw = async () => {
      if (!bgLoaded || !logoLoaded) return;

      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

      const logoX = (canvas.width - 362) / 2;
      const logoY = 100;
      ctx.drawImage(logoImage, logoX, logoY, 362, 215.3);

      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.font = "bold 30px sans-serif";

      let y = logoY + 215.3 + 80;
      ctx.fillText("Here's what we have cooked up for you", canvas.width / 2, y);
      y += 60;

      const cardWidth = 400, cardHeight = 60;
      const x = (canvas.width - cardWidth) / 2;
      const radius = 25;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + cardWidth - radius, y);
      ctx.quadraticCurveTo(x + cardWidth, y, x + cardWidth, y + radius);
      ctx.lineTo(x + cardWidth, y + cardHeight - radius);
      ctx.quadraticCurveTo(x + cardWidth, y + cardHeight, x + cardWidth - radius, y + cardHeight);
      ctx.lineTo(x + radius, y + cardHeight);
      ctx.quadraticCurveTo(x, y + cardHeight, x, y + cardHeight - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.font = "20px sans-serif";
      ctx.fillText(`${updatedForm[1]} + ${updatedForm[2]} + ${updatedForm[3]}`, canvas.width / 2, y + cardHeight / 2 + 5);

      y += cardHeight + 65;
      ctx.fillStyle = "#000";
      ctx.font = "bold 30px sans-serif";
      ctx.fillText("Spice things up", canvas.width / 2, y);

      y += 56;
      ctx.fillText(`Grab a plate of ${updatedForm.name}'s ${updatedForm.chaatName}!`, canvas.width / 2, y);

      const dataURL = canvas.toDataURL("image/png");
      await handleApi(dataURL, updatedForm);
    };

    bgImage.onload = () => { bgLoaded = true; draw(); };
    logoImage.onload = () => { logoLoaded = true; draw(); };
    bgImage.onerror = logoImage.onerror = (e) => console.error("Image load error", e);
  };

  const handleApi = async (base64Image, data) => {
    try {
      const imageFile = base64ToFile(base64Image, 'chaat-image.png');
      const form = new FormData();
      form.append('name', data.name);
      form.append('mood', data["1"]);
      form.append('spicePreference', data["2"]);
      form.append('chatFlavour', data["3"]);
      form.append('image', imageFile);

      const response = await fetch("https://youtube-server1-f228ee9b9bbd.herokuapp.com/api/chatbot/user-details", {
        method: "POST",
        body: form,
      });

      const result = await response.json();
      if (result.url) {
        setQrValue(result.url);
        setStep("final");
      } else {
        throw new Error("No URL in API response");
      }
    } catch (error) {
      console.error("API error:", error);
      setStep("final");
    }
  };

  const base64ToFile = (base64, filename) => {
    const [meta, data] = base64.split(',');
    const mime = meta.match(/:(.*?);/)[1];
    const bstr = atob(data);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
    return new File([u8arr], filename, { type: mime });
  };

  const resetQuiz = () => {
    console.log("Clicked logo → resetting to intro");
    setStep("intro");
    setFormData({ name: "", "1": "", "2": "", "3": "", chaatName: "", image: "" });
    setCurrentIndex(0);
    setQrValue('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <AnimatePresence mode="wait">
        {step === "loading" && (
          <motion.div key="loading" className="flex flex-col items-center min-h-screen gap-16 p-24 flex-1">
            <img src={logo} className="w-8/12 cursor-pointer" alt="Loading..." onClick={resetQuiz} />
            <TypingText text={"Reading your vibe...\nmixing the perfect chaat..."} speed={50} pause={1500} />
          </motion.div>
        )}

        {step === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
            <ChaatbotStart onStart={() => setStep("form")} />
          </motion.div>
        )}

        {step === "form" && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ChaatbotForm onSubmit={() => setStep("quiz")} setTeamName={setFormData} teamName={formData} />
          </motion.div>
        )}

        {step === "quiz" && (
          <motion.div key={`question-${currentIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inset-0 w-full z-50 p-14 flex flex-col items-center gap-24 flex-1">
            <img src={logo} alt="Creator Logo" className="w-6/12 cursor-pointer" onClick={resetQuiz} />
            <div className="text-center space-y-12 w-full">
              <h1 className="text-5xl font-bold">{currentQuestion.type || `Hey ${formData.name}`}</h1>
              <div className="text-5xl font-bold">{currentQuestion.question}</div>
              <div className={`grid gap-4 ${currentQuestion.options.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                {currentQuestion.options.map((option) => (
                  <Button key={option} onClick={() => handleOptionClick(option)} className="text-3xl text-white" style={{ backgroundImage: `url(${btn})`, backgroundSize: '100% 100%', height: '100px' }}>
                    <div className="text-3xl">{option.split(" ")[0]}</div>
                    <span className="text-3xl mt-2">{option.split(" ").slice(1).join(" ")}</span>
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === "final" && (
          <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-10 text-center flex flex-col items-center gap-12 flex-1">
            <img src={logo} className="w-6/12 cursor-pointer" alt="Creator Logo" onClick={resetQuiz} />
            <p className="text-3xl font-bold">Here's what we have cooked up for you</p>
            <Button onClick={() => generateCanvasAndQr(formData)} className="px-6 py-8 text-white bg-black tracking-wide text-3xl font-bold">
              {formData[1]} + {formData[2]} + {formData[3]}
            </Button>
            <p className="text-3xl font-bold">Spice things up</p>
            <p className="text-3xl font-bold">Grab a plate of {formData.name}'s {formData.chaatName}!</p>
            {qrValue && (
              <div className="flex flex-col items-center gap-2">
                <QRCodeSVG value={qrValue} size={180} />
                <a href={qrValue} download="chaat-result.png" className="text-black text-xl mt-2">
                  Here’s a QR code to download your custom chaat! <br />
                  Show this to the chef to get it.
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
