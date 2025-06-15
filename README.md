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

Gut geklappt hat der Aufbau mit Design-Tokens (z. B. feste Farben, Abstände, Schriften), wodurch wir die Gestaltung überall einheitlich halten konnten. Auch das Grundlayout mit zentrierten Inhalten und klarer Struktur war schnell stabil. Wiederverwendbare Elemente wie Buttons oder Karten haben uns geholfen, nicht ständig alles neu schreiben zu müssen.

Schwieriger war es beim Bilderbereich ganz oben (Hero). Auf kleinen Bildschirmen sollte das Bild groß und schön wirken, auf größeren eher zurückhaltend. Hier war es schwer, die perfekte Einstellung zu finden. Wir mussten mit object-fit, max-height und Media Queries experimentieren, um es halbwegs passend zu machen.

Auch die Zeitfelder im Registrierungsformular waren nicht einfach. Weil die Wochentagsnamen unterschiedlich lang sind, sahen die Felder zuerst ungleichmäßig aus. Erst mit einem Grid-System konnten wir sie alle gleich ausrichten.

Ein weiteres Problem war, dass wir Login und Register anfangs getrennt gestylt haben. Das hat zu doppeltem Code geführt. Erst später haben wir erkannt, dass eine gemeinsame CSS-Datei einfacher gewesen wäre.

Insgesamt sind wir mit dem Ergebnis zufrieden. Das Design ist klar, responsive und gut strukturiert. Viele Details hätten wir mit mehr Zeit noch besser machen können – aber wir haben dabei viel über CSS, Layout und sauberen Code gelernt.