// Fonction appel des nounours

let listeNounours;

async function fetchNounours() {
    listeNounours = await fetch("http://localhost:3000/api/teddies")
        .then((res) => res.json());
}

// Fonction injection HTML dans index.html

let conteneurProduit = document.getElementById("conteneur--produit");

async function showNounours() {
    await fetchNounours();

    let nounoursHTML = "";

    listeNounours.forEach(nounours => (
        nounoursHTML +=
        `
                <a class="carte" href="./produit.html?id=${nounours._id}">
                    <img class="carte__img" src="${nounours.imageUrl}"></img>
                    <div class="carte__infos">
                        <h1 class="infos__titre">${nounours.name}</h1>
                        <p class="infos__prix">${(nounours.price/100).toFixed(2)}€</p>
                        <p class="infos__description"><strong>Description :</strong> ${nounours.description}</p>             
                    </div>
                </a>
                `
    ));

    if (conteneurProduit != null) {
        conteneurProduit.innerHTML = nounoursHTML;
    }
}

showNounours();