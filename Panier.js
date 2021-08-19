// Préparation variables

let mesNounours = [];

// Fonction Récupération des données du panier dans un objet 

async function panierNounours(){
    mesNounours = JSON.parse(localStorage.getItem("panier"));
}

// Fonction Injection des produits dans la grille + affichage panier vide

async function grilleProduits() {
    let textGrille = "";
    let destinationGrille = document.getElementById("grille__produits");

    await panierNounours();

    if(mesNounours != null){
        mesNounours.forEach(nounours => (
            textGrille += 
            `
            <div class="grille__conteneurcarte">
                <img class="grille__miniature" src="${nounours.imageUrl}"></img>
                <p class="grille__nomArticle"> ${nounours.name}</p>
                <p class="grille__prixArticle"> <strong>${nounours.price} €</strong> </p>
                <i class="fas fa-trash-alt bouton__poubelle"></i>
            </div>
            `
        ))
        destinationGrille.innerHTML = textGrille;

        // Calcul du prix total

        let prixTotal = 0;
        for(let nounours of mesNounours){
            prixTotal += nounours.price;
        }

        // Injection du prix total

        let textPrix = 
        `
        <div class="conteneur__prix">
            <p><strong>Prix total :<strong></p>
            <P><strong>${prixTotal} €<strong></p>
        </div>
        `
        destinationGrille.innerHTML += textPrix;

        // Ajout eventlistener sur la poubelle

        let mesPoubelles = document.getElementsByClassName("bouton__poubelle");
        for(let i=0; i<mesPoubelles.length; i++){
            mesPoubelles[i].addEventListener("click",function(){
                mesNounours.splice(i,1);
                localStorage.setItem("panier", JSON.stringify(mesNounours));
                location.reload();
            })
        }

    } else {
        destinationGrille.innerHTML =
        `
        <div id="panier__grille--vide"> 
            <p>Il n' y a actuellement aucun produit dans votre panier.</p>
            </br>
            <i class="far fa-frown"></i>
        </div>
        `
        console.log("test panier vide")
    }
}

grilleProduits();
