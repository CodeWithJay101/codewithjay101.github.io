const cardsSection = document.querySelector(".poke-cards");
const cardsSectionTemplate = document.querySelector(".poke-cards-template");
const searchBar = document.querySelector(".search-input");
const searchContainer = document.querySelector(".search-bar")

function setValue(selector, value, { parent = document } = {}) {
    parent.querySelector(`[data-${selector}]`).textContent = value;
}

async function getAllNames() {
    cardsSection.innerHTML = "";
    const url = await fetch("https://pokeapi.co/api/v2/pokemon");
    const data = await url.json();
    const totalPokemon = data.count;
    const allURL = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${totalPokemon}&offset=0`);
    const allData = await allURL.json();
    const allPokemonName = [];
    
    for (let i = 0; i < allData.results.length; i++) {
        allPokemonName.push(allData.results[i].name);
    }
  
    for (const [index, pokemonName] of allPokemonName.entries()) {
        const element = cardsSectionTemplate.content.cloneNode(true);
        const detailURL = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const detailData = await detailURL.json();
    
        if (detailData.sprites.front_default !== null) {
            element.querySelector("[data-img]").src = detailData.sprites.front_default;
        } else {
            element.querySelector("[data-img]").src = "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png";
        }
    
        const allTypes = [];
        for (let i = 0; i < detailData.types.length; i++) {
            allTypes.push(detailData.types[i].type.name);
        }
    
        setValue("type", allTypes.join(", "), { parent: element })
        setValue("height", detailData.height * 10, { parent: element })
        setValue("weight", detailData.weight / 10, { parent: element })
        setValue("name", pokemonName.replace("-", " "), { parent: element });
        cardsSection.append(element);
        searchContainer.style.setProperty("--note", `'Loading... (${index + 1} of ${totalPokemon})'`);
    }

    searchBar.removeAttribute("disabled");
    searchContainer.style.setProperty("--note", "'Done!'");
    searchContainer.style.setProperty("--color", "green");
    const pokeNames = document.querySelectorAll(".poke-name");
    searchBar.addEventListener("keyup", () => {
        cardsSection.innerHTML = "";
        
        let input = searchBar.value.toLowerCase();
        for (let i = 0; i < pokeNames.length; i++) {
            if (pokeNames[i].innerText.toLowerCase().includes(input)) {
                cardsSection.append(pokeNames[i].parentNode.parentNode);
            }
        }
    });
    
}
getAllNames();

// Get the button:
let mybutton = document.querySelector(".top-btn");
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}