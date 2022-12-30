import "./App.css";
import { useEffect, useRef } from "react";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { drawMesh } from "./utils";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runFacesmesh = async () => {
    const net = await facemesh.load(
      facemesh.SupportedPackages.mediapipeFacemesh
    );
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== undefined &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // get Video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      //set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      //set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      //detection
      const face = await net.estimateFaces({ input: video });
      console.log(face);
      //ctx  get from canvas
      const ctx = canvasRef.current.getContext("2d");
      requestAnimationFrame(() => {
        drawMesh(face, ctx);  
      });
    }
  };

  useEffect(() => {
    runFacesmesh();
    //eslint-disable-next-line
  }, []);
  return (
    <div className="root">
      <header className="header">
        <Webcam ref={webcamRef} className="webcam" />
        <canvas ref={canvasRef} className="canvas" />
      </header>
    </div>
  );
}

export default App;
