// Préparation variables

let mesNounours = [];
let prixTotal;

// Fonction Récupération des données du panier dans un objet 

async function panierNounours(){
    mesNounours = JSON.parse(localStorage.getItem("panier"));
}

// Fonction Injection des produits dans la grille + affichage panier vide

async function grilleProduits() {
    let textGrille = "";
    let destinationGrille = document.getElementById("grille__produits");

    await panierNounours();

    if(mesNounours == null || mesNounours.length == 0){
    destinationGrille.innerHTML =
        `
        <div id="panier__grille--vide"> 
            <p>Il n' y a actuellement aucun produit dans votre panier.</p>
            </br>
            <i class="far fa-frown"></i>
        </div>
        `
    
    } else {
        mesNounours.forEach(nounours => (
            textGrille += 
            `
            <div class="grille__conteneurcarte">
                <img class="grille__miniature" src="${nounours.imageUrl}"></img>
                <p class="grille__nomArticle"> ${nounours.name}</p>
                <p class="grille__prixArticle"> <strong>${(nounours.price/100).toFixed(2)} €</strong> </p>
                <i class="fas fa-trash-alt bouton__poubelle"></i>
            </div>
            `
        ))
        destinationGrille.innerHTML = textGrille;

        // Calcul du prix total

        prixTotal = 0;
        for(let nounours of mesNounours){
            prixTotal += nounours.price;
        }

        // Injection du prix total

        let textPrix = 
        `
        <div class="conteneur__prix">
            <p><strong>Prix total :<strong></p>
            <P><strong>${(prixTotal/100).toFixed(2)} €<strong></p>
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
    }
    
    // Ajout de l'event listener fonction au bouton
    document.getElementById("validationButton").addEventListener("click", envoi)
} 

grilleProduits();

//-----------------------------------------------------------------------------------------
// Vérification et envoi de la commande
//------------------------------------------------------------------------------------------

let monForm = []; // on initialise l'objet commande
let conForm; // boolen pour vérification des champs
let fullForm; // boolen pour complétion du formulaire
let existingCart; // boolen pour existence d'un panier

let messagesErreur = ""; // On prépare un message d'erreur
let retourBack = []; //on prépare l'objet qui prendra le retour serveur


const envoi = (comm) => { 

    comm.preventDefault(); // Pas d'envoi du formulaire

    monForm = Array.from(document.querySelectorAll("fieldset input")).reduce((acc, input) => ({...acc,[input.id]: input.value}),{}); // on déverse les champs directement dans l'objet (plutôt cool)

    checkForm(); // On vérifie les données saisies
    checkCompl(); // On vérifie que tous les champs sont remplis
    checkPanier(); // On vérifie que le panier pour ne pas envoyer de form vide

    if(conForm ==true && fullForm == true && existingCart ==true){
        creationCommande();
    } else {
        document.getElementById("Erreur").innerText = messagesErreur;
    }

}

// Fonction de vérification des données de formulaire

const checkForm = () => {

    // Préparation des regex
    const lettresChecker = /[a-zA-Z-çéè]/ ;
    const chiffresChecker = /[0-9]/ ;
    const caractChecker = /[$&+,:;=?@#|'<>.^*()%!-]/;
    const emailChecker = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    // Préparation des booléens
    let prenomChecked;
    let nomChecked;
    let addressChecked;
    let villeChecked;
    let emailChecked;

    // Contrôle champ par champ

    if (lettresChecker.test(monForm.firstName) == true && chiffresChecker.test(monForm.firstName) == false && caractChecker.test(monForm.firstName) == false ){
        prenomChecked = true; 
    } else {
        messagesErreur = "Votre prénom ne peut contenir que des lettres"
    }

    if (lettresChecker.test(monForm.lastName) == true && chiffresChecker.test(monForm.lastName) == false && caractChecker.test(monForm.lastName) == false ){
        nomChecked = true; 
    } else {
        messagesErreur = "Votre nom ne peut contenir que des lettres"
    }

    if (lettresChecker.test(monForm.address) == true){
        addressChecked = true; 
    } else {
        messagesErreur = "Votre adresse doit être complète"
    }

    if (lettresChecker.test(monForm.city) == true && chiffresChecker.test(monForm.city) == false && caractChecker.test(monForm.city) == false ){
        villeChecked = true; 
    } else {
        messagesErreur = "Votre ville ne peut contenir que des lettres"
    }

    if (emailChecker.test(monForm.email) == true){
        emailChecked = true; 
    } else {
        messagesErreur = "Votre email doit être conforme"
    }

    // Rassemblement des validation dans une seule variable (plus lisible plus haut)

    if(prenomChecked == true && nomChecked == true && addressChecked == true && villeChecked == true && emailChecked == true){
        conForm = true;
    }
}

// Fonction vérification formulaire vide

const checkCompl = () => {
    if (monForm.firstName == 0 || monForm.lastName == 0 || monForm.address == 0 || monForm.city == 0 || monForm.email == 0){
        messagesErreur = "Veuillez renseigner tous les champs du formulaire";
    } else {
        fullForm = true;
    }
}

// Fonction de vérification du panier pour envoi formulaire (petit garde-fou)

const checkPanier = () => {
    if(mesNounours == null || mesNounours.length == 0){
        messagesErreur = "Votre panier est vide";
    } else {
        existingCart = true;
    }
}

//-----------------------------------------------------------------------------------------
// fonction envoi requête POST
//-----------------------------------------------------------------------------------------

async function creationCommande(){
    
    // Préparation de l'objet à envoyer (dataRequete)
    let contact = {};
    let products = [];

    contact = monForm;
    
    mesNounours.forEach(nounours => (
        products.push(nounours._id)
    ))

    let dataRequete = {
        contact,
        products
    }

    // Envoi de la requête, vidage localStorage et ajout résultat

    let retourBack = await fetch("http://localhost:3000/api/teddies/order", {
        method: 'POST',
        headers :{
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(dataRequete), 
    })
        .then((res) => res.json())
        .then(localStorage.clear())
        .catch(console.error("Erreur de requête au back-end"))

        
        
    localStorage.setItem("confirmation", JSON.stringify(retourBack))
    localStorage.setItem("prixTotal", JSON.stringify(prixTotal))

    // Redirection vers la confirmation

    window.location.pathname = "./confirmation.html"

};
