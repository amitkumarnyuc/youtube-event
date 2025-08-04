import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ChaatbotQuiz from "./Chaatbot/ChaatbotQuiz";
import QuizApp from "./Quiz/Quiz";
import HandleHunt from "./HandleHunt/HandleHunt";

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

          <Link to="/handlehunt">
          <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition">
            Handle Hunt
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
         <Route path="/handleHunt" element={<HandleHunt />} />
      </Routes>
    </Router>
  );
}

export default App;
