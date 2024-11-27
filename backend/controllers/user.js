const bcrypt = require("bcrypt");
const User = require("../models/User");

//crypte le mdp avec hash et crée un nv user avec ces infos -> enregistre dans la bdd 
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User ({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.statut(201).json({message: "Utilisateur créé" }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// verifie paire user/mdp 
exports.login = (req, res, next) => {
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
                        token: 'TOKEN'
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error })); // erreur d'execution de la req ds la bdd, pas si l'utilisateur n'est pas trouvé ds la bdd 
 }; 

