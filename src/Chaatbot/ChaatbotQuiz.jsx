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
import back from '../assets/back.svg';
import home from '../assets/home.svg'
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
  // Remove everything except alphabets (A-Z, a-z) and spaces
  const sanitizedOption = option.replace(/[^a-zA-Z\s]/g, "");

  const updatedForm = {
    ...formData,
    [`${currentIndex + 1}`]: sanitizedOption,
  };

  setFormData(updatedForm);

  if (currentIndex + 1 < ChaatBotQuestion.length) {
    setCurrentIndex((prev) => prev + 1);
  } else {
    setStep("loading");
    generateCanvasAndQr(updatedForm);
  }
};


const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
  return y; // Return updated y position
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    // Draw logo
    const logoX = (canvas.width - 362) / 2;
    const logoY = 100;
    ctx.drawImage(logoImage, logoX, logoY, 362, 215.3);

    // Title
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.font = "30px sans-serif";

    let y = logoY + 215.3 + 100;
    ctx.fillText("Here's what we have cooked up for you", canvas.width / 2, y);
    y += 80;

    // Card
    const cardWidth = 676;
    const cardHeight = 150;
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

    ctx.fillStyle = "black";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Text inside card (with wrapping)
    ctx.fillStyle = "#fff";
    ctx.font = "bold 33px sans-serif";
    ctx.textAlign = "center";

    const comboText = `${updatedForm[1]} + ${updatedForm[2]} + ${updatedForm[3]}`;
    const comboY = y + cardHeight / 2 + 5;
    wrapText(ctx, comboText, canvas.width / 2, comboY, 620, 40); // wrapped text

    // Main dish text
    y += cardHeight + 90;
    ctx.fillStyle = "#000";
    ctx.font = "30px sans-serif";
    ctx.fillText(`Grab a plate of`, canvas.width / 2, y);

    y += 73;
    ctx.font = "bold 45px sans-serif";
    wrapText(ctx, `${updatedForm.fullName}'s ${updatedForm.chaatName}!`, canvas.width / 2, y, 800, 50);

    // Gemini footer
    ctx.font = " 25px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "left";
    ctx.fillText(`Made With Google Gemini`, 30, canvas.height - 30);

    // Export canvas
    const dataURL = canvas.toDataURL("image/png");
    console.log(dataURL);
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
      form.append('name', data.fullName);
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

  const handleBack = () => {
  if (step === "quiz" && currentIndex > 0) {
    setCurrentIndex((prev) => prev - 1);
  } else if (step === "quiz" && currentIndex === 0) {
    setStep("form");
  } else if (step === "form") {
    setStep("intro");
  } else if (step === "final") {
    setStep("quiz");
  }
};


  return (
    <div className=" relative flex flex-col items-center justify-center min-h-screen p-2" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
<div className="absolute top-10 left-0 w-full flex justify-between items-center h-20 px-6 z-100">
  {(step === "quiz"  || step==="final") && (
    <img
      src={back}
      alt="Back"
      className="h-16 cursor-pointer"
      onClick={handleBack}
    />
  )}
  {step !== "intro" && (<img
    src={home}
    alt="Home"
    className="h-16 cursor-pointer"
    onClick={resetQuiz}
  />)
}
</div>


      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <AnimatePresence mode="wait">
        {step === "loading" && (
          <motion.div key="loading" className="flex flex-col items-center min-h-screen gap-16 p-24 flex-1 w-full">
            <img src={logo} className="w-60 cursor-pointer pb-20" alt="Loading..." onClick={resetQuiz} />
            <TypingText text={"Reading your vibe...\nmaking the perfect chaat..."} speed={50} pause={1500} />
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
          <motion.div key={`question-${currentIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inset-0 w-full z-50 p-16 pt-20 flex flex-col items-center gap-24 flex-1">
            <img src={logo} alt="Creator Logo" className="w-4/12 cursor-pointer" onClick={resetQuiz} />
            <div className="text-center space-y-16 w-full">
              <h1 className={`font-bold ${currentQuestion.type?.startsWith("Hey") || (!currentQuestion.type && formData.handles) ? 'text-6xl' : 'text-5xl'}`}>
                {currentQuestion.type || `Hey ${formData.handles}`}
              </h1>

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
          <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-10 text-center flex flex-col items-center gap-14 flex-1">
            <img src={logo} className="w-4/12 cursor-pointer" alt="Creator Logo" onClick={resetQuiz} />
            <p className="text-2xl text-black">Here’s the chaat you should have today!</p>
            <Button onClick={() => generateCanvasAndQr(formData)} className="px-6 py-8 text-white bg-black tracking-wide text-3xl font-bold">
              {formData[1]} + {formData[2]} + {formData[3]}
            </Button>
            {/* <p className="text-3xl font-bold">Spice things up</p> */}
           <p className="text-4xl font-bold">
            <span className="block text-2xl font-normal mb-3 text-black">
              Grab a plate of
            </span>
            {formData.fullName}'s {formData.chaatName}!
          </p>

            {qrValue && (
              <div className="flex flex-col items-center gap-2 text-2xl">
                <QRCodeSVG value={qrValue} size={180} />
                <h1 className="text-black text-2xl mt-6 ">
                  Here’s a QR code to download your custom chaat! <br />
                  Show this to the chef to get it.
                </h1>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
  
    </div>
  );
}
