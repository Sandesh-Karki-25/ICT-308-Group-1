<?php
session_start();
if (!isset($_SESSION['student_id'])) {
    header("Location: /notes/login.html?error=" . urlencode("Please log in."));
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>I-NOTES – Audio Recording</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
  <aside class="sidebar">
    <h2>I-NOTES</h2>
    <button class="new-note" onclick="window.location.href='notes.php'">+ New Note</button>
    <nav>
      <ul>
        <li><a href="dashboard.php">Dashboard</a></li>
        <li><a href="fav.php">Favourites</a></li>
        <li><a href="audio.php">Audio Recording</a></li>
        <li><a href="all.php">All Notes</a></li>
      </ul>
    </nav>
  </aside>

  <main class="main">
    <header>
      <div class="logo-container">
        <img src="cihelogo.png" alt="CIHE Background Logo" class="logo-background">
        <img src="cihelogo.png" alt="CIHE Logo" class="main-logo">
      </div>
      <h2>Audio Recording</h2>
      <div class="search-container">
        <form class="search-form-inline" id="searchForm" action="#" onsubmit="event.preventDefault(); doSearch();">
          <input type="text" placeholder="Search notes..." class="search-bar" id="searchInput" aria-label="Search notes">
          <button class="search-button" type="submit">
            <img src="search.png" alt="Search Icon" class="search-icon">
          </button>
        </form>
        <img id="bmode" src="dark.png" alt="Toggle dark mode">
        <div class="user-menu">
          <div class="user" id="userBtn"><?php echo htmlspecialchars($_SESSION['username'][0] ?? 'U'); ?></div>
          <div class="dropdown" id="userDropdown">
            <ul>
              <li><a href="#">Profile</a></li>
              <li><a href="#">Settings</a></li>
              <li><a href="logout.php">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </header>

    <section class="content">
      <div class="section-title">
        <h2>Record and Manage Audio Notes</h2>
      </div>
      <div id="audioControls">
        <!-- Add your audio recording controls here -->
      </div>
    </section>
  </main>

  <script>
    function doSearch() {
      const q = document.getElementById('searchInput').value.trim();
      const url = new URL('all.php', location.href);
      if (q) url.searchParams.set('q', q);
      location.href = url.toString();
    }
  </script>
</body>
</html>