// js/personal-info.js

document.addEventListener("DOMContentLoaded", async () => {
  const form   = document.getElementById("personalInfoForm");
  const status = document.getElementById("pi-status");

  // 1) Load current data
  try {
    const res = await fetch("/api/personal_info.php", {
      credentials: "include"
    });
    if (res.status === 401) {
      window.location.href = "/login.html";
      return;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    form.elements.username.value = data.username || "";
    form.elements.email.value    = data.email    || "";
  
  } catch (err) {
    console.error("Fehler beim Laden persönlicher Daten:", err);
    status.textContent = "Fehler beim Laden der persönlichen Daten.";
  }

  // 2) Handle submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = form.elements.username.value.trim();
    const email    = form.elements.email.value.trim();
    

    // 3) Validation
    if (!username || !email || !age) {
      alert("Bitte fülle alle Pflichtfelder (Benutzername, E-Mail, Alter) aus.");
      return;
    }

    // 4) Send update
    try {
      const fd   = new FormData(form);
      const res2 = await fetch("/api/personal_info.php", {
        method:      "POST",
        credentials: "include",
        body:        fd
      });
      if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
      const reply = await res2.json();

      if (reply.status === "success") {
        alert("Daten erfolgreich gespeichert.");
      } else {
        alert("Fehler beim Speichern: " + (reply.message || ""));
      }
    } catch (err) {
      console.error("Fehler beim Speichern persönlicher Daten:", err);
      alert("Fehler beim Speichern persönlicher Daten.");
    }
  });
});
