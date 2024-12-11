const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

//crypte le mdp avec hash et crée un nv user avec ces infos -> enregistre dans la bdd 
exports.signUp = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash, 
            });-
            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur créé" }))
                .catch(error => {
                    res.status(400).json({ error });
                });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};


/// simule délai de 2s 
const delay = (min, max) => {
    const randomMs = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, randomMs));
};

exports.login = (req, res, next) => {
    console.log("email reçu : ", req.body.email);
    
    // Recherche de l'utilisateur dans la base de données
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                console.log("Utilisateur introuvable.");

                // Applique un délai de 2 secondes avant de renvoyer l'erreur
                delay(1500, 2000)
                    .then(() => {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    })
                    .catch(error => { 
                        res.status(500).json({ error });
                    });
                return; // Arrêter si utilisateur introuvable
            }

            // Si utilisateur trouvé alors verification du mdp 
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        console.log("Mot de passe incorrect.");

                        // délai de sécurité si mdp incorrect
                        delay(1500, 2000)
                            .then(() => {
                                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                            })
                            .catch(error => { 
                                res.status(500).json({ error });
                            });
                        return; // Arrêter si mdp incorrect 
                    }

                    console.log("Connexion réussie pour l'utilisateur :", user._id);
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            "Pix08-45-Boulbi-94boulga",
                            { expiresIn: "24h" }
                        )
                    });
                })
                .catch(error => { 
                    console.error("Erreur bcrypt :", error);
                    res.status(500).json({ error });
                });
        })
        .catch(error => {
            console.error("Erreur lors de la recherche d'utilisateur :", error);
            res.status(500).json({ error });
        });
};