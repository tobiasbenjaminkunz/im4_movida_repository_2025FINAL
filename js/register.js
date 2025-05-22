// console.log("Hello from Register JS!");

// document
//   .getElementById("registerForm")
//   .addEventListener("submit", async (e) => {
//     e.preventDefault(); // Formular‑Reload verhindern

//     // ► Eingabewerte aus den Feldern holen
//     const username = document.querySelector("#username").value.trim();
//     const email = document.querySelector("#email").value.trim();
//     const password = document.querySelector("#password").value;

//     // validate if all fields are filled
//     if (!username || !email || !password) {
//       alert("Bitte fülle alle Felder aus");
//       return;
//     }

//     // check passwords requirements
//     if (password.length < 8) {
//       alert("Passwort muss mindestens 8 Zeichen lang sein");
//       return;
//     }

//     // FormData füllt PHPs $_POST automatisch
//     const formData = new FormData();
//     formData.append("username", username);
//     formData.append("email", email);
//     formData.append("password", password);

//     // Fetch
//     try {
//       const res = await fetch("api/register.php", {
//         method: "POST",
//         body: formData,
//       });
//       const reply = await res.text(); // register.php schickt nur Klartext zurück
//       console.log("Antwort vom Server:\n" + reply);
//       alert(reply);
    
//       if (reply === "Registrierung erfolgreich") //message darf wirklich nur exakt so lauten
//       {
//     // Wenn registrierung erfolgreich, dann zur Startseite weiterleiten
//     window.location.href = "index.html";
//   }

//     } 
    
//     catch (err) {
//       console.error("Fehler beim Senden:", err);
  
//     }

    
//   });



console.log("Hello from Register JS!");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const hcContainer = document.getElementById("health-conditions-container");

  // Load health conditions into checkboxes
  fetch("api/health_conditions.php")
    .then(res => res.json())
    .then(conds => {
      hcContainer.innerHTML = "";
      conds.forEach(c => {
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.id   = `hc-${c.health_condition_id}`;
        cb.name = "conditions[]";
        cb.value = c.health_condition_id;

        const lbl = document.createElement("label");
        lbl.htmlFor = cb.id;
        lbl.textContent = c.condition_name;

        const div = document.createElement("div");
        div.append(cb, lbl);
        hcContainer.append(div);
      });
    })
    .catch(err => {
      console.error("Fehler beim Laden der Bedingungen:", err);
      hcContainer.innerHTML = "<p>Fehler beim Laden.</p>";
    });

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Formular-Reload verhindern

    // ► Eingabewerte aus den Feldern holen
    const username = form.username.value.trim();
    const email    = form.email.value.trim();
    const password = form.password.value;

    // validate if all fields are filled
    if (!username || !email || !password) {
      alert("Bitte fülle alle Felder aus");
      return;
    }

    // check passwords requirements
    if (password.length < 8) {
      alert("Passwort muss mindestens 8 Zeichen lang sein");
      return;
    }

    // gather selected conditions
    const selectedConds = Array.from(
      form.querySelectorAll("input[name='conditions[]']:checked")
    ).map(cb => cb.value);

    // FormData füllt PHPs $_POST automatisch
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    selectedConds.forEach(id => formData.append("conditions[]", id));

    // Fetch
    try {
      const res = await fetch("api/register.php", {
        method: "POST",
        body: formData,
      });
      const reply = await res.text(); // register.php schickt nur Klartext zurück
      console.log("Antwort vom Server:\n" + reply);
      alert(reply);

      if (reply === "Registrierung erfolgreich") {
        // Wenn registrierung erfolgreich, dann zur Startseite weiterleiten
        window.location.href = "index.html";
      }
    } catch (err) {
      console.error("Fehler beim Senden:", err);
    }
  });
});
