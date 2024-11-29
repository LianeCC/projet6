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

// simule delai de 2s 
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// verifie paire user/mdp 
exports.login = (req, res, next) => {
    delay(2000)
        .then(() => {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
                }
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                        }
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                { userId: user._id },
                                "RANDOM_TOKEN_SECRET",
                                { expiresIn: "24h" }
                            )
                        });
                    })
                    .catch(error => {                    
                        res.status(500).json({ error });
                    });
            })
            .catch(error => { res.status(500).json({ error }) }); // erreur d'execution de la req ds la bdd, pas si l'utilisateur n'est pas trouvé ds la bdd    
    })
    .catch(error => { res.status(500).json({ error })});
}; 

