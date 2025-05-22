// js/profile.js
// Ensures only logged-in users can view the profile hub
// and adds a personalized greeting.

document.addEventListener("DOMContentLoaded", async () => {
    try {
      const res  = await fetch("../api/protected.php");
      const data = await res.json();
  
      if (data.status !== "success") {
        // Not logged in → back to login
        window.location.href = "../login.html";
        return;
      }
  
      // Add a welcome message under the header
      const header = document.querySelector("header");
      const p      = document.createElement("p");
      p.id         = "profile-welcome";
      p.textContent = `Willkommen, ${data.username}!`;
      header.appendChild(p);
  
    } catch (err) {
      console.error("Fehler beim Laden der Benutzerdaten:", err);
    }
  });
  