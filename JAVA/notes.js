// Audio Recording Functionality
    let mediaRecorder;
    let audioChunks = [];
    let currentRecording = null;
    let recordings = JSON.parse(localStorage.getItem('audioRecordings')) || [];

    function setupAudioRecording() {
      const recordBtn = document.getElementById("record-btn");
      const recordingIndicator = document.getElementById("recordingIndicator");
      
      if (!recordBtn) return;

      recordBtn.addEventListener("click", async () => {
        if (recordBtn.textContent.includes("Start")) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            recordBtn.textContent = "Stop Recording";
            recordingIndicator.classList.add("active");

            audioChunks = [];

            mediaRecorder.ondataavailable = e => {
              audioChunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
              const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
              const audioUrl = URL.createObjectURL(audioBlob);
              
              // Create a recording object
              const noteTitle = document.querySelector('.note-title').value || 'Untitled Note';
              const recording = {
                id: Date.now(),
                title: noteTitle,
                audioUrl: audioUrl,
                date: new Date().toLocaleString(),
                blob: audioChunks
              };
              
              // Store recording
              recordings.push(recording);
              localStorage.setItem('audioRecordings', JSON.stringify(recordings));
              
              // Update UI
              renderRecordings();
              
              // Cleanup
              audioChunks = [];
              stream.getTracks().forEach(track => track.stop());
            };
          } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access microphone. Please check permissions.");
          }
        } else {
          mediaRecorder.stop();
          recordBtn.textContent = "Start Recording";
          recordingIndicator.classList.remove("active");
        }
      });
    }

    // Render recordings in the list
    function renderRecordings() {
      const recordingsList = document.getElementById("recordingsList");
      recordingsList.innerHTML = '';
      
      if (recordings.length === 0) {
        recordingsList.innerHTML = '<p>No recordings yet. Start recording to see them here.</p>';
        return;
      }
      
      recordings.forEach(recording => {
        const recordingItem = document.createElement("div");
        recordingItem.className = "recording-item";
        recordingItem.innerHTML = `
          <div class="recording-info">
            <div class="recording-title">${recording.title}</div>
            <div class="recording-date">${recording.date}</div>
          </div>
          <audio controls src="${recording.audioUrl}"></audio>
          <button class="delete-recording" data-id="${recording.id}">Delete</button>
        `;
        
        recordingsList.appendChild(recordingItem);
      });
      
      // Add event listeners to delete buttons
      document.querySelectorAll('.delete-recording').forEach(button => {
        button.addEventListener('click', (e) => {
          const id = parseInt(e.target.getAttribute('data-id'));
          deleteRecording(id);
        });
      });
    }

    // Delete a recording
    function deleteRecording(id) {
      if (confirm("Are you sure you want to delete this recording?")) {
        recordings = recordings.filter(recording => recording.id !== id);
        localStorage.setItem('audioRecordings', JSON.stringify(recordings));
        renderRecordings();
      }
    }

// Speech to Text Functionality
// Speech to Text Functionality
function setupSpeechRecognition() {
  const speechBtn = document.getElementById("speech-btn");
  const noteArea = document.getElementById("note-area");

  if (!speechBtn || !noteArea) return; // Exit if elements not found

  let recognition;
  let isRecognizing = false;

  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognitionClass) {
    recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }
      if (finalTranscript) {
        // ✅ Use textContent for a div instead of value
        noteArea.textContent += finalTranscript;
      }
    };

    recognition.onend = () => {
      isRecognizing = false;
      speechBtn.textContent = "Speech to Text";
    };

    speechBtn.addEventListener("click", () => {
      if (!isRecognizing) {
        recognition.start();
        isRecognizing = true;
        speechBtn.textContent = " Stop Speech";
      } else {
        recognition.stop();
      }
    });
  } else {
    console.warn("Speech recognition not supported in this browser.");
    speechBtn.style.display = "none"; // Hide button if not supported
  }
}

// Dark Mode Functionality
function setupDarkMode() {
  const bmodeImg = document.getElementById("bmode"); // Changed to getElementById
  const body = document.body;

  if (!bmodeImg) return; // Exit if no dark mode button found

  // Load saved mode from localStorage
  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add("dark-mode");
    bmodeImg.src = "sun.png";
  }

  // Toggle dark mode
  bmodeImg.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    
    // Save preference
    if (body.classList.contains("dark-mode")) {
      localStorage.setItem('darkMode', 'enabled');
      bmodeImg.src = "sun.png";
    } else {
      localStorage.setItem('darkMode', 'disabled');
      bmodeImg.src = "dark.png";
    }
  });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setupAudioRecording();
  setupSpeechRecognition();
  setupDarkMode();
});

// Also initialize if script loads after DOM is already loaded
if (document.readyState !== 'loading') {
  setupAudioRecording();
  setupSpeechRecognition();
  setupDarkMode();
}


document.addEventListener("DOMContentLoaded", () => {
  const userBtn = document.getElementById("userBtn");
  const userDropdown = document.getElementById("userDropdown");

  // Toggle dropdown on click
  userBtn.addEventListener("click", () => {
    userDropdown.style.display = 
      userDropdown.style.display === "block" ? "none" : "block";
  });

  // Close dropdown if clicked outside
  window.addEventListener("click", (e) => {
    if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.style.display = "none";
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const favBtn = document.getElementById("favBtn");
  const noteTitleInput = document.querySelector(".note-title");
  const noteArea = document.getElementById("note-area");

  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

  let isFavourite = false;

  favBtn.addEventListener("click", () => {
    const noteTitle = noteTitleInput.value.trim();
    const noteContent = noteArea.value.trim();

    if (!noteTitle && !noteContent) {
      alert("Please enter a note before adding to favourites.");
      return;
    }

    const existing = favourites.find(
      note => note.title === noteTitle && note.content === noteContent
    );

    if (existing) {
      // Remove from favourites
      favourites = favourites.filter(
        note => note.title !== noteTitle || note.content !== noteContent
      );
      favBtn.src = "star.png";
      isFavourite = false;
    } else {
      // Add to favourites
      favourites.push({ title: noteTitle, content: noteContent });
      favBtn.src = "starfilled.png";
      isFavourite = true;
    }

    localStorage.setItem("favourites", JSON.stringify(favourites));
  });

  // If you have a dark mode toggle
  const body = document.body;
  const darkModeBtn = document.getElementById("bmode");

  darkModeBtn.addEventListener("click", () => {
    body.classList.toggle("dark");

    // change icons in dark mode
    if (body.classList.contains("dark")) {
      favBtn.src = isFavourite ? "starfilled.png" : "star.png";
    } else {
      favBtn.src = isFavourite ? "starfilled.png" : "star.png";
    }
  });
});



  function saveNote() {
  const title = document.getElementById('noteTitleInput').value;
  const body = document.getElementById('noteContentInput').value;
  const folderId = currentFolderId; // set this when opening the note modal

  fetch("save_note.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "title=" + encodeURIComponent(title) +
          "&body=" + encodeURIComponent(body) +
          "&folder_id=" + encodeURIComponent(folderId)
  })
  .then(response => response.text())
  .then(data => {
    alert(data); // shows message from PHP
    closeNoteModal();
    showFolderDetail(folderId); // reload notes for this folder
  });
}
