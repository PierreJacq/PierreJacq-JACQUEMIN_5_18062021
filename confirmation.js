// Récupération des données

let prixFinal = JSON.parse(localStorage.getItem("prixTotal"));
let infosCommande = JSON.parse(localStorage.getItem("confirmation"));

// Injection du message final

let texteConfirmation ="";

texteConfirmation = 
    `
    <p>Merci <strong>${infosCommande.contact.firstName}</strong> !</p>
    
    <p>Votre commande d'un montant total de <strong>${(prixFinal/100).toFixed(2)} €</strong> est bien prise en compte.
    </br>Le numéro de votre commande est le <strong>${infosCommande.orderId}</strong>.</p>
    `;

document.getElementById("conteneur--confirmation").innerHTML = texteConfirmation;

console.log("Bravo, ça s'est bien passé")