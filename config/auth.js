const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');


// model usuario

require("../models/usuario")
const Usuario = mongoose.model("usuarios")


module.exports = function (passport) {

    passport.use(new localStrategy({ usernameField: "email", passwordField:"senha" }, (email, senha, done) => {

        Usuario.findOne({ email: email }).lean().then((usuario) => {
            if (!usuario) {
                return done(null, false, { message: "Usuário não encontrado" })
            }   
            bcrypt.compare(senha, usuario.senha, (erro, batem) => {
            if (batem) {
                    return done(null, usuario)
                } else {
                    return done(null, false, { message: "Senha incorreta" })
                }
            })
        })
    }))
    passport.serializeUser((usuario, done) => {
        done(null, usuario._id)
    })

    passport.deserializeUser((id,done)=>{
        Usuario.findById(id).then((usuario)=>{
           return done(null,usuario)
        }).catch((err)=>{
            return done (null,false,{message:'algo deu errado'})
        })
    
    
    })
}