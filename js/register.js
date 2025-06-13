// js/register.js
console.log("Hello from register.js!");

document.addEventListener("DOMContentLoaded", () => {
  const form        = document.getElementById("registerForm");
  const hcContainer = document.getElementById("health-conditions-container");
  const wtInputs    = Array.from(document.querySelectorAll(".wt-time"));

  console.log(wtInputs)

  // 1) Load health conditions for the checkboxes
  fetch("api/health_conditions.php")
    .then(res => res.json())
    .then(list => {
      hcContainer.innerHTML = "";
      list.forEach(c => {
        const cb = document.createElement("input");
        cb.type  = "checkbox";
        cb.id    = `hc-${c.health_condition_id}`;
        cb.name  = "conditions[]";
        cb.value = c.health_condition_id;

        const lbl = document.createElement("label");
        lbl.htmlFor    = cb.id;
        lbl.textContent = c.condition_name;

        const wrapper = document.createElement("div");
        wrapper.append(cb, lbl);

        hcContainer.append(wrapper);
      });
    })
    .catch(err => {
      console.error("Fehler beim Laden der Gesundheits‐Bedingungen:", err);
      hcContainer.innerHTML = "<p>Fehler beim Laden.</p>";
    });

  // 2) Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Read values *now*
    const username = form.username.value.trim();
    const email    = form.email.value.trim();
    const password = form.password.value;

    console.log("Eingegeben – Username:", username, "Email:", email, "Passwort:", password);

    // Simple validation
    if (!username || !email || password.length < 8) {
      alert("Bitte alle Felder korrekt ausfüllen und Passwort ≥ 8 Zeichen.");
      return;
    }

    // Collect selected health conditions
    const conditions = Array.from(
      form.querySelectorAll("input[name='conditions[]']:checked")
    ).map(cb => cb.value);
    console.log("Ausgewählte Bedingungen:", conditions);

    // Build FormData
    const fd = new FormData();
    fd.append("username", username);
    fd.append("email",    email);
    fd.append("password", password);
    conditions.forEach(id => fd.append("conditions[]", id));

    // Collect one time input per weekday
    wtInputs.forEach(input => {
      const day = input.dataset.day;
      const time = input.value;
      if (time) {
        console.log(`Work-out am Tag ${day} um ${time}`);
        fd.append("wt_day[]",  day);
        fd.append("wt_time[]", time);
      }
    });

    // Send to server
    try {
      const res  = await fetch("api/register.php", {
        method: "POST",
        body: fd
      });
      const text = await res.text();
      console.log("Server antwortet:", text);
      alert(text);
      if (text.includes("erfolgreich")) {
        window.location.href = "login.html";
      }
    } catch (err) {
      console.error("Fehler beim Senden:", err);
      alert("Fehler beim Registrieren. Bitte erneut versuchen.");
    }
  });
});
