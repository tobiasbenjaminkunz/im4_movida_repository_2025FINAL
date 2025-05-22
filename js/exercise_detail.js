// js/exercise-detail.js
document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const container = document.getElementById("exercise-detail-container");
  
    if (!id) {
      container.textContent = "Keine Übungs-ID übergeben.";
      return;
    }
  
    try {
      const res = await fetch(`api/exercise_detail.php?id=${id}`);
      if (!res.ok) throw new Error(`Fehler: ${res.status}`);
      const ex = await res.json();
  
      container.innerHTML = `
        <h2>${ex.exercise_name}</h2>
        <p>${ex.exercise_description}</p>
        <button id="complete-btn">Übung abgeschlossen</button>
      `;
  
      document
        .getElementById("complete-btn")
        .addEventListener("click", () => {
          // TODO: call API to mark this exercise complete
          alert("Übung als erledigt markiert!");
        });
    } catch (err) {
      console.error(err);
      container.textContent = "Fehler beim Laden der Übung.";
    }
  });
  