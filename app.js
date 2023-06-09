const { log } = require("console");
const express = require("express");
const app = express();
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const admin = require("./routes/admin")
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
require("./models/postagem")
const Postagem = mongoose.model("postagens")
require("./models/categorias")
const Categoria = mongoose.model("categorias")
const usuarios = require("./routes/usuario");
const passport = require("passport");
require("./config/auth")(passport)
const db = require("./config/db")

//sesssão
app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true

}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())



//middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next()
})

// Template Engine 
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

/// BODY PARSER
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//mongoose
mongoose.Promise = global.Promise

mongoose.connect(db.mongoURI).then(() => {
    console.log("conectado ao mongooo")
}).catch((err) => {
    console.log("erro ao se conectar" + err)
})

//public

app.use(express.static(path.join(__dirname, "public")))

app.use((req, res, next) => {
    console.log("oi eu sou um middleware")
    next()
})

app.get("/", (req, res) => {
    Postagem.find().lean().populate("categoria").sort({ data: "desc" }).then((postagens) => {
        res.render("index", { postagens: postagens })
    }).catch((err) => {
        req.flash("error_msg", "houve um erro interno")
        res.redirect("/404")
    })
})

app.get("/postagem/:slug", (req, res) => {

    Postagem.findOne({ slug: req.params.slug }).lean().then((postagem) => {
        if (postagem) {
            res.render("postagem/", { postagem: postagem })
        } else {
            req.flash("error_msg", "vai se fude")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "houve um erro interno")
    })
})

app.get("/categorias", (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("./categorias/index", { categorias: categorias })
    }).catch((err) => {
        req.flash("error_msg", "houve um erro interno")
        res.redirect("/")
    })
})

app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({ slug: req.params.slug }).lean().then((categoria) => {
        if (categoria) {
            Postagem.find({ categoria: categoria._id}).lean().then((postagens) => {
   
                res.render("./categorias/postagens", { postagens: postagens, categoria: categoria})
            
}).catch((err) => {
                req.flash("error_msg", "houve um erro sadsadasdsadasd")
            res.redirect("/")
            })
        } else {
            req.flash("error_msg", "Esta categoria")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "houve um erro intdfgfdgfdgdferno")
        res.redirect("/")
    })
})

app.get("/404", (req, res) => {
    res.send("erro 404")
})
//Rotas
app.use("/admin", admin)

app.use("/usuarios", usuarios)

const PORT = process.env.PORT || 8081
app.listen(PORT , function () {
    console.log("Servidor rodando na porta 8081")
});
