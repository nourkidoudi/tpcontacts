// Charger les contacts au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    
    // Gérer la soumission du formulaire
    document.getElementById('contactForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nom = document.getElementById('nom').value;
        const email = document.getElementById('email').value;
        
        try {
            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nom, email })
            });
            
            if (response.ok) {
                document.getElementById('contactForm').reset();
                loadContacts();
            } else {
                alert('Erreur lors de l\'ajout du contact');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur de connexion au serveur');
        }
    });
});

// Fonction pour charger les contacts
async function loadContacts() {
    const contactsList = document.getElementById('contactsList');
    
    try {
        const response = await fetch('/api/contacts');
        const contacts = await response.json();
        
        if (contacts.length === 0) {
            contactsList.innerHTML = '<p class="empty">Aucun contact enregistré</p>';
            return;
        }
        
        contactsList.innerHTML = contacts.map(contact => `
            <div class="contact-card">
                <div class="contact-info">
                    <h3>${escapeHtml(contact.nom)}</h3>
                    <p>${escapeHtml(contact.email)}</p>
                </div>
                <button class="delete-btn" onclick="deleteContact(${contact.id})">Supprimer</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erreur:', error);
        contactsList.innerHTML = '<p class="error">Erreur de chargement des contacts</p>';
    }
}

// Fonction pour supprimer un contact
async function deleteContact(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/contacts/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadContacts();
        } else {
            alert('Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur');
    }
}

// Fonction pour échapper les caractères HTML (sécurité)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

