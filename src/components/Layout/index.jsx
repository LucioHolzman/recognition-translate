import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";

export const Layout = () => {
  const [listen, setListen] = useState(false);
  const [voices, setVoices] = useState([]);
  const [voiceSelected, setVoiceSelected] = useState("");
  const speak = useCallback((templateTextRecognition) => {
    const synth = window.speechSynthesis;
    if (templateTextRecognition !== "") {

      let utterThis = new SpeechSynthesisUtterance(templateTextRecognition);
      voices.forEach((voice) => {
        if (voice.name === voiceSelected) {
          utterThis.voice = voice;
        }
      });
        synth.speak(utterThis);
    }
  }, [voiceSelected, voices]);

  const fetchData = useCallback((templateTextRecognition) => {
    var options = {
      method: "POST",
      url: "https://translo.p.rapidapi.com/translate",
      params: { text: templateTextRecognition, to: "en", from: "es" },
      headers: {
        "content-type": "application/json",
        "x-rapidapi-key": "af045445c1msha435b2efba7c2bep101bfajsn2cab06ea5fa5",
        "x-rapidapi-host": "translo.p.rapidapi.com",
      },
      data: { key1: "value", key2: "value" },
    };

    axios
      .request(options)
      .then( (response) => {
        speak(response.data.translated_text);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [speak]);

  const recognition = useCallback(
    (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        let templateText = e.results[i][0].transcript;
        fetchData(templateText);
      }
    },
    [fetchData]
  );

  const listenUser = useCallback(() => {
      if (!("webkitSpeechRecognition" in window)) {
        alert("No podes usar el API");
      } else {
        let rec;
        rec = new window.webkitSpeechRecognition();
        rec.leng = "es-AR, en-EU";
        rec.continuous = false;
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        rec.addEventListener("result", recognition);
        if (!listen) {
          rec.stop();
          rec.onaudioend = null;
          rec.onend = true;
        } else {
          rec.start();
          rec.onaudioend = () => {
            setTimeout(() => {
              rec.start();
            }, 1000);
          };
        }
      }
    },
    [listen, recognition]
  );

  const getVoices = useCallback(() => {
    const synth = window.speechSynthesis;
    let voices = [];
    voices = synth.getVoices().sort((a, b) => {
        const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if (aname < bname) return -1;
      else if (aname === bname) return 0;
      else return +1;
    });
    setVoices(voices);
  }, []);

  useEffect(() => {
    if (voices.length === 0) {
      getVoices();
    }
  }, [voices, getVoices]);

  useEffect(() => {
        listenUser(listen);
}, [listen, listenUser]);


const handleChange = (e) => {
    let value = e.target.selectedOptions[0].value
    setVoiceSelected(value);
  }
  return (
    <div>
        <select
          onChange={(e) => handleChange(e)}
         className="container">
      {voices.map((voice) => (
          <option
          value={voice.name}
          data-lang={voice.lang}
            key={voice.voiceURI}
            data-name={voice.name}
          >
            {voice.name + " (" + voice.lang + ")"}
          </option>
        ))}
        </select>
        {/* Futuro: Traducir en varios idiomas, validar tanto que el api tenga el idioma definido y que las voces sintetizadas tengan las acentuaciones necesarias para el idioma. */}
        {/* <p>Traducir </p>
        <select
          onChange={(e) => handleChange(e)}
         className="containerLang">
             <option value="">De</option>
      {voices.map((voice) => (
          <option
          value={voice.lang}
          data-lang={voice.lang}
            key={voice.voiceURI}
          >
            {voice.lang}
          </option>
        ))}
        </select>

        <select
          onChange={(e) => handleChange(e)}
         className="containerLang">
             <option value="">a</option>
      {voices.map((voice) => (
          <option
          value={voice.lang}
          data-lang={voice.lang}
            key={voice.voiceURI}
          >
            {voice.lang}
          </option>
        ))}
        </select> */}
        <div className="btnContainer">
      <button onClick={() => setListen(listen ? false : true)}>Traducir en tiempo real!</button>
      </div>
    </div>
  );
}; 
