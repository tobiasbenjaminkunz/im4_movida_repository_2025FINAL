console.log("Hello from protected.js");

//fetch
fetch("api/protected.php")
    .then((response) => response.json())
    .then((data) => {
        console.log(data);


if (data.status === "error") {
    // Wenn Login erfolgreich, dann zur Startseite weiterleiten
    window.location.href = "login.html";
}

else {

    document.getElementById("welcome_message").
    innerHTML = "Willkommen " + data.username + "!";
}

})
.catch ((error) => {
    console.error("error:", error);
  });