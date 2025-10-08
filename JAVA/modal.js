 // Global variables
    let folders = [];
    let originalFolders = []; // Master list of folders
    let notes = {};
    let originalNotes = {}; // Master list of notes
    let allNotes = []; // For global search
    let originalAllNotes = []; // Master list of all notes for global search
    let currentFolderId = null;
    let currentNoteId = null;
    let isEditingNote = false;
    const userId = 1; // For demo purposes - in real app, use logged in user ID

    // API endpoints
    const API_BASE = 'http://localhost/notes'; // Correct path
    const FOLDERS_API = `${API_BASE}/create_folder.php`;
    const NOTES_API = `${API_BASE}/save_note.php`;

    // Initialize the app
  document.addEventListener('DOMContentLoaded', function() {
    loadFolders();
    loadAllNotesForSearch();
});


    // Load folders from database
   function loadFolders() {
  fetch("get_folders.php")
    .then(res => res.ok ? res.json() : Promise.reject('Failed to load folders'))
    .then(data => {
      folders = data; // update global folders array
      originalFolders = [...data]; // Create a copy for searching/filtering
      renderFolders(folders); // render folders in the grid
      initSearch(); // Initialize search AFTER folders are loaded
    })
    .catch(error => console.error('Error loading folders:', error));
}

   // Load all notes for the global search functionality
   function loadAllNotesForSearch() {
       fetch('get_all_notes.php')
           .then(res => res.ok ? res.json() : Promise.reject('Failed to load all notes'))
           .then(data => {
               allNotes = data;
               originalAllNotes = [...data];
           })
           .catch(error => {
               console.error('Error loading all notes for search:', error);
           });
   }
    // Load notes for a specific folder
    async function loadNotes(folderId) {
    try {
        const response = await fetch("get_notes.php?folder_id=" + folderId);
        notes[folderId] = await response.json();
        originalNotes[folderId] = [...notes[folderId]]; // Create a copy for searching
    } catch (error) {
        console.error('Error loading notes:', error);
        notes[folderId] = [];
        originalNotes[folderId] = [];
    }
}

    // Render folders in the grid
   function renderFolders(folderList = folders) {
    const folderGrid = document.getElementById('folderGrid');
    folderGrid.innerHTML = '';
    
    // Check the provided list, or the global list if none is provided
    if (folderList.length === 0) {
        folderGrid.innerHTML = `
            <div class="empty-state">
                <h3>No Folders Yet</h3>
                <p>Create your first folder to start organizing your notes!</p>
            </div>
        `;
        return;
    }
    
    folderList.forEach(folder => {
        const folderCard = document.createElement('div');
        folderCard.className = 'folder-card';
        folderCard.innerHTML = `
            <div class="folder-icon">📁</div>
            <span class="folder-date">${formatDate(folder.lastModified)}</span>
            <div class="folder-title">${folder.name}</div>
            <div class="folder-info">
                    <span class="note-count">${folder.noteCount} notes</span>
                    <span class="delete-folder" onclick="deleteFolder(${folder.id}); event.stopPropagation();">🗑️</span>
                </div>
            
        `;
        
        folderCard.addEventListener('click', () => {
            showFolderDetail(folder.id);
        });
        
        folderGrid.appendChild(folderCard);
    });
}

    // Show folder detail view
    async function showFolderDetail(folderId) {
        currentFolderId = folderId;
        const folder = folders.find(f => f.id === folderId);
        
        // Load notes for this folder
        await loadNotes(folderId);
        
        document.getElementById('folderGrid').style.display = 'none';
        document.getElementById('folderDetail').style.display = 'block';
        document.getElementById('folderDetailTitle').textContent = folder.name;
        document.getElementById('folderDetailInfo').textContent = `${folder.noteCount} notes`;
        
        renderNotes(notes[folderId] || []);
    }

    function renderNotes(noteList) {
        const notesGrid = document.getElementById('notesGrid');
        notesGrid.innerHTML = '';
        
        if (noteList.length === 0) {
            notesGrid.innerHTML = `
                <div class="empty-state">
                    <h3>No Notes in This Folder</h3>
                    <p>Create your first note to get started!</p>
                </div>
            `;
            return;
        }
        
       noteList.forEach(note => {
    const noteCard = document.createElement('div');
    noteCard.className = 'note-card';
    noteCard.innerHTML = `
        <div class="note-icon">📝</div>
        <div class="notes-title">${note.title}</div>
        <div class="note-preview">${note.body}</div>
        <div class="note-info">
            <span>Created: ${formatDate(note.created_at)}</span>
        </div>
        <button class="edit-note" onclick="editNote(${currentFolderId}, ${note.id}); event.stopPropagation();">Edit Note</button>
        <button class="delete-note" onclick="deleteNote(${note.id}, ${currentFolderId}); event.stopPropagation();">Delete</button>
    `;
    noteCard.addEventListener('click', (e) => {
        if (!e.target.classList.contains('edit-note') && !e.target.classList.contains('delete-note')) {
            openNote(currentFolderId, note.id);
        }
    });
    notesGrid.appendChild(noteCard);
});
}
                
    // Render a mix of folders and notes for search results
    function renderSearchResults(results) {
        const folderGrid = document.getElementById('folderGrid');
        folderGrid.innerHTML = '';

        if (results.length === 0) {
            folderGrid.innerHTML = `
                <div class="empty-state">
                    <h3>No results found.</h3>
                    <p>Try a different search term.</p>
                </div>
            `;
            return;
        }

        results.forEach(item => {
            let card;
            if (item.noteCount !== undefined) { // It's a folder
                card = document.createElement('div');
                card.className = 'folder-card';
                card.innerHTML = `
                    <div class="folder-icon">📁</div>
                    <span class="folder-date">${formatDate(item.lastModified)}</span>
                    <div class="folder-title">${item.name}</div>
                    <div class="folder-info">
                        <span class="note-count">${item.noteCount} notes</span>
                        <span class="delete-folder" onclick="deleteFolder(${item.id}); event.stopPropagation();">🗑️</span>
                    </div>`;
                card.addEventListener('click', () => showFolderDetail(item.id));
            } else { // It's a note
                card = document.createElement('div');
                card.className = 'note-card';
                card.innerHTML = `
                    <div class="note-icon">📝</div>
                    <div class="notes-title">${item.title}</div>
                    <div class="note-preview">${(item.body || '').substring(0, 100)}...</div>
                    <div class="note-info">
                        <span>Created: ${formatDate(item.created_at)}</span>
                    </div>
                    <button class="edit-note" onclick="editNote(${item.folder_id || 'null'}, ${item.id})">Edit</button>`;
            }
            folderGrid.appendChild(card);
        });
    }

    // Show folder grid view
    function showFolderView() {
        document.getElementById('folderDetail').style.display = 'none';
        document.getElementById('folderGrid').style.display = 'grid';
        currentFolderId = null;
        renderFolders(originalFolders); // Render the original full list of folders
    }

    // Format date for display
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Modal functions
    function openModal() {
        document.getElementById('folderModal').style.display = 'flex';
        document.getElementById('folderNameInput').focus();
    }

    function closeModal() {
        document.getElementById('folderModal').style.display = 'none';
        document.getElementById('folderNameInput').value = '';
    }

    // Create folder in database
    function createFolder() {
        const folderName = document.getElementById("folderNameInput").value.trim();
        if (!folderName) {
            alert("Please enter a folder name!");
            return;
        }

        fetch("create_folder.php", {
            method: "POST",
            credentials: 'include', // Include session cookies with the request
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "folder_name=" + encodeURIComponent(folderName)
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            closeModal();
            loadFolders(); // Reload folders from DB
        });
    }
