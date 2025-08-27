// Toggle user dropdown
    document.getElementById('userBtn').addEventListener('click', function() {
      document.getElementById('userDropdown').classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    window.addEventListener('click', function(event) {
      if (!event.target.matches('#userBtn')) {
        var dropdown = document.getElementById('userDropdown');
        if (dropdown.classList.contains('show')) {
          dropdown.classList.remove('show');
        }
      }
    });
    
    // Modal functions
    function openProfileModal() {
      document.getElementById('profileModal').style.display = 'flex';
      document.getElementById('userDropdown').classList.remove('show');
    }
    
    function closeProfileModal() {
      document.getElementById('profileModal').style.display = 'none';
    }
    
    function openSettingsModal() {
      document.getElementById('settingsModal').style.display = 'flex';
      document.getElementById('userDropdown').classList.remove('show');
    }
    
    function closeSettingsModal() {
      document.getElementById('settingsModal').style.display = 'none';
    }
    
    // Settings functions
    function updateBodyFontSize(value) {
      document.getElementById('bodySizeValue').textContent = value;
      document.getElementById('bodySizeValueDisplay').textContent = value + 'px';
    }
    
    function updateHeadingFontSize(value) {
      document.getElementById('headingSizeValue').textContent = value;
      document.getElementById('headingSizeValueDisplay').textContent = value + 'px';
    }
    
