import { useEffect, useState } from 'react';

function RoomList() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // שליפת הנתונים מהשרת שיצרנו
    fetch('http://localhost:5000/api/rooms')
      .then(res => res.json())
      .then(data => setRooms(data));
  }, []);

  return (
    <div>
      <h3>רשימת החדרים הזמינים בשיבוץ: [cite: 7]</h3>
      <ul>
        {rooms.map(room => (
          <li key={room._id}>
            אגף: {room.wing}, קומה: {room.floor}, גודל: {room.size} 
            {room.hasProjector ? " (כולל מקרן)" : ""} 
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoomList;