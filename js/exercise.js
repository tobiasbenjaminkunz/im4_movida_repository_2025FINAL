// js/exercises.js

document.addEventListener("DOMContentLoaded", () => {
  const feed = document.getElementById("exercise-feed");

  async function loadExercises() {
    feed.innerHTML = "<p>Lade Übungen …</p>";
    try {
      const res = await fetch("api/exercises.php", { credentials: "include" });
      if (res.status === 401) return void(location.href = "login.html");
      if (!res.ok) throw new Error(res.statusText);

      const list = await res.json();
      if (!list.length) {
        feed.innerHTML = "<p class='no-exercises'>Für heute sind keine Übungen geplant.</p>";
        return;
      }

      feed.innerHTML = "";
      list.forEach(ex => {
        const card = document.createElement("article");
        card.className = "exercise-card";
        card.innerHTML = `
          <h2>${ex.exercise_name}</h2>
          <p class="time-tag">Uhrzeit: ${ex.time_of_day}</p>
          <p>${ex.exercise_description}</p>
        `;
        feed.append(card);
      });
    } catch (err) {
      console.error(err);
      feed.innerHTML = "<p class='error'>Fehler beim Laden. Bitte später erneut probieren.</p>";
    }
  }

  loadExercises();
});
