// js/personal-info.js
document.addEventListener("DOMContentLoaded", async () => {
    const form   = document.getElementById("personalInfoForm");
    const status = document.getElementById("pi-status");
  
    // 1) Load existing
    const res = await fetch("api/personal_info.php");
    if (res.ok) {
      const data = await res.json();
      form.username.value = data.username || "";
      form.email.value    = data.email    || "";
      form.age.value      = data.age      || "";
    }
  
    // 2) On submit → POST update
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const r2 = await fetch("api/personal_info.php", {
        method: "POST",
        body: fd
      });
      const reply = await r2.json();
      status.textContent = reply.status === "success"
        ? "Daten gespeichert."
        : "Fehler beim Speichern.";
    });
  });
  