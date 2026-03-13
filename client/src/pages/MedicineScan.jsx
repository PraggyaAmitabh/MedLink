/* global cv */

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
      alert("Camera access failed");
    }
  };

  const captureImage = () => {

    if (typeof cv === "undefined") {
      alert("OpenCV still loading. Wait a few seconds and try again.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // OpenCV Processing
    const src = cv.imread(canvas);
    const gray = new cv.Mat();
    const edges = new cv.Mat();

    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.Canny(gray, edges, 50, 100);

    cv.imshow(canvas, edges);

    const img = canvas.toDataURL("image/png");
    setImageData(img);

    src.delete();
    gray.delete();
    edges.delete();
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

      <canvas ref={canvasRef} width="400"></canvas>

      {imageData && (
        <div>
          <h3>Processed Image</h3>
          <img src={imageData} alt="processed" width="400"/>
        </div>
      )}

    </div>
  );
}

export default MedicineScan;