function goToNoteEditor() {
    if (currentFolderId) {
        sessionStorage.setItem('currentFolderId', currentFolderId);
        // Explicitly remove any old note ID to ensure we are creating a NEW note
        sessionStorage.removeItem('editNoteId');
        window.location.href = 'note_editor.html';
    } else {
        alert('Please select a folder first');
    }
}

    function openNewNote() {
        if (currentFolderId) {
            isEditingNote = false;
            currentNoteId = null;
            document.getElementById('noteModalTitle').textContent = 'Create New Note';
            document.getElementById('noteTitleInput').value = '';
            document.getElementById('noteContentInput').value = '';
            document.getElementById('noteModal').style.display = 'flex';
        } else {
            alert('Please select a folder first');
        }
    }

    // Delete folder from database
    async function deleteCurrentFolder() {
        if (!currentFolderId) return;
        
        const folder = folders.find(f => f.id === currentFolderId);
        if (!folder) return;
        
        if (confirm(`Are you sure you want to delete the folder "${folder.name}" and all its ${folder.noteCount} notes? This action cannot be undone.`)) {
            try {
                const response = await fetch(FOLDERS_API, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: currentFolderId
                    })
                });

                if (response.ok) {
                    showFolderView();
                    await loadFolders();
                    alert(`Folder "${folder.name}" has been deleted.`);
                } else {
                    alert('Error deleting folder');
                }
            } catch (error) {
                console.error('Error deleting folder:', error);
                alert('Error deleting folder');
            }
        }
    }


    function deleteFolder(folderId) {
    if (!confirm("Are you sure you want to delete this folder and all its notes?")) return;
    fetch("delete_folder.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "folder_id=" + encodeURIComponent(folderId)
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        loadFolders();
    });
}
function deleteNote(noteId, folderId) {
    if (!confirm("Are you sure you want to delete this note?")) return;
    fetch("delete_note.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "note_id=" + encodeURIComponent(noteId)
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        showFolderDetail(folderId); // Refresh notes list
    });
}
    // Edit note functionality
   
