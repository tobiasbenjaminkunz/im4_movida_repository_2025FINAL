// js/exercises.js
// Fetches the daily exercises and renders them into #exercise-feed

document.addEventListener("DOMContentLoaded", () => {
    const feedContainer = document.getElementById("exercise-feed");
  
    async function loadExercises() {
      try {
        const res = await fetch("api/exercises.php");
        if (!res.ok) {
          throw new Error(`Netzwerkfehler: ${res.status}`);
        }
        const exercises = await res.json();
  
        // Clear any “loading” text
        feedContainer.innerHTML = "";
  
        // Render each exercise as a card
        exercises.forEach((ex) => {
          const card = document.createElement("article");
          card.className = "exercise-card";
  
          card.innerHTML = `
            <h2>${ex.exercise_name}</h2>
            <p>${ex.exercise_description}</p>
            <!-- später ggf. <img src="${ex.image_url}" alt="${ex.exercise_name}"> -->
            <button data-id="${ex.exercise_id}" class="start-exercise-btn">
              Zur Übung
            </button>
          `;
          feedContainer.appendChild(card);
        });
  
        // (Optional) Add click handlers to “Zur Übung” buttons
        feedContainer.addEventListener("click", (e) => {
          if (e.target.matches(".start-exercise-btn")) {
            const id = e.target.dataset.id;
            // z.B. window.location.href = `exercise.html?id=${id}`;
            console.log("Start Exercise ID:", id);
          }
        });
      } catch (err) {
        console.error("Fehler beim Laden der Übungen:", err);
        feedContainer.innerHTML = `<p class="error">
          Fehler beim Laden. Bitte versuche es später erneut.
        </p>`;
      }
    }
  
    loadExercises();
  });
  