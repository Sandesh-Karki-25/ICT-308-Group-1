 function openModal() {
  document.getElementById("shareOverlay").style.display = "flex";
}

function closeModal() {
  document.getElementById("shareOverlay").style.display = "none";
}

function shareByEmail() {
  const email = document.getElementById("emailInput").value;
  if (email) {
    const subject = "Check this out!";
    const body = "Here’s the link: " + window.location.href;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  } else {
    alert("Please enter an email address.");
  }
}

function copyLink() {
  const dummy = document.createElement("input");
  const text = window.location.href;
  dummy.setAttribute("value", text);
  document.body.appendChild(dummy);
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);

  alert("Link copied to clipboard!");
}
