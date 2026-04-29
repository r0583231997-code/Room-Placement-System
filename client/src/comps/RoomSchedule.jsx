import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RoomSchedule = () => {
  const { id } = useParams(); // מזהה החדר מה-URL
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [permanentPlacements, setPermanentPlacements] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [temporaryData, setTemporaryData] = useState({ placements: [], cancellations: [] });

  // טופס הוספה זמני
  const [newPlacement, setNewPlacement] = useState({ dayOfWeek: 'א', startTime: '', endTime: '', purpose: '', type: 'placement' });

  useEffect(() => {
    fetchRoomData();
    fetchPermanentPlacements();
  }, [id]);

  useEffect(() => {
    if (selectedDate) {
      fetchTemporaryDataForDate(selectedDate);
    }
  }, [selectedDate, id]);

  const fetchRoomData = async () => {
    const res = await axios.get(`http://localhost:5000/api/rooms/${id}`);
    setRoom(res.data);
  };

  const fetchPermanentPlacements = async () => {
    const res = await axios.get(`http://localhost:5000/api/permanent-placements/room/${id}`);
    setPermanentPlacements(res.data);
  };

  const fetchTemporaryDataForDate = async (date) => {
    const tempRes = await axios.get(`http://localhost:5000/api/temporary-placements/room/${id}?date=${date}`);
    const cancRes = await axios.get(`http://localhost:5000/api/cancellations/room/${id}`);
    
    // סינון ביטולים לתאריך הספציפי (מכיוון שהשרת כרגע מחזיר את כולם)
    const filteredCanc = cancRes.data.filter(c => c.date.split('T')[0] === date);
    
    setTemporaryData({
      placements: tempRes.data,
      cancellations: filteredCanc
    });
  };

  const handleClearAllRoomPlacements = async () => {
    if (window.confirm("אזהרה: האם למחוק את כל השיבוצים (קבועים וזמניים) מחדר זה?")) {
      await axios.delete(`http://localhost:5000/api/rooms/${id}/clear-placements`);
      fetchPermanentPlacements();
      if (selectedDate) fetchTemporaryDataForDate(selectedDate);
      alert("השיבוצים נוקו.");
    }
  };

  const handleAddPermanent = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/permanent-placements', { ...newPlacement, room: id });
    fetchPermanentPlacements();
    alert("שיבוץ קבוע נוסף!");
  };

  const handleAddTemporary = async (e) => {
    e.preventDefault();
    if (!selectedDate) return alert("יש לבחור תאריך קודם!");
    await axios.post('http://localhost:5000/api/temporary-placements', { 
        room: id, 
        date: selectedDate, 
        startTime: newPlacement.startTime, 
        endTime: newPlacement.endTime, 
        purpose: newPlacement.purpose,
        type: newPlacement.type // placement / release
    });
    fetchTemporaryDataForDate(selectedDate);
    alert("שיבוץ/שחרור זמני נוסף!");
  };

  const handleAddCancellation = async () => {
    if (!selectedDate) return alert("יש לבחור תאריך קודם!");
    const reason = prompt("מה סיבת הביטול (למשל: שיפוץ)?");
    await axios.post('http://localhost:5000/api/cancellations', { room: id, date: selectedDate, reason: reason || "לא צוינה סיבה" });
    fetchTemporaryDataForDate(selectedDate);
  };

  if (!room) return <p>טוען נתוני חדר...</p>;

  return (
    <div style={{ padding: '20px', textAlign: 'right', direction: 'rtl' }}>
      <button onClick={() => navigate('/rooms')}>חזרה לניהול חדרים</button>
      
      <h1>מערכת שעות: אגף {room.wing}, קומה {room.floor} (קיבולת: {room.size})</h1>
      <button onClick={handleClearAllRoomPlacements} style={{ backgroundColor: 'red', color: 'white', marginBottom: '20px' }}>
        🗑️ נקה את כל השיבוצים בחדר זה
      </button>

      {/* --- מערכת קבועה --- */}
      <section style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h2>מערכת שבועית קבועה</h2>
        <table border="1" width="100%" style={{ borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>יום</th>
              <th>התחלה</th>
              <th>סיום</th>
              <th>מטרה/שיעור</th>
            </tr>
          </thead>
          <tbody>
            {permanentPlacements.map(p => (
              <tr key={p._id}>
                <td>{p.dayOfWeek}</td>
                <td>{p.startTime}</td>
                <td>{p.endTime}</td>
                <td>{p.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* טופס הוספת שיבוץ קבוע פשוט */}
        <div style={{ marginTop: '10px' }}>
            <h4>הוספת שיבוץ קבוע:</h4>
            <select onChange={e => setNewPlacement({...newPlacement, dayOfWeek: e.target.value})}>
                {['א','ב','ג','ד','ה','ו'].map(day => <option key={day} value={day}>{day}'</option>)}
            </select>
            <input type="time" onChange={e => setNewPlacement({...newPlacement, startTime: e.target.value})} />
            <input type="time" onChange={e => setNewPlacement({...newPlacement, endTime: e.target.value})} />
            <input type="text" placeholder="שם שיעור" onChange={e => setNewPlacement({...newPlacement, purpose: e.target.value})} />
            <button onClick={handleAddPermanent}>הוסף קבוע</button>
        </div>
      </section>

      {/* --- מערכת זמנית לפי תאריך --- */}
      <section style={{ border: '1px solid #ccc', padding: '15px' }}>
        <h2>מערכת זמנית / יומית</h2>
        <label>בחרי תאריך: </label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        
        {selectedDate && (
          <div style={{ marginTop: '20px' }}>
            <h3>שיבוצים ושינויים לתאריך {selectedDate}</h3>
            
            <div style={{ marginBottom: '15px' }}>
                <button onClick={handleAddCancellation} style={{ backgroundColor: 'orange' }}>⚠️ הוסף ביטול חד פעמי (יומי) לחדר</button>
            </div>

            {temporaryData.cancellations.length > 0 && (
                <div style={{ color: 'red', fontWeight: 'bold' }}>
                    * שים לב: קיימים ביטולים לחדר ביום זה!
                    <ul>
                        {temporaryData.cancellations.map(c => <li key={c._id}>{c.reason}</li>)}
                    </ul>
                </div>
            )}

            <table border="1" width="100%" style={{ borderCollapse: 'collapse', textAlign: 'center', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#eef' }}>
                  <th>התחלה</th>
                  <th>סיום</th>
                  <th>סוג שינוי</th>
                  <th>מטרה / הערה</th>
                </tr>
              </thead>
              <tbody>
                {temporaryData.placements.map(t => (
                  <tr key={t._id}>
                    <td>{t.startTime}</td>
                    <td>{t.endTime}</td>
                    <td>{t.type === 'placement' ? '🟢 שיבוץ נוסף' : '🔴 שחרור החדר'}</td>
                    <td>{t.purpose || t.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: '15px' }}>
                <h4>הוספת שינוי זמני לתאריך זה:</h4>
                <select onChange={e => setNewPlacement({...newPlacement, type: e.target.value})}>
                    <option value="placement">שיבוץ חדר</option>
                    <option value="release">שחרור חדר מקבוע</option>
                </select>
                <input type="time" onChange={e => setNewPlacement({...newPlacement, startTime: e.target.value})} />
                <input type="time" onChange={e => setNewPlacement({...newPlacement, endTime: e.target.value})} />
                <input type="text" placeholder="סיבה (למשל תגבור)" onChange={e => setNewPlacement({...newPlacement, purpose: e.target.value})} />
                <button onClick={handleAddTemporary}>הוסף שינוי זמני</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default RoomSchedule;