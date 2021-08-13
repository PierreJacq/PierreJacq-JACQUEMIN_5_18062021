// FICHE PRODUIT - Préparation const 

const pageProduit = document.getElementById("page__produit");

// FICHE PRODUIT - fonction d'extraction de l'ID dans l'URL 

async function idExtract(){
        const urlParams = new URLSearchParams(window.location.search);
        const identifiant = urlParams.get('id');
        //console.log(identifiant);
        return identifiant;
}

// FICHE PRODUIT - Query qui retourne le bon produit

async function pickedNounours() {
        const idProduit = await idExtract()
        const arrayProduit = await fetch(`http://localhost:3000/api/teddies/${idProduit}`)
        .then((res) => res.json())
        //console.log(arrayProduit);
        return arrayProduit;
};

// FICHE PRODUIT - Fonction injection du résultat

async function nounoursChoisi(){
        ficheproduit = await pickedNounours();
        pageProduit.innerHTML ="<p> Hello Pierro </p>";
        pageProduit.innerHTML =
                `<img class="produit__img" src="${ficheproduit.imageUrl}"></img>
                        <div class="produit__contDroit">
                                <div class="produit__infos">
                                        <h1 class="infos__titre">${ficheproduit.name}</h1>
                                        <p class="infos__prix">${ficheproduit.price}€</p>
                                        <p class="infos__description"><strong>Description :</strong> ${ficheproduit.description}</p>             
                                </div>
                                <div class="produit__panier">
                                        <div class="produit__quantités">
                                                <i class="fas fa-caret-left"></i>
                                                <div class="produit__chiffre">1</div>
                                                <i class="fas fa-caret-right"></i>
                                        </div>
                                        <button id="bouton__panier">Ajout au panier</button>
                                </div>
                        </div>
                        `
}

nounoursChoisi();
