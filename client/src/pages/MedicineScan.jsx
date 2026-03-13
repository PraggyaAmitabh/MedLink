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
        video: true
      });

      video.srcObject = stream;

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

    if (window.cv) {

      const cv = window.cv;

      let src = cv.imread(canvas);
      let gray = new cv.Mat();
      let edges = new cv.Mat();

      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      cv.Canny(gray, edges, 50, 100);

      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();

      cv.findContours(
        edges,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
      );

      let largestArea = 0;
      let largestRect = null;

      for (let i = 0; i < contours.size(); i++) {

        let cnt = contours.get(i);
        let rect = cv.boundingRect(cnt);
        let area = rect.width * rect.height;

        if (area > largestArea) {
          largestArea = area;
          largestRect = rect;
        }
      }

      if (largestRect) {

        cv.rectangle(
          src,
          new cv.Point(largestRect.x, largestRect.y),
          new cv.Point(
            largestRect.x + largestRect.width,
            largestRect.y + largestRect.height
          ),
          [0, 255, 0, 255],
          3
        );

        let pill = src.roi(largestRect);

        cv.imshow(canvas, pill);

        // Convert image to Base64 (Day 9)
        const imageData = canvas.toDataURL("image/png");

        console.log("Captured Base64 Image:", imageData);

        pill.delete();
      }

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

      <button
        onClick={captureImage}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
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