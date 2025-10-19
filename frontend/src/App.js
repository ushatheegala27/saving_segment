import React, { useState } from "react";
import SegmentModal from "./SegmentModal";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: 32,  }}>
      <h1>Segment Save Demo</h1>
      <button className="Save_segment_button" onClick={() => setOpen(true)}>
        Save segment
      </button>

      {open && <SegmentModal onClose={() => setOpen(false)} />}
    </div>
  );
}

export default App;
