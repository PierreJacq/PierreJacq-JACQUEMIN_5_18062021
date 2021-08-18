// FICHE PRODUIT - fonction d'extraction de l'ID dans l'URL 

async function idExtract(){
        const urlParams = new URLSearchParams(window.location.search);
        const identifiant = urlParams.get('id');
        //console.log(identifiant);
        return identifiant;
}

// FICHE PRODUIT - Query qui retourne le bon produit

async function queryNounours() {
        const idProduit = await idExtract()
        const arrayProduit = await fetch(`http://localhost:3000/api/teddies/${idProduit}`)
        .then((res) => res.json())
        //console.log(arrayProduit);
        return arrayProduit;
};

// FICHE PRODUIT - Fonction injection du résultat

async function nounoursChoisi(){
        const pageProduit = document.getElementById("page__produit");
        ficheproduit = await queryNounours();
        
        pageProduit.innerHTML =
                `<img class="produit__img" src="${ficheproduit.imageUrl}"></img>
                        <div class="produit__contDroit">

                                <div class="produit__infos">
                                        <h1 class="infos__titre">${ficheproduit.name}</h1>
                                        <p class="infos__prix">${ficheproduit.price}€</p>
                                        <p class="infos__description"><strong>Description :</strong> ${ficheproduit.description}</p>             
                                </div>

                                <div class="produit__color">
                                        <p>Choisissez la couleur :</p>
                                        <select id="produit__perso">
                                        </select>
                                </div>

                                <div class="produit__panier">
                                        <div class="produit__quantités">
                                                <i class="fas fa-caret-left" id="negatif"></i>
                                                <div id="produit__chiffre">1</div>
                                                <i class="fas fa-caret-right" id="positif"></i>
                                        </div>
                                        <button id="bouton__panier">Ajout au panier</button>
                                </div>
                        </div>
                        `
        
        // Personalisation de la couleur
        ficheproduit.colors.forEach(function(color){
                let optionColor = document.createElement("option");
                document.getElementById("produit__perso").appendChild(optionColor).innerHTML = color
        })

        // Ajout de l'incrémental des quantités avec les flèches

        document.getElementById("positif").addEventListener("click",function(){
                ++quantiteNounours;
                document.getElementById("produit__chiffre").innerText = quantiteNounours;
        })
        document.getElementById("negatif").addEventListener("click",function(){
                if(quantiteNounours == 1){
                        quantiteNounours = 1;
                } else {
                --quantiteNounours;
                document.getElementById("produit__chiffre").innerText = quantiteNounours;
                }
        })

        // Ajout des produits au localStorage

        let quantiteNounours = 1;
        let panierProduits =[];

        document.getElementById("bouton__panier").addEventListener("click",function(){
                for(i=0; i<quantiteNounours; i++){
                        panierProduits.push(ficheproduit);                      
                }
                localStorage.setItem("panier", JSON.stringify(panierProduits) )                
        })
}

nounoursChoisi();


