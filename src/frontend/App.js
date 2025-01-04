import { useEffect, useRef, useState } from "react";
import './App.css';
import WaveSurfer from "wavesurfer.js";
import WaveSurferTimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';

function App() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [waveformLoaded, setWaveformLoaded] = useState(false);
  const websurfer = useRef(null);
  const audioData = useRef(null);


  useEffect(() => {
    websurfer.current = WaveSurfer.create({
      container: "#waveform",
      waveColor: "#D9DCFF",
      progressColor: "#4353FF",
      cursorColor: "#4353FF",
      barWidth: 3, 
      barRadius: 3,
      cursorWidth: 1,
      height: 200,
      barGap: 3,
      plugins: [
        WaveSurferTimelinePlugin.create({ container: "#waveform-timeline" }),
      ],
    });
    websurfer.current.on("ready", () => {
      setWaveformLoaded(true);
    });
  }, []);

  const createWaveform = (e) => {
    setWaveformLoaded(false);
    var file = e.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = async (event) => {
        audioData.current = event.target.result;
        let blob = new window.Blob([new Uint8Array(event.target.result)], {
          type: "audio/mp3",
        });        
        websurfer.current.loadBlob(blob);
        // Wait for the audio to load before zooming
        websurfer.current.on("ready", () => {
          websurfer.current.zoom(zoomLevel);
          setWaveformLoaded(true);
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const playPause = () => {
    if (!websurfer.current.isPlaying()) {
      websurfer.current.play();
    } else {
      websurfer.current.pause();
    }
  };

  const zoomIn = (e) => {
    websurfer.current.zoom(e.target.value);
    console.log(e.target.value);
    setZoomLevel(e.target.value);
  }; 

  

  return (
    <div className="App">
      <input type="file" accept="audio/mp3" onChange={createWaveform} />
      <div
        id="waveform"
        style={{ visibility: waveformLoaded ? "visible" : "hidden" }}
      ></div>
      {!waveformLoaded && <div>Loading...</div>}
      <div
        id="waveform-timeline"
        style={{ visibility: waveformLoaded ? "visible" : "hidden" }}
      ></div>
      <input
        type="range"
        id="zoom"
        onChange={zoomIn}
        min="1"
        max="50"
        value={zoomLevel}
      />
      <input type="button" value="Play/Pause" onClick={playPause} />
    </div>
  );
}

export default App;
