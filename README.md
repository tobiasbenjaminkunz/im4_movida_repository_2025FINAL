# im4_movida_repository_2025FINAL
 

---

## 🎨 Design & CSS-Konzept

- **`main.css`** enthält globale Tokens (Farben, Fonts, Abstände) & Layout-Grundregeln.
- **Jede Unterseite** hat optional ein eigenes CSS (z. B. `contact.css`).
- **Login & Register** nutzen gemeinsam `auth.css`.
- Layout ist **mobile-first** und wird über **Media Queries ab `768px`** angepasst.
- Responsives Verhalten für Bilder, Formulare und Komponenten ist integriert


## 👥 Team

Dieses Projekt wurde im Rahmen von **IM4** von Tobias & Aglaja entwickelt.  
UX basiert auf einem Figma-Prototyp und wurde mit HTML, CSS und JavaScript umgesetzt.
Bei der Gestaltung unseres MoVida-Prototyps wollten wir ein übersichtliches, modernes und responsives Design umsetzen. Vieles hat dabei gut funktioniert, anderes war schwieriger als gedacht – vor allem wegen Zeitmangel.


Projektstruktur & Datei-Erklärungen

Root HTML

index.html: Landingpage mit der Tagesübersicht der Übungen. Zeigt dynamisch geladenen Content via exercises.js.

login.html & register.html: Authentifizierungsseiten. Formulare, validiert in JS, kommunizieren mit api/login.php und api/register.php.

exercise.html, calendar.html, contact.html, how-it-works.html: Statische Inhalte bzw. dynamisch gefüllte FAQ und Kontakt-Infos.

Profil-Unterseiten (profile/)

profilehub.html: Dashboard. Lädt und zeigt persönliche Daten, Gesundheitsprofil und Trainingszeiten. Scripts: profile_hub.js.

personal-info.html: Formular zur Bearbeitung von Benutzername, E-Mail und Alter. Befüllt via personal_info.js und api/personal_info.php.

health_profile.html: Checkbox-Liste medizinischer Bedingungen. Handled by health_profile.js, APIs: health_conditions.php, user_conditions.php.

workout-times.html: Tagesbasierte Zeitfelder (7 Inputs, ein Feld pro Wochentag). JS: workout_times.js, API: workout_times.php.

settings.html: (Optional) Umschalter für Accessibility, lokal gespeichert in settings.js.

JavaScript (js/)

nav.js: Burger-Menü Toggle, konsistente Navigation.

login.js, register.js, logout.js, protected.js: Session-Handling und Weiterleitungen.

exercises.js: Holt heutige Übungen und rendert Karten.

Profil: personal_info.js, health_profile.js, workout_times.js, profile_hub.js laden und speichern User-Daten via jeweiliger APIs.

APIs (PHP in api/)

config.php: PDO-Setup.

Auth: register.php, login.php, logout.php, protected.php.

Daten: health_conditions.php (Lookup), user_conditions.php (GET/POST User-Zuordnungen), personal_info.php, workout_times.php (CRUD über Tage), exercises.php (liefert Tagesfeed).

Scheduler: schedule.php für Zuweisung von Übungen pro Zeitslot (Option A), optional dynamischer Join (Option B).

Prozess & Entscheidungen

Funktionalität: Dynamic vs. Assigned

Dynamic Feed (Option B): Ursprünglich haben wir user_exercises befüllt, später aber dynamisches Join bevorzugt, da Änderungen in Profil oder Zeiten sofort im Feed sichtbar sind und weniger Datenpflege nötig ist.

Assigned Feed (Option A): Implementiert über schedule.php, aber für diese Version nicht aktiv. Ermöglicht Tracking einzeln zugeordneter Übungen.

Herausforderungen & Lösungen

Relative Pfade: Konsistente Nutzung von absoluten /api/...-Routen in JS nötig, um 404-Fehler unter Unterverzeichnissen zu vermeiden.

Workout-Zeiten UI: Erst als dynamische Liste (Add/Delete), später als fester 7-Felder-Grid umgesetzt, um einheitliche Eingabe pro Wochentag zu garantieren.

Health Conditions: Multi-Select per Checkbox, parallele Speicherung in relationaler Tabelle user_has_condition.

Cache & Hot-Reload: JS-Module mussten hart neu geladen werden (Ctrl+F5), um Namenskonventionen mit Unterstrich vs. Bindestrich zu synchronisieren.

Funktionalität weggelassen

Offline-Support: Ursprünglich geplant, für spätere Version verschoben.

Übungs-Abschließen: Das Markieren von Übungen als erledigt wurde aus Zeitgründen und Komplexitätsreduktion gestrichen.

Reflexion:

Gut geklappt hat der Aufbau mit Design-Tokens (z. B. feste Farben, Abstände, Schriften), wodurch wir die Gestaltung überall einheitlich halten konnten. Auch das Grundlayout mit zentrierten Inhalten und klarer Struktur war schnell stabil. Wiederverwendbare Elemente wie Buttons oder Karten haben uns geholfen, nicht ständig alles neu schreiben zu müssen.

Schwieriger war es beim Bilderbereich ganz oben (Hero). Auf kleinen Bildschirmen sollte das Bild groß und schön wirken, auf größeren eher zurückhaltend. Hier war es schwer, die perfekte Einstellung zu finden. Wir mussten mit object-fit, max-height und Media Queries experimentieren, um es halbwegs passend zu machen.

Auch die Zeitfelder im Registrierungsformular waren nicht einfach. Weil die Wochentagsnamen unterschiedlich lang sind, sahen die Felder zuerst ungleichmäßig aus. Erst mit einem Grid-System konnten wir sie alle gleich ausrichten.

Ein weiteres Problem war, dass wir Login und Register anfangs getrennt gestylt haben. Das hat zu doppeltem Code geführt. Erst später haben wir erkannt, dass eine gemeinsame CSS-Datei einfacher gewesen wäre.

Das Backend, sowie js und html haben erstaunlich schnell recht gut funktioniert. Hierbei war die schlüssel entscheidung, die gesamte struktur von anfang an mit chatgpt aufzusetzen und alles im gleichen o4-mini-high chat zu machen. Die AI hatte so immer zugriff auf den gesamten code und es kam nur einmal dazu, dass bugfixes an einer stelle an einer anderen etwas kaputt gemacht haben. 
Die Login, register und contact files standen nach dem Präsenz-Untericht und wurden in den restlichen Code integriert.

Insgesamt sind wir mit dem Ergebnis zufrieden. Das Design ist klar, responsive und gut strukturiert. Viele Details und zusätzliche Features hätten wir mit mehr Zeit noch besser machen können – aber wir haben dabei viel über CSS, Layout, das Arbeiten mit Chatgpt und sauberen Code gelernt.

