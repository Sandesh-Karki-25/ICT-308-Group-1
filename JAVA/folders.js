
    const folderModal = document.getElementById("folderModal");
    const folderList = document.getElementById("folderList");
    const currentFolderTitle = document.getElementById("currentFolder");
    const notesContainer = document.getElementById("notesContainer");
    const folderNameInput = document.getElementById("folderNameInput");

    let currentFolder = null;

    // Open modal
    function openModal() {
      folderModal.style.display = "flex";
      folderNameInput.value = "";
    }

    // Close modal
    function closeModal() {
      folderModal.style.display = "none";
    }

    // Create folder
    function createFolder() {
      const name = folderNameInput.value.trim();
      if (!name) {
        alert("Please enter folder name!");
        return;
      }

      const folder = document.createElement("div");
      folder.className = "folder";
      folder.innerText = "📁 " + name;
      folder.onclick = () => openFolder(name);
      folderList.appendChild(folder);

      closeModal();
    }

    // Add note button from modal
    function newNoteModal() {
      const name = folderNameInput.value.trim();
      if (!name) {
        alert("Please write folder name before adding note!");
        return;
      }

      openFolder(name);
      closeModal();
    }

    // Open folder
    function openFolder(name) {
      currentFolder = name;
      currentFolderTitle.innerText = name + " Folder";
      notesContainer.innerHTML = "";
    }

    // Add new note
    function addNote() {
      if (!currentFolder) {
        alert("Please select a folder first!");
        return;
      }
      const note = document.createElement("div");
      note.className = "note";
      note.contentEditable = "true";
      note.innerText = "New Note...";
      notesContainer.appendChild(note);
    }

    // Close modal if clicking outside content
    window.onclick = function(e) {
      if (e.target === folderModal) closeModal();
    }




   