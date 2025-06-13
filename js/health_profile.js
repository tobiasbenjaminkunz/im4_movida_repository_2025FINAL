// js/health_profile.js

document.addEventListener("DOMContentLoaded", async () => {
  const form    = document.getElementById("healthProfileForm");
  const boxWrap = document.getElementById("condition-checkboxes");
  const status  = document.getElementById("hp-status");

  try {
    // 1) Load all health conditions from the root API
    const allRes = await fetch("/api/health_conditions.php", {
      credentials: "include"
    });
    if (!allRes.ok) throw new Error(`HTTP ${allRes.status}`);
    const allConds = await allRes.json();

    // 2) Load user’s currently selected conditions
    const userRes = await fetch("/api/user_conditions.php", {
      credentials: "include"
    });
    if (!userRes.ok) throw new Error(`HTTP ${userRes.status}`);
    const userConds = await userRes.json();

    // 3) Render checkboxes
    boxWrap.innerHTML = "";
    allConds.forEach(cond => {
      const cb = document.createElement("input");
      cb.type  = "checkbox";
      cb.id    = `hc-${cond.health_condition_id}`;
      cb.name  = "conditions[]";
      cb.value = cond.health_condition_id;
      if (userConds.includes(cond.health_condition_id)) {
        cb.checked = true;
      }

      const lbl = document.createElement("label");
      lbl.htmlFor    = cb.id;
      lbl.textContent = cond.condition_name;

      const row = document.createElement("div");
      row.append(cb, lbl);
      boxWrap.append(row);
    });
  } catch (err) {
    console.error("Fehler beim Laden:", err);
    boxWrap.innerHTML = "<p>Fehler beim Laden der Bedingungen.</p>";
  }

  // 4) Handle form submit
  form.addEventListener("submit", async e => {
    e.preventDefault();
    status.textContent = "";

    const selected = Array.from(
      form.querySelectorAll("input[name='conditions[]']:checked")
    ).map(cb => cb.value);

    try {
      const res = await fetch("/api/user_conditions.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conditions: selected })
      });
      const result = await res.json();
      status.textContent = result.status === "success"
        ? "Gesundheitsprofil gespeichert"
        : "Fehler beim Speichern";
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      status.textContent = "Fehler beim Speichern";
    }
  });
});
