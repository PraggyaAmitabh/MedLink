import React, { useRef } from "react";

function MedicineScan() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      const video = videoRef.current;

      if (video) {
        video.srcObject = stream;
        await video.play();   // important fix
      }

    } catch (error) {
      console.error("Camera error:", error);
      alert("Camera access failed. Please allow permission.");
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Medicine Scanner</h2>

      <video
        ref={videoRef}
        width="400"
        autoPlay
        playsInline
        muted
        style={{ border: "2px solid black" }}
      />

      <br /><br />

      <button onClick={startCamera}>
        Start Camera
      </button>

      <button onClick={captureImage} style={{ marginLeft: "10px" }}>
        Capture Medicine
      </button>

      <br /><br />

      <canvas ref={canvasRef} width="400" />
    </div>
  );
}

export default MedicineScan;