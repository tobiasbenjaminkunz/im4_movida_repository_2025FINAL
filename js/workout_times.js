// js/workout-times.js

document.addEventListener("DOMContentLoaded", () => {
  const wtList  = document.getElementById("wt-list");
  const form    = document.getElementById("workoutTimesForm");
  const statusP = document.getElementById("wt-status");

  // holds existing slots (day → { id, time })
  const existing = {};

  const days = [
    "Sonntag","Montag","Dienstag",
    "Mittwoch","Donnerstag","Freitag","Samstag"
  ];

  // 1) build seven inputs
  days.forEach((label, day) => {
    const wrapper = document.createElement("div");
    wrapper.className    = "wt-entry";
    wrapper.dataset.day  = day;

    const lbl = document.createElement("label");
    lbl.htmlFor         = `time_${day}`;
    lbl.textContent     = label;

    const inp = document.createElement("input");
    inp.type            = "time";
    inp.id              = `time_${day}`;
    inp.name            = `time_${day}`;

    wrapper.append(lbl, inp);
    wtList.append(wrapper);
  });

  // 2) load & populate existing
  async function loadTimes() {
    statusP.textContent = "";
    try {
      const res  = await fetch("api/workout_times.php", { credentials: "include" });
      if (res.status === 401) return void (window.location.href = "../login.html");
      const times = await res.json();

      // clear old data
      Object.keys(existing).forEach(k => delete existing[k]);
      times.forEach(t => {
        existing[t.day_of_week] = {
          id:   t.workout_time_id,
          time: t.time_of_day
        };
      });

      // fill inputs
      days.forEach((_, day) => {
        const inp = document.getElementById(`time_${day}`);
        inp.value = existing[day]?.time || "";
      });
    } catch (err) {
      console.error("Fehler beim Laden:", err);
      statusP.textContent = "Fehler beim Laden der Trainingszeiten.";
    }
  }

  // 3) save handler
  form.addEventListener("submit", async e => {
    e.preventDefault();
    statusP.textContent = "";

    for (let day = 0; day < 7; day++) {
      const inp = document.getElementById(`time_${day}`);
      const newTime = inp.value;
      const oldSlot = existing[day];

      // a) cleared existing → DELETE
      if (oldSlot && !newTime) {
        await fetch("api/workout_times.php", {
          method: "DELETE",
          credentials: "include",
          body: new URLSearchParams({ id: oldSlot.id })
        });
      }
      // b) newly added → POST
      else if (!oldSlot && newTime) {
        const fd = new FormData();
        fd.append("day_of_week", day);
        fd.append("time", newTime);
        await fetch("api/workout_times.php", {
          method: "POST",
          credentials: "include",
          body: fd
        });
      }
      // c) changed → DELETE + POST
      else if (oldSlot && newTime && newTime !== oldSlot.time) {
        await fetch("api/workout_times.php", {
          method: "DELETE",
          credentials: "include",
          body: new URLSearchParams({ id: oldSlot.id })
        });
        const fd = new FormData();
        fd.append("day_of_week", day);
        fd.append("time", newTime);
        await fetch("api/workout_times.php", {
          method: "POST",
          credentials: "include",
          body: fd
        });
      }
      // else: no change
    }

    statusP.textContent = "Änderungen gespeichert.";
    await loadTimes();
  });

  loadTimes();
});
