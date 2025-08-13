 let mediaRecorder;
    let audioChunks = [];
    const recordBtn = document.getElementById("record-btn");

    recordBtn.addEventListener("click", async () => {
      if (recordBtn.textContent.includes("Start")) {
        let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        recordBtn.textContent = "⏹ Stop Recording";

        mediaRecorder.ondataavailable = e => {
          audioChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const a = document.createElement("a");
          a.href = audioUrl;
          a.download = "note_recording.wav";
          a.click();
          audioChunks = [];
        };
      } else {
        mediaRecorder.stop();
        recordBtn.textContent = "🎤 Start Recording";
      }
    });

    // 🗣 Speech to Text
    const speechBtn = document.getElementById("speech-btn");
    const noteArea = document.getElementById("note-area");

    let recognition;
    let isRecognizing = false;

    if ('webkitSpeechRecognition' in window) {
      recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) { // ✅ Only final results
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (finalTranscript) {
          noteArea.value += finalTranscript;
        }
      };

      recognition.onend = () => {
        isRecognizing = false;
        speechBtn.textContent = "🗣 Speech to Text";
      };
    } else {
      alert("Speech recognition not supported in this browser.");
    }

    speechBtn.addEventListener("click", () => {
      if (!isRecognizing) {
        recognition.start();
        isRecognizing = true;
        speechBtn.textContent = "⏹ Stop Speech";
      } else {
        recognition.stop();
      }
    });
    ;