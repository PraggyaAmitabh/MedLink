import React, { useRef } from "react";

function MedicineScan() {
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

    } catch (error) {
      console.error("Camera error:", error);
      alert("Camera access failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Medicine Scanner</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="400"
        style={{ border: "2px solid black" }}
      />

      <br /><br />

      <button onClick={startCamera}>
        Start Camera
      </button>
    </div>
  );
}

export default MedicineScan;