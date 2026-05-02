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

  // מצב טופס שיבוץ זמני לחדר ספציפי
  const [activePlacementRoom, setActivePlacementRoom] = useState(null);
  const [tempForm, setTempForm] = useState({ purpose: '', type: 'placement' });

  const handleSearch = async () => {
    if (!searchParams.date || !searchParams.startTime || !searchParams.endTime) {
      alert("יש למלא לפחות תאריך, שעת התחלה ושעת סיום");
      return;
    }
    setLoading(true);
    try {
      // בניית query string רק עם שדות שמולאו
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
    <div style={{ padding: '20px', direction: 'rtl', textAlign: 'right' }}>
      <h1>🔍 חיפוש חדר פנוי</h1>

      {/* טופס חיפוש */}
      <div style={{
        background: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        marginBottom: '30px'
      }}>
        <h3>פרמטרי חיפוש:</h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
          <label>
            📅 תאריך: *
            <input type="date" value={searchParams.date}
              onChange={e => setSearchParams({ ...searchParams, date: e.target.value })} />
          </label>

          <label>
            🕐 שעת התחלה: *
            <input type="time" value={searchParams.startTime}
              onChange={e => setSearchParams({ ...searchParams, startTime: e.target.value })} />
          </label>

          <label>
            🕑 שעת סיום: *
            <input type="time" value={searchParams.endTime}
              onChange={e => setSearchParams({ ...searchParams, endTime: e.target.value })} />
          </label>

          <label>
            👥 גודל מינימלי:
            <input type="number" placeholder="כמות בנות" value={searchParams.minSize}
              onChange={e => setSearchParams({ ...searchParams, minSize: e.target.value })} />
          </label>

          <label>
            🏢 אגף:
            <select value={searchParams.wing}
              onChange={e => setSearchParams({ ...searchParams, wing: e.target.value })}>
              <option value="">הכל</option>
              <option value="שמאל">שמאל</option>
              <option value="ימין">ימין</option>
              <option value="מרכז">מרכז</option>
              <option value="חדש">חדש</option>
            </select>
          </label>

          <label>
            🔢 קומה:
            <input type="number" placeholder="קומה" value={searchParams.floor}
              onChange={e => setSearchParams({ ...searchParams, floor: e.target.value })} />
          </label>

          <label>
            📽️ מקרן:
            <select value={searchParams.hasProjector}
              onChange={e => setSearchParams({ ...searchParams, hasProjector: e.target.value })}>
              <option value="">לא משנה</option>
              <option value="true">נדרש מקרן</option>
              <option value="false">ללא מקרן</option>
            </select>
          </label>
        </div>

        <button
          onClick={handleSearch}
          style={{
            marginTop: '15px',
            padding: '10px 25px',
            backgroundColor: '#2c3e50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'מחפש...' : '🔍 חפש חדרים פנויים'}
        </button>
      </div>

      {/* תוצאות */}
      {searched && (
        <div>
          <h2>
            {results.length > 0
              ? `נמצאו ${results.length} חדרים פנויים:`
              : '❌ לא נמצאו חדרים פנויים לזמן המבוקש'}
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
            {results.map(room => (
              <div key={room._id} style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px',
                minWidth: '220px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ marginTop: 0 }}>אגף {room.wing}</h3>
                <p>קומה: {room.floor}</p>
                <p>קיבולת: {room.size} בנות</p>
                <p>{room.hasProjector ? '✅ יש מקרן' : '❌ אין מקרן'}</p>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setActivePlacementRoom(activePlacementRoom === room._id ? null : room._id)}
                    style={{
                      backgroundColor: '#27ae60',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      cursor: 'pointer'
                    }}
                  >
                    ➕ הוסף שיבוץ זמני
                  </button>

                  <button
                    onClick={() => navigate(`/rooms/${room._id}/schedule`)}
                    style={{
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      cursor: 'pointer'
                    }}
                  >
                    📅 מערכת שעות
                  </button>
                </div>

                {/* טופס שיבוץ זמני לחדר זה */}
                {activePlacementRoom === room._id && (
                  <div style={{
                    marginTop: '10px',
                    padding: '10px',
                    backgroundColor: '#ecf0f1',
                    borderRadius: '6px'
                  }}>
                    <select
                      value={tempForm.type}
                      onChange={e => setTempForm({ ...tempForm, type: e.target.value })}
                      style={{ marginBottom: '6px', width: '100%' }}
                    >
                      <option value="placement">שיבוץ חדר</option>
                      <option value="release">שחרור חדר מקבוע</option>
                    </select>
                    <input
                      type="text"
                      placeholder="סיבת השיבוץ / מטרה"
                      value={tempForm.purpose}
                      onChange={e => setTempForm({ ...tempForm, purpose: e.target.value })}
                      style={{ width: '100%', marginBottom: '6px', boxSizing: 'border-box' }}
                    />
                    <button
                      onClick={() => handleAddTempPlacement(room._id)}
                      style={{
                        backgroundColor: '#e67e22',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      ✔️ אשרי שיבוץ
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomSearchPage;