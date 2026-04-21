import { useState } from "react";

function EditRoom({ room, onSave }) {
  const [wing, setWing] = useState(room?.wing || "");
  const [floor, setFloor] = useState(room?.floor || "");
  const [size, setSize] = useState(room?.size || "");
  const [hasProjector, setHasProjector] = useState(room?.hasProjector || false);

  const handleSubmit = () => {
    onSave({ wing, floor, size, hasProjector });
  };

  return (
    <div>
      <h2>עדכון פרטי חדר</h2>
      <input placeholder="אגף" value={wing} onChange={(e) => setWing(e.target.value)} />
      <input placeholder="קומה" type="number" value={floor} onChange={(e) => setFloor(e.target.value)} />
      <input placeholder="גודל" type="number" value={size} onChange={(e) => setSize(e.target.value)} />
      <label>
        יש מקרן?
        <input type="checkbox" checked={hasProjector} onChange={(e) => setHasProjector(e.target.checked)} />
      </label>
      <button onClick={handleSubmit}>שמור</button>
    </div>
  );
}

export default EditRoom;