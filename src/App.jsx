import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Form from "./Game/Form";
import Form2 from "./Game/Form2";
import Game from "./Game/Game";
import Game2 from "./Game/Game2";
import SelectControllerOrScreen from "./Game/selectControllerOrScreen";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100 text-center">
      <h1 className="text-4xl font-bold">Welcome to the App</h1>
      <div className="flex flex-col gap-4">
        <Link to="/quiz">
          <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition">
            Go to Quiz
          </button>
        </Link>
        <Link to="/chaat">
          <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition">
            Go to Chat
          </button>
        </Link>

          <Link to="/handlehunt1">
          <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition">
            Handle Hunt 1
          </button>
        </Link>

         <Link to="/handlehunt2">
          <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition">
            Handle Hunt 2
          </button>
        </Link>

         <Link to="/leaderboard">
          <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition">
           leaderboard
          </button>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chaat" element={<ChaatbotQuiz />} />
        <Route path="/quiz" element={<QuizApp />} />
         <Route path="/handleHunt1" element={<HandleHunt creators={creatorsByCategory} categories={categories1}/>} />
          <Route path="/handleHunt2" element={<HandleHunt creators={creatorsByCategory2} categories={categories2}/>} />
         <Route path="/leaderboard" element={<LeaderBoard/>}/>
      </Routes>
      <Footer/> */}

      <Routes>
        <Route path="/" element={<SelectControllerOrScreen />} />
        <Route path="/form1" element={<Form />} />
        <Route path="/form2" element={<Form2 />} />
        <Route path="/game1" element={<Game />} />
        <Route path="/game2" element={<Game2 />} />
      </Routes>
    </Router>
  );
}

export default App;
