// On déclare variables et constantes

let listeNounours;
let conteneurProduit = document.getElementById("conteneur--produit");

// On récupère la liste 

const fetchNounours = async() => {
    listeNounours = await fetch("http://localhost:3000/api/teddies")
    .then((res) => res.json());
};

// On injecte notre résultat dans le HTML

const showNounours = async() => {
    await fetchNounours();

    conteneurProduit.innerHTML = (
        listeNounours
            .map(nounours => (
                `
                <div class="carte">
                    <img class="carte__img" src="${nounours.imageUrl}"></img>
                    <div class="carte__infos">
                        <h1 class="infos__titre">${nounours.name}</h1>
                        <p class="infos__prix">${nounours.price}€</p>
                        <p class="infos__description"><strong>Description :</strong> ${nounours.description}</p>             
                    </div>
                </div>
                `
                ))
                .join('')
    )
};

// On active notre fonction globale

showNounours();