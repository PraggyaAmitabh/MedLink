import React, { useRef, useState } from "react";

function MedicineScan() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageData, setImageData] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = videoRef.current;

      if (video) {
        video.srcObject = stream;
        await video.play();
      }
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const img = canvas.toDataURL("image/png");
    setImageData(img);
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

      <button onClick={startCamera}>Start Camera</button>

      <button onClick={captureImage} style={{ marginLeft: "10px" }}>
        Capture Medicine
      </button>

      <br /><br />

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {imageData && (
        <div>
          <h3>Captured Image</h3>
          <img src={imageData} alt="captured" width="400" />
        </div>
      )}
    </div>
  );
}

export default MedicineScan;