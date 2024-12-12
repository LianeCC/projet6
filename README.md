# Mon vieux Grimoire
### Site de notation de livres par les utilisateurs (inscrits) - Serveur Express avec Node.js et MongoDB

## Prérequis

- Node.js (version >= v22.11.0)
- MongoDB Atlas (créez un compte et une base de données- cluster puis collection)

## Comment lancer le projet ?

1. Clonez ce dépôt :  
   `git clone https://github.com/LianeCC/projet6.git`

2. Allez dans le répertoire du projet :  
   `cd backend`

3. Installez les dépendances via npm :  
   `npm install`

4. Ajoutez à la racine du dossier **backend** et configurez votre fichier `.env` (le fichier `.env-dis` est un exemple). Remplacez les valeurs par vos informations spécifiques, telles que l'URL de votre base MongoDB Atlas et un secret pour les tokens JWT.

5. Lancez le projet en mode développement :  
   `npm run dev`  
   Cela lance le serveur backend et le frontend en mode développement.


## Exemples de tests fonctionnels (Postman)

1. **POST /api/auth/signup** : Inscription d'un utilisateur  
    - **Exemple** : `http://localhost:4000/api/auth/signup`  
    - **Body** (raw) : 
     ```json
     {
       "email" : "votre@email.com",
       "password" : "votre_mdp"
     }
     ```

2. **POST /api/auth/login** : Connexion de l' utilisateur
    - **Exemple** : `http://localhost:4000/api/auth/login`    
    - **Body** (raw) : 
     ```json
     {
       "email" : "votre@email.com",
       "password" : "votre_mdp"
     }
     ```
    - **Réponse du serveur** : 
    ```json
    {
        "userId": "0000000000000",
        "token": "votre_token"
    }
    ```


3. **POST /api/books** : Ajouter un livre    
    - **Exemple** : `http://localhost:4000/api/books`  
    - **Headers** : `Authorization: Bearer votre_token`
    - **Body** (form-data) : 
        key :
        "book (text)" : "value" : "{
                            "title": "Les Misérables",
                            "author": "Victor Hugo",
                            "year" : "1862",
                            "genre" : "Roman", 
                            "rating" : "5" 
                        }"
        "image (file)" : "value" : "votreimage.png"
     

4. **GET /api/books/{id}** : Obtenez les informations du livre ajouté à partir de son ID  
    - **Exemple** : `http://localhost:4000/api/books/6740c6195361b767c620e54d`  
    - **Headers** : `Authorization: Bearer votre_token`


5. **DELETE /api/books/{id}** : Supprimer le livre que l'utilisateur a créé  
    - **Exemple** : `http://localhost:4000/api/books/6740c6195361b767c620e54d`  
    - **Headers** : `Authorization: Bearer votre_token`
