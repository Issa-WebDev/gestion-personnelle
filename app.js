const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();

// Configuration de Passport
require("./config/passport")(passport);

// Configuration de la base de données
const db = require("./config/keys").mongoURI;

// Connexion à MongoDB
mongoose
    .connect(db)
    .then(() => console.log("MongoDB Connected")) // Message de confirmation si la connexion réussit
    .catch((err) => console.log(err)); // Affiche une erreur si la connexion échoue

// Définir le moteur de rendu EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Définir le répertoire des vues

// Middleware pour parser les données des formulaires
app.use(express.urlencoded({ extended: false }));

// Configuration de la session Express
app.use(
    session({
        secret: "secret", // Clé secrète pour signer la session
        resave: true, // Forcer la sauvegarde de la session même si elle n'a pas été modifiée
        saveUninitialized: true, // Sauvegarder une session non initialisée
    })
);

// Middleware Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware pour les messages flash
app.use(flash());

// Variables globales pour les messages flash
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg"); // Message de succès
    res.locals.error_msg = req.flash("error_msg"); // Message d'erreur
    res.locals.error = req.flash("error"); // Erreur générale
    next();
});

// Définir les routes
app.use("/", require("./routes/index.js")); // Route pour la page d'accueil
app.use("/users", require("./routes/users.js")); // Routes pour la gestion des utilisateurs
app.use("/personnel", require("./routes/personnel")); // Routes pour la gestion du personnel

// Définir le port et démarrer le serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`)); // Message de confirmation lorsque le serveur démarre
