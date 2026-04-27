import { useState, useEffect } from 'react';
import axios from 'axios';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [sortKey, setSortKey] = useState('wing'); // מפתח ברירת מחדל למיון

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await axios.get('http://localhost:5000/api/rooms');
    setRooms(res.data);
  };

  // פונקציית המיון בלקוח - נקייה ומהירה
  const sortedRooms = [...rooms].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return -1;
    if (a[sortKey] > b[sortKey]) return 1;
    return 0;
  });

  const handleDelete = async (id) => {
    if (window.confirm("בטוחה שברצונך למחוק חדר זה?")) {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`);
      fetchRooms(); // רענון הרשימה
    }
  };

  return (
    <div>
      <h1>ניהול חדרים</h1>
      
      {/* כפתורי מיון */}
      <div className="sort-buttons">
        <button onClick={() => setSortKey('wing')}>מיין לפי אגף</button>
        <button onClick={() => setSortKey('floor')}>מיין לפי קומה</button>
        <button onClick={() => setSortKey('size')}>מיין לפי גודל</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>אגף</th>
            <th>קומה</th>
            <th>גודל</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {sortedRooms.map(room => (
            <tr key={room._id}>
              <td>{room.wing}</td>
              <td>{room.floor}</td>
              <td>{room.size}</td>
              <td>
                <button onClick={() => handleDelete(room._id)}>מחיקה</button>
                {/* כפתור עדכון יפתח כאן טופס/מודל */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};