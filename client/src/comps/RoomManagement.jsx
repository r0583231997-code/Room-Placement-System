import { useState, useEffect } from 'react';
import axios from 'axios';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [sortKey, setSortKey] = useState('wing');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await axios.get('http://localhost:5000/api/rooms');
    setRooms(res.data);
  };

  const sortedRooms = [...rooms].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return -1;
    if (a[sortKey] > b[sortKey]) return 1;
    return 0;
  });

  const handleDelete = async (id) => {
    // בקשת אישור מהמשתמש לפני מחיקה (דרישת אפיון)
    if (window.confirm("האם את בטוחה שברצונך למחוק חדר זה?")) {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`);
      fetchRooms();
    }
  };

  // פונקציה לניקוי כל השיבוצים (דרישת אפיון)
  const handleClearAllPlacements = async () => {
    if (window.confirm("אזהרה: האם את בטוחה שברצונך לנקות את כל השיבוצים מכל החדרים?")) {
      try {
        await axios.delete('http://localhost:5000/api/placements/clear-all');
        alert("כל השיבוצים נוקו בהצלחה.");
      } catch (err) {
        console.error("Error clearing placements:", err);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>ניהול חדרים</h1>
      
      <div className="action-bar" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setSortKey('wing')}>מיין לפי אגף</button>
        <button onClick={() => setSortKey('floor')}>מיין לפי קומה</button>
        <button onClick={() => setSortKey('size')}>מיין לפי גודל</button>
        
        {/* כפתור ניקוי גורף */}
        <button 
          onClick={handleClearAllPlacements} 
          style={{ backgroundColor: '#ff4d4d', color: 'white', marginLeft: 'auto' }}
        >
          🧹 ניקוי כל השיבוצים
        </button>
      </div>

      <table border="1" width="100%" style={{ borderCollapse: 'collapse', textAlign: 'right' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>אגף</th>
            <th>קומה</th>
            <th>גודל (בנות)</th>
            <th>מקרן</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {sortedRooms.map(room => (
            <tr key={room._id}>
              <td>{room.wing}</td>
              <td>{room.floor}</td>
              <td>{room.size}</td>
              <td>{room.hasProjector ? "✅ קיים" : "❌ אין"}</td>
              <td>
                <button onClick={() => handleDelete(room._id)}>מחיקה</button>
                <button style={{ marginRight: '5px' }}>עדכון</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomManagement;