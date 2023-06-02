const timelines = document.getElementsByClassName("single-timeline-area");
const elementsPerRow = 5;

async function getCharacterFromAPI(index) {
  const response = await fetch(`https://swapi.dev/api/people/${index}`);
  const character = await response.json();

  return character;
}

function* characterGenerator(initial) {
  yield getCharacterFromAPI(initial + 1);
  yield getCharacterFromAPI(initial + 2);
  yield getCharacterFromAPI(initial + 3);
  yield getCharacterFromAPI(initial + 4);
  yield getCharacterFromAPI(initial + 5);
}

function createCard(parent, name, height, weight) {
  const container = document.createElement("div");
  container.setAttribute("id", name);
  container.setAttribute("class", "col-12 col-md-6 col-lg-4");
  container.innerHTML = `
        <div class="single-timeline-content d-flex wow fadeInLeft" data-wow-delay="0.3s" style="visibility: visible; animation-delay: 0.3s; animation-name: fadeInLeft;">
            <div class="timeline-icon"></div>
            <div class="timeline-text">
                <h6>${name}</h6>
                <p>Estatura: ${height}. Peso: ${weight}.</p>
            </div>
        </div>
    `;

  parent.appendChild(container);
  return container;
}

for (let timelineIndex = 0; timelineIndex < timelines.length; timelineIndex++) {
  const timeline = timelines[timelineIndex];

  let isHovering = false;

  timeline.addEventListener("mouseenter", async (event) => {
    isHovering = true;

    const generator = characterGenerator(timelineIndex * elementsPerRow);
    const cardsRow = timeline.getElementsByClassName("row")[0];

    let generated = generator.next();

    while (!generated.done && isHovering) {
      const character = await generated.value;
      const existing = document.getElementById(character.name);

      if (isHovering && !existing) {
        createCard(
          cardsRow,
          character.name,
          character.height + " cm",
          character.mass + " kg"
        );
      }

      generated = generator.next();
    }
  });

  timeline.addEventListener("mouseleave", () => {
    isHovering = false;

    const cardsRow = timeline.getElementsByClassName("row")[0];
    const mainCard = cardsRow.children[0];

    cardsRow.innerHTML = "";
    cardsRow.appendChild(mainCard);
  });
}
