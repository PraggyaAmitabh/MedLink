import React, { useEffect, useRef } from "react";

const MedicineScan = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCamera();
  }, []);

  const startCamera = async () => {
    const video = videoRef.current;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      video.srcObject = stream;
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    if (window.cv) {
      const cv = window.cv;

      let src = cv.imread(canvas);
      let gray = new cv.Mat();
      let edges = new cv.Mat();

      // Convert to grayscale
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      // Edge detection
      cv.Canny(gray, edges, 50, 100);

      // Find contours
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();

      cv.findContours(
        edges,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
      );

      // Draw rectangle around detected objects
      for (let i = 0; i < contours.size(); i++) {
        let cnt = contours.get(i);
        let rect = cv.boundingRect(cnt);

        cv.rectangle(
          src,
          new cv.Point(rect.x, rect.y),
          new cv.Point(rect.x + rect.width, rect.y + rect.height),
          [0, 255, 0, 255],
          2
        );
      }

      cv.imshow(canvas, src);

      // Clean memory
      src.delete();
      gray.delete();
      edges.delete();
      contours.delete();
      hierarchy.delete();
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Medicine Scanner</h2>

<video
  ref={videoRef}
  autoPlay
  playsInline
  width="400"
  height="300"
  style={{ border: "2px solid black" }}
/>

      <br />
      <br />

      <button onClick={captureImage}>
        Capture Medicine
      </button>

      <br />
      <br />

      <canvas
        ref={canvasRef}
        width="400"
        height="300"
        style={{ border: "2px solid green" }}
      />
    </div>
  );
};

export default MedicineScan;