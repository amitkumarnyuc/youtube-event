import React from 'react'
import bg from '../assets/bg.png'

const data = [
  { rank: 1, name: 'Alice', score: 980, country: 'USA' },
  { rank: 2, name: 'Bob', score: 940, country: 'Canada' },
  { rank: 3, name: 'Charlie', score: 910, country: 'UK' },
  { rank: 4, name: 'David', score: 900, country: 'Germany' },
  { rank: 5, name: 'Eve', score: 870, country: 'France' },
  { rank: 6, name: 'Frank', score: 850, country: 'Australia' },
  { rank: 7, name: 'Grace', score: 830, country: 'India' },
  { rank: 8, name: 'Heidi', score: 810, country: 'Brazil' },
  { rank: 9, name: 'Ivan', score: 800, country: 'Russia' },
  { rank: 10, name: 'Judy', score: 790, country: 'Japan' }
]

function LeaderBoard() {
  return (
    <div
      className="p-4"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <h1 className="text-3xl font-bold mb-6 text-white text-center drop-shadow-lg">Leaderboard</h1>
      <div className="overflow-x-auto rounded-lg shadow-lg max-w-4xl mx-auto bg-black/60">
        <table className="min-w-full text-white">
          <thead className="bg-black/40">
            <tr>
              <th className="px-4 py-2 border-b text-center">Rank</th>
              <th className="px-4 py-2 border-b text-center">Team Name</th>
              <th className="px-4 py-2 border-b text-center">Table No</th>
              <th className="px-4 py-2 border-b text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((player) => (
              <tr key={player.rank} className="hover:bg-white/10">
                <td className="px-4 py-2 border-b text-center">{player.rank}</td>
                <td className="px-4 py-2 border-b text-center">{player.name}</td>
                <td className="px-4 py-2 border-b text-center">{player.score}</td>
                <td className="px-4 py-2 border-b text-center">{player.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LeaderBoard
