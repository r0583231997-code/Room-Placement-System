import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from "./Navbar";
import RoomManagement from "./RoomManagement"; // 1. ייבוא הקומפוננטה שכתבת
import '../App.css'

function App() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/rooms')
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Navbar />

        <header>
          <h1>מערכת שיבוץ חדרים - סמינר</h1>
        </header>

        <main>
          <Routes>
            {/* דף הבית */}
            <Route path="/" element={
              <section id="room-display">
                <h2>רשימת חדרים קיימים</h2>
                {loading ? <p>טוען נתונים...</p> : (
                   <div className="room-grid">
                     {rooms.map((room) => (
                       <div key={room._id} className="room-card">
                         <h3>אגף {room.wing}</h3>
                         <p>קומה: {room.floor}</p>
                         <p>קיבולת: {room.size}</p>
                       </div>
                     ))}
                   </div>
                )}
              </section>
            } />

            {/* 2. חיבור דף ניהול חדרים לניתוב /rooms */}
            <Route path="/rooms" element={<RoomManagement />} />

            {/* דף שיבוץ בנות */}
            <Route path="/placement" element={<div style={{padding: '20px'}}><h2>שיבוץ בנות - דף בעבודה</h2></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App;