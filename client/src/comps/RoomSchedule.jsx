
// export default RoomSchedule;
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RoomSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // נתוני חדר ולו"ז
  const [room, setRoom] = useState(null);
  const [permanentPlacements, setPermanentPlacements] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [temporaryData, setTemporaryData] = useState({ placements: [], cancellations: [] });

  // States נפרדים לטפסים (כדי שלא יתערבבו)
  const [permanentForm, setPermanentForm] = useState({ dayOfWeek: 'א', startTime: '', endTime: '', purpose: '' });
  const [temporaryForm, setTemporaryForm] = useState({ startTime: '', endTime: '', purpose: '', type: 'placement' });
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancellationForm, setShowCancellationForm] = useState(false);

  useEffect(() => {
    fetchRoomData();
    fetchPermanentPlacements();
  }, [id]);

  useEffect(() => {
    if (selectedDate) {
      fetchTemporaryDataForDate(selectedDate);
    }
  }, [selectedDate, id]);

  // פונקציות שליפת נתונים
  const fetchRoomData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/rooms/${id}`);
      setRoom(res.data);
    } catch (err) { console.error("Error fetching room:", err); }
  };

  const fetchPermanentPlacements = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/permanent-placements/room/${id}`);
      setPermanentPlacements(res.data);
    } catch (err) { console.error("Error fetching permanent placements:", err); }
  };

  const fetchTemporaryDataForDate = async (date) => {
    try {
      const tempRes = await axios.get(`http://localhost:5000/api/temporary-placements/room/${id}?date=${date}`);
      const cancRes = await axios.get(`http://localhost:5000/api/cancellations/room/${id}`);

      const filteredCanc = cancRes.data.filter(c => {
        const cancDate = new Date(c.date);
        const cancDateStr = cancDate.toISOString().split('T')[0];
        return cancDateStr === date;
      });

      setTemporaryData({ placements: tempRes.data, cancellations: filteredCanc });
    } catch (err) { console.error("Error fetching temporary data:", err); }
  };

  // --- לוגיקת הוספה ---

  const handleAddPermanent = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/permanent-placements', { ...permanentForm, room: id });
      fetchPermanentPlacements();
      alert("✅ שיבוץ קבוע נוסף בהצלחה!");
      setPermanentForm({ dayOfWeek: 'א', startTime: '', endTime: '', purpose: '' }); // איפוס טופס
    } catch (err) {
      alert(err.response?.data?.message || "❌ שגיאה בהוספת שיבוץ קבוע");
    }
  };

  const handleAddTemporary = async (e) => {
    e.preventDefault();
    if (!selectedDate) return alert("יש לבחור תאריך קודם!");
    try {
      await axios.post('http://localhost:5000/api/temporary-placements', {
        room: id,
        date: selectedDate,
        ...temporaryForm
      });
      fetchTemporaryDataForDate(selectedDate);
      alert("✅ שיבוץ/שחרור זמני עודכן!");
      setTemporaryForm({ startTime: '', endTime: '', purpose: '', type: 'placement' }); // איפוס טופס
    } catch (err) {
      alert(err.response?.data?.message || "❌ שגיאה בשיבוץ זמני");
    }
  };

  const handleAddCancellation = async () => {
    if (!cancellationReason.trim()) return alert("יש להזין סיבת ביטול");
    try {
      await axios.post('http://localhost:5000/api/cancellations', {
        room: id,
        date: selectedDate,
        reason: cancellationReason
      });
      setCancellationReason('');
      setShowCancellationForm(false);
      fetchTemporaryDataForDate(selectedDate);
    } catch (err) { alert("❌ שגיאה בהוספת ביטול"); }
  };

  // --- לוגיקת מחיקה ---

  const handleDeletePermanent = async (pId) => {
    if (window.confirm("האם למחוק שיבוץ קבוע זה?")) {
      await axios.delete(`http://localhost:5000/api/permanent-placements/${pId}`);
      fetchPermanentPlacements();
    }
  };

  const handleDeleteCancellation = async (cId) => {
    if (window.confirm("האם למחוק ביטול זה?")) {
      await axios.delete(`http://localhost:5000/api/cancellations/${cId}`);
      fetchTemporaryDataForDate(selectedDate);
    }
  };

  const handleClearAllRoomPlacements = async () => {
    if (window.confirm("אזהרה: האם למחוק את כל השיבוצים מחדר זה?")) {
      await axios.delete(`http://localhost:5000/api/rooms/${id}/clear-placements`);
      fetchPermanentPlacements();
      if (selectedDate) fetchTemporaryDataForDate(selectedDate);
      alert("החדר נוקה משיבוצים.");
    }
  };

  if (!room) return <p>טוען נתוני חדר...</p>;

  return (
    <div style={{ padding: '20px', textAlign: 'right', direction: 'rtl', fontFamily: 'Arial' }}>
      <button onClick={() => navigate('/rooms')}>← חזרה לניהול חדרים</button>

      <h1>מערכת שעות: אגף {room.wing}, קומה {room.floor} (קיבולת: {room.size})</h1>
      
      <button onClick={handleClearAllRoomPlacements} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '5px' }}>
        🗑️ נקה את כל השיבוצים בחדר זה
      </button>

      <hr style={{ margin: '20px 0' }} />

      {/* --- מערכת קבועה --- */}
      <section style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>📅 מערכת שבועית קבועה</h2>
        <table border="1" width="100%" style={{ borderCollapse: 'collapse', textAlign: 'center', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#eee' }}>
              <th>יום</th><th>התחלה</th><th>סיום</th><th>מטרה</th><th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {permanentPlacements.map(p => (
              <tr key={p._id}>
                <td>{p.dayOfWeek}</td><td>{p.startTime}</td><td>{p.endTime}</td><td>{p.purpose}</td>
                <td><button onClick={() => handleDeletePermanent(p._id)} style={{ color: 'red' }}>מחק</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <form onSubmit={handleAddPermanent} style={{ marginTop: '15px', display: 'flex', gap: '5px' }}>
          <select value={permanentForm.dayOfWeek} onChange={e => setPermanentForm({ ...permanentForm, dayOfWeek: e.target.value })}>
            {['א', 'ב', 'ג', 'ד', 'ה', 'ו'].map(d => <option key={d} value={d}>{d}'</option>)}
          </select>
          <input type="time" required value={permanentForm.startTime} onChange={e => setPermanentForm({ ...permanentForm, startTime: e.target.value })} />
          <input type="time" required value={permanentForm.endTime} onChange={e => setPermanentForm({ ...permanentForm, endTime: e.target.value })} />
          <input type="text" placeholder="שם השיעור" required value={permanentForm.purpose} onChange={e => setPermanentForm({ ...permanentForm, purpose: e.target.value })} />
          <button type="submit" style={{ backgroundColor: '#4CAF50', color: 'white' }}>הוסף שיבוץ קבוע</button>
        </form>
      </section>

      {/* --- מערכת זמנית --- */}
      <section style={{ border: '2px solid #e0e0e0', padding: '15px', borderRadius: '8px' }}>
        <h2>⏱️ שינויים ושיבוצים זמניים</h2>
        <div style={{ marginBottom: '15px' }}>
            <label>בחר תאריך לצפייה/עריכה: </label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </div>

        {selectedDate && (
          <div>
            {/* ביטולים */}
            <div style={{ marginBottom: '15px' }}>
              <button onClick={() => setShowCancellationForm(!showCancellationForm)} style={{ backgroundColor: 'orange', padding: '8px' }}>
                ⚠️ דווח על ביטול חדר (יומי)
              </button>
              {showCancellationForm && (
                <div style={{ marginTop: '10px' }}>
                  <input type="text" placeholder="סיבת הביטול" value={cancellationReason} onChange={e => setCancellationReason(e.target.value)} />
                  <button onClick={handleAddCancellation} style={{ backgroundColor: 'green', color: 'white' }}>אשר</button>
                </div>
              )}
            </div>

            {temporaryData.cancellations.map(c => (
              <div key={c._id} style={{ color: 'red', border: '1px solid red', padding: '5px', marginBottom: '5px' }}>
                ❌ חדר מבוטל: {c.reason} <button onClick={() => handleDeleteCancellation(c._id)}>מחק ביטול</button>
              </div>
            ))}

            <table border="1" width="100%" style={{ borderCollapse: 'collapse', textAlign: 'center', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#eee' }}>
                  <th>התחלה</th><th>סיום</th><th>סוג</th><th>סיבה</th>
                </tr>
              </thead>
              <tbody>
                {temporaryData.placements.map(t => (
                  <tr key={t._id}>
                    <td>{t.startTime}</td><td>{t.endTime}</td>
                    <td>{t.type === 'placement' ? '🟢 שיבוץ' : '🔴 שחרור'}</td>
                    <td>{t.purpose || t.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <form onSubmit={handleAddTemporary} style={{ marginTop: '15px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
              <h4>הוספת שינוי ליום זה:</h4>
              <select value={temporaryForm.type} onChange={e => setTemporaryForm({ ...temporaryForm, type: e.target.value })}>
                <option value="placement">שיבוץ חדר</option>
                <option value="release">שחרור חדר מקבוע</option>
              </select>
              <input type="time" required value={temporaryForm.startTime} onChange={e => setTemporaryForm({ ...temporaryForm, startTime: e.target.value })} />
              <input type="time" required value={temporaryForm.endTime} onChange={e => setTemporaryForm({ ...temporaryForm, endTime: e.target.value })} />
              <input type="text" placeholder="סיבת השינוי" value={temporaryForm.purpose} onChange={e => setTemporaryForm({ ...temporaryForm, purpose: e.target.value })} />
              <button type="submit">בצע שינוי זמני</button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
};

export default RoomSchedule;