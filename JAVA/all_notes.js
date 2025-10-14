function loadAllNotes() {
  fetch("get_all_notes.php")
    .then(res => res.json())
    .then(notes => {
      const grid = document.getElementById("allNotesGrid");
      grid.innerHTML = "";
      if (notes.length === 0) {
        grid.innerHTML = "<p>No notes found.</p>";
        return;
      }
      notes.forEach(note => {
        const div = document.createElement("div");
        div.className = "note-card";
        div.innerHTML = `
          <div class="note-title">${note.title}</div>
          <div class="note-body">${note.body}</div>
          <div class="note-folder">Folder: ${note.folder_name}</div>
        `;
        grid.appendChild(div);
      });
    });
}

document.addEventListener('DOMContentLoaded', loadAllNotes);