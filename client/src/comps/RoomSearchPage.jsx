import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RoomSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    date: '',
    startTime: '',
    endTime: '',
    minSize: '',
    wing: '',
    floor: '',
    hasProjector: ''
  });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [activePlacementRoom, setActivePlacementRoom] = useState(null);
  const [tempForm, setTempForm] = useState({ purpose: '', type: 'placement' });

  const handleSearch = async () => {
    if (!searchParams.date || !searchParams.startTime || !searchParams.endTime) {
      alert("יש למלא לפחות תאריך, שעת התחלה ושעת סיום");
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, val]) => {
        if (val !== '') params.append(key, val);
      });

      const res = await axios.get(
        `http://localhost:5000/api/rooms/available?${params.toString()}`
      );
      setResults(res.data);
    } catch (err) {
      setResults([]);
      alert(err.response?.data?.message || "שגיאה בחיפוש");
    }
    setSearched(true);
    setLoading(false);
  };

  const handleAddTempPlacement = async (roomId) => {
    if (!tempForm.purpose) {
      alert("יש למלא סיבת שיבוץ");
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/temporary-placements', {
        room: roomId,
        date: searchParams.date,
        startTime: searchParams.startTime,
        endTime: searchParams.endTime,
        purpose: tempForm.purpose,
        type: tempForm.type
      });
      alert("✅ שיבוץ זמני נוסף בהצלחה!");
      setActivePlacementRoom(null);
      setTempForm({ purpose: '', type: 'placement' });
    } catch (err) {
      alert(err.response?.data?.message || "שגיאה בהוספת שיבוץ");
    }
  };

  return (
    <div className="search-page">
      <h2 style={{ fontSize: '2.2rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span>🔍</span> חיפוש חדר פנוי
      </h2>

      {/* טופס חיפוש - משתמש בכרטיסייה הלבנה והרעננה */}
      <div className="hero-dashboard" style={{ borderRight: '6px solid var(--mint-primary)', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>פרמטרי חיפוש</h3>
        
        <div className="search-form-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '20px', 
          width: '100%' 
        }}>
          <div className="input-group">
            <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', fontSize: '0.9rem' }}>📅 תאריך</label>
            <input type="date" className="view-btn" style={{ background: 'white', border: '1px solid #e2e8f0', textAlign: 'right' }}
              value={searchParams.date} onChange={e => setSearchParams({ ...searchParams, date: e.target.value })} />
          </div>

          <div className="input-group">
            <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', fontSize: '0.9rem' }}>🕐 התחלה</label>
            <input type="time" className="view-btn" style={{ background: 'white', border: '1px solid #e2e8f0' }}
              value={searchParams.startTime} onChange={e => setSearchParams({ ...searchParams, startTime: e.target.value })} />
          </div>

          <div className="input-group">
            <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', fontSize: '0.9rem' }}>🕑 סיום</label>
            <input type="time" className="view-btn" style={{ background: 'white', border: '1px solid #e2e8f0' }}
              value={searchParams.endTime} onChange={e => setSearchParams({ ...searchParams, endTime: e.target.value })} />
          </div>

          <div className="input-group">
            <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', fontSize: '0.9rem' }}>👥 כמות בנות</label>
            <input type="number" placeholder="לדוג' 30" className="view-btn" style={{ background: 'white', border: '1px solid #e2e8f0' }}
              value={searchParams.minSize} onChange={e => setSearchParams({ ...searchParams, minSize: e.target.value })} />
          </div>

          <div className="input-group">
            <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', fontSize: '0.9rem' }}>🏢 אגף</label>
            <select className="view-btn" style={{ background: 'white', border: '1px solid #e2e8f0' }}
              value={searchParams.wing} onChange={e => setSearchParams({ ...searchParams, wing: e.target.value })}>
              <option value="">הכל</option>
              <option value="שמאל">שמאל</option>
              <option value="ימין">ימין</option>
              <option value="מרכז">מרכז</option>
              <option value="חדש">חדש</option>
            </select>
          </div>
        </div>

        <button className="action-btn" style={{ marginTop: '2rem', width: '250px' }} onClick={handleSearch}>
          {loading ? 'מחפש...' : '🔍 חפש חדרים פנויים'}
        </button>
      </div>

      {/* תצוגת תוצאות */}
      {searched && (
        <section>
          <h3 style={{ marginBottom: '2rem' }}>
            {results.length > 0 ? `נמצאו ${results.length} חדרים פנויים:` : '❌ לא נמצאו חדרים פנויים'}
          </h3>

          <div className="room-grid">
            {results.map(room => (
              <div key={room._id} className="room-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: 0 }}>אגף {room.wing}</h3>
                  <span className="room-tag">קומה {room.floor}</span>
                </div>
                
                <div className="room-details" style={{ margin: '1.5rem 0' }}>
                  <p><span>קיבולת:</span> <strong>{room.size} בנות</strong></p>
                  <p><span>מקרן:</span> <strong>{room.hasProjector ? '✅ קיים' : '❌ אין'}</strong></p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="action-btn" style={{ flex: 2, padding: '10px', fontSize: '0.85rem' }}
                    onClick={() => setActivePlacementRoom(activePlacementRoom === room._id ? null : room._id)}>
                    ➕ שיבוץ זמני
                  </button>
                  <button className="view-btn" style={{ flex: 1, margin: 0 }}
                    onClick={() => navigate(`/rooms/${room._id}/schedule`)}>
                    לו"ז
                  </button>
                </div>

                {/* טופס שיבוץ פנימי (Inline) */}
                {activePlacementRoom === room._id && (
                  <div style={{ 
                    marginTop: '15px', 
                    padding: '15px', 
                    background: 'var(--mint-light)', 
                    borderRadius: '12px',
                    border: '1px solid var(--mint-primary)' 
                  }}>
                    <select className="view-btn" style={{ background: 'white', marginBottom: '10px' }}
                      value={tempForm.type} onChange={e => setTempForm({ ...tempForm, type: e.target.value })}>
                      <option value="placement">שיבוץ חדר</option>
                      <option value="release">שחרור חדר מקבוע</option>
                    </select>
                    <input type="text" placeholder="סיבת השיבוץ" className="view-btn" style={{ background: 'white', marginBottom: '10px' }}
                      value={tempForm.purpose} onChange={e => setTempForm({ ...tempForm, purpose: e.target.value })} />
                    <button className="action-btn" style={{ width: '100%', padding: '8px', background: 'var(--text-main)' }}
                      onClick={() => handleAddTempPlacement(room._id)}>
                      אישור שיבוץ
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default RoomSearchPage;