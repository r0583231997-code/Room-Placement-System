import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from "./Navbar";
import '../App.css'

function App() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // פנייה לשרת ה-Node.js שיושב בפורט 5000
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
        {/* סרגל הניווט שיופיע בכל הדפים */}
        <Navbar />

        <header>
          <h1>מערכת שיבוץ חדרים - סמינר</h1>
        </header>

        <main>
          <Routes>
            {/* דף הבית - מציג את רשימת החדרים הקיימת */}
            <Route path="/" element={
              <section id="room-display">
                <h2>רשימת חדרים קיימים</h2>
                
                {loading ? (
                  <p>טוען נתונים מהמסד...</p>
                ) : rooms.length > 0 ? (
                  <div className="room-grid">
                    {rooms.map((room) => (
                      <div key={room._id} className="room-card">
                        <h3>אגף {room.wing}</h3>
                        <p>קומה: {room.floor}</p>
                        <p>קיבולת: {room.size} בנות</p>
                        <p>{room.hasProjector ? "✅ כולל מקרן" : "❌ ללא מקרן"}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>לא נמצאו חדרים במערכת.</p>
                )}
              </section>
            } />

            {/* נתיבים נוספים שתוכלו למלא בהמשך המשימות מהטבלה */}
            <Route path="/rooms" element={<div style={{padding: '20px'}}><h2>ניהול חדרים - דף בעבודה</h2></div>} />
            <Route path="/placement" element={<div style={{padding: '20px'}}><h2>שיבוץ בנות - דף בעבודה</h2></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App