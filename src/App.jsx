import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ChaatbotQuiz from "./Chaatbot/ChaatbotQuiz";
import QuizApp from "./Quiz/Quiz";
import HandleHunt from "./HandleHunt/HandleHunt";
import LeaderBoard from "./Quiz/LeaderBoard";
import { creatorsByCategory, creatorsByCategory2 } from "./utils";
import Footer from "./components/ui/Footer";

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chaat" element={<ChaatbotQuiz />} />
        <Route path="/quiz" element={<QuizApp />} />
         <Route path="/handleHunt1" element={<HandleHunt creators={creatorsByCategory}/>} />
          <Route path="/handleHunt2" element={<HandleHunt creators={creatorsByCategory2}/>} />
         <Route path="/leaderboard" element={<LeaderBoard/>}/>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
