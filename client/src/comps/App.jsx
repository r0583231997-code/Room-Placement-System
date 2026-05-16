import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import RoomManagement from './RoomManagement';
import RoomSchedule from './RoomSchedule';
import RoomSearchPage from './RoomSearchPage';
// תיקון הנתיב - יציאה מתיקיית comps לתיקיית src
import "../App.css"; 

const Home = ({ rooms, loading }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <section className="hero-dashboard">
        <div className="hero-text">
          <h2>שלום, ברוכה הבאה</h2>
          <p>מערכת ניהול ושיבוץ חדרים חכמה לסמינר.</p>
          <p>כאן תוכלי לראות תמונת מצב עדכנית.</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{Array.isArray(rooms) ? rooms.length : 0}</span>
            <span className="stat-label">חדרים במערכת</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {Array.isArray(rooms) 
                ? rooms.filter(r => r.hasProjector).length 
                : 0
              }
            </span>
            <span className="stat-label">חדרים עם מקרן</span>
          </div>
        </div>
      </section>

      <section className="quick-actions">
        <h3>פעולות מהירות</h3>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => navigate('/search')}>
            🔍 חיפוש חדר פנוי
          </button>
          <button className="action-btn secondary" onClick={() => navigate('/rooms')}>
            ➕ ניהול חדרים
          </button>
        </div>
      </section>

      <section id="room-display">
        <h3>מבט מהיר על החדרים</h3>
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="room-grid">
            {rooms.map((room) => (
              <div key={room._id} className="room-card">
                <div className="room-card-header" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                  <h3>אגף {room.wing}</h3>
                  <span className="room-tag">קומה {room.floor}</span>
                </div>
                <div className="room-details">
                  <p><span>קיבולת:</span> <strong>{room.size} בנות</strong></p>
                  <p><span>מקרן:</span> <strong>{room.hasProjector ? "✅ קיים" : "❌ אין"}</strong></p>
                </div>
                <button className="view-btn" onClick={() => navigate(`/rooms/${room._id}/schedule`)}>
                  צפייה בלו"ז
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

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
        <main>
          <Routes>
            <Route path="/" element={<Home rooms={rooms} loading={loading} />} />
            <Route path="/rooms" element={<RoomManagement />} />
            <Route path="/rooms/:id/schedule" element={<RoomSchedule />} />
            <Route path="/search" element={<RoomSearchPage />} />
            <Route path="/placement" element={
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <h2>שיבוץ בנות - בקרוב</h2>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;