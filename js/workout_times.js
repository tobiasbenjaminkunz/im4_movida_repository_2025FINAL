// js/workout-times.js
document.addEventListener("DOMContentLoaded", () => {
    const listEl = document.getElementById("existing-times");
    const form   = document.getElementById("workoutTimesForm");
    const status = document.getElementById("wt-status");
  
    // helper to reload the list
    async function reload() {
      listEl.innerHTML = "<p>Lade …</p>";
      const times = await (await fetch("api/workout_times.php")).json();
      listEl.innerHTML = "";
      times.forEach(t => {
        const div = document.createElement("div");
        div.textContent = 
          ["So","Mo","Di","Mi","Do","Fr","Sa"][t.day_of_week] 
          + " – " + t.time;
        const btn = document.createElement("button");
        btn.textContent = "Löschen";
        btn.dataset.id = t.workout_time_id;
        btn.addEventListener("click", async () => {
          await fetch("api/workout_times.php", {
            method: "DELETE",
            body: new URLSearchParams({ id: t.workout_time_id })
          });
          reload();
        });
        div.append(" ", btn);
        listEl.append(div);
      });
    }
  
    // initial load
    reload();
  
    // on new time
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const fd = new FormData(form);
      const res = await fetch("api/workout_times.php", {
        method: "POST",
        body: fd
      });
      const json = await res.json();
      status.textContent = json.status === 'success'
        ? 'Zeit hinzugefügt'
        : 'Fehler';
      if (json.status === 'success') {
        form.reset();
        reload();
      }
    });
  });
  