function editNote(folderId, noteId) {
    // Save folder and note ID to sessionStorage to be used by note_editor.html
    sessionStorage.setItem('currentFolderId', folderId);
    sessionStorage.setItem('editNoteId', noteId); // Use a specific key for editing
    window.location.href = 'note_editor.html';
}
    // Save note to database
    async function saveNote() {
    const title = document.getElementById('noteTitleInput').value;
    const body = document.getElementById('noteContentInput').value;

    if (title.trim() === '') {
        alert('Please enter a note title');
        return;
    }

    try {
        let response;
        if (isEditingNote && currentNoteId) {
            // Update existing note
            response = await fetch('update_note.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: "note_id=" + encodeURIComponent(currentNoteId) +
                      "&title=" + encodeURIComponent(title) +
                      "&body=" + encodeURIComponent(body)
            });
        } else if (currentFolderId) {
            // Create new note
            response = await fetch('save_note.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: "title=" + encodeURIComponent(title) +
                      "&body=" + encodeURIComponent(body) +
                      "&folder_id=" + encodeURIComponent(currentFolderId)
            });
        }

        if (response && response.ok) {
            await showFolderDetail(currentFolderId);
            closeNoteModal();
            alert(isEditingNote ? 'Note updated successfully!' : 'Note created successfully!');
        } else {
            alert('Error saving note');
        }
    } catch (error) {
        console.error('Error saving note:', error);
        alert('Error saving note');
    }
}

    function openNote(folderId, noteId) {
        const note = notes[folderId].find(n => n.id === noteId);
        if (!note) return;
        
        alert(`Note: ${note.title}\n\n${note.content}`);
    }

    // Fallback sample data (if API fails)
    function loadSampleData() {
        folders = [
            {
                id: 1,
                name: "Work",
                noteCount: 5,
                lastModified: "2023-10-15"
            },
            {
                id: 2,
                name: "Personal",
                noteCount: 3,
                lastModified: "2023-10-12"
            }
        ];
        
        notes = {
            1: [
                { id: 1, title: "Meeting Notes", content: "Discussed project timelines.", date: "2023-10-15" }
            ],
            2: [
                { id: 1, title: "Shopping List", content: "Groceries needed.", date: "2023-10-12" }
            ]
        };
        
        renderFolders();
    }

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

 