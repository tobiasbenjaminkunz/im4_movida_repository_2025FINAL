// js/health-profile.js
document.addEventListener("DOMContentLoaded", async () => {
  const form    = document.getElementById("healthProfileForm");
  const boxWrap = document.getElementById("condition-checkboxes");
  const status  = document.getElementById("hp-status");

  // load all possible conditions
  const allConds = await (await fetch("api/health_conditions.php")).json();
  // load user’s existing
  const userConds = await (await fetch("api/user_conditions.php")).json();

  allConds.forEach(cond => {
    const cb = document.createElement("input");
    cb.type  = "checkbox";
    cb.id    = `hc-${cond.health_condition_id}`;
    cb.value = cond.health_condition_id;
    if (userConds.includes(cond.health_condition_id)) cb.checked = true;

    const lbl = document.createElement("label");
    lbl.htmlFor    = cb.id;
    lbl.textContent = cond.condition_name;
    const div = document.createElement("div");
    div.append(cb, lbl);
    boxWrap.append(div);
  });

  // on submit → POST new list
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const selected = Array.from(boxWrap.querySelectorAll("input:checked"))
                          .map(i => i.value);
    const resp = await fetch("api/user_conditions.php", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conditions: selected })
    });
    const json = await resp.json();
    status.textContent = json.status === 'success'
      ? 'Gesundheitsprofil gespeichert'
      : 'Fehler beim Speichern';
  });
});
