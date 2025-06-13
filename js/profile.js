// js/profile_hub.js
console.log("✅ profile_hub.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
  const phUsername   = document.getElementById("ph-username");
  const phEmail      = document.getElementById("ph-email");
  const phAge        = document.getElementById("ph-age");
  const phConditions = document.getElementById("ph-conditions");
  const phTimes      = document.getElementById("ph-times");

  // Edit buttons
  document.getElementById("edit-personal")
          .addEventListener("click", () => location.href = "personal_info.html");
  document.getElementById("edit-health")
          .addEventListener("click", () => location.href = "health_profile.html");
  document.getElementById("edit-times")
          .addEventListener("click", () => location.href = "workout_times.html");

  // Helper for fetching JSON with logging
  async function fetchJSON(url) {
    console.log(`→ fetching ${url}`);
    const res = await fetch(url, { credentials: "include" });
    console.log(`← ${url} responded ${res.status}`);
    if (res.status === 401) {
      window.location.href = "/login.html";
      throw new Error("Not logged in");
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  // 1) Personal Info
  try {
    const data = await fetchJSON("/api/personal_info.php");
    console.log("personal_info:", data);
    phUsername.textContent = data.username     || "–";
    phEmail.textContent    = data.email        || "–";
    phAge.textContent      = data.age ?? "–";
  } catch (err) {
    console.error("Error loading personal_info:", err);
  }

  // 2) Health Conditions
  try {
    const [allConds, userConds] = await Promise.all([
      fetchJSON("/api/health_conditions.php"),
      fetchJSON("/api/user_conditions.php")
    ]);
    console.log("allConds:", allConds, "userConds:", userConds);
    const selected = allConds.filter(c =>
      userConds.includes(c.health_condition_id)
    );
    phConditions.innerHTML = selected.length
      ? selected.map(c => `<li>${c.condition_name}</li>`).join("")
      : `<li>– keine Beschwerden ausgewählt –</li>`;
  } catch (err) {
    console.error("Error loading health conditions:", err);
  }

  // 3) Workout Times
  try {
    const times = await fetchJSON("/api/workout_times.php");
    console.log("workout_times:", times);
    if (times.length) {
      // sort by day
      times.sort((a,b) => a.day_of_week - b.day_of_week);
      phTimes.innerHTML = times.map(t => {
        const days = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
        return `<li>${days[t.day_of_week]} – ${t.time_of_day}</li>`;
      }).join("");
    } else {
      phTimes.innerHTML = `<li>– noch keine Trainingszeit festgelegt –</li>`;
    }
  } catch (err) {
    console.error("Error loading workout_times:", err);
  }
});
