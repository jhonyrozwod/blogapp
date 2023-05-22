const jwt = require('jsonwebtoken');

module.exports = {
    eAdmin: function (req, res, next) {
            
        if(req.isAuthenticated() && req.user.eAdmin == 1) {
            return next();
        }
        req.flash("error_msg", "You are not authorized")
        res.redirect("/");
    },

    isAdmin: function verifyToken(req, res, next) {
        const token = req.body.Authorization

        //if (!token) {
          //return res.status(401).send('Token não fornecido');
        //}
      
        jwt.verify(token, 'cursodenode', (err, user) => {
          //if (err) {
            //return res.status(401).send('Token inválido');
          //}
      
          // Adicione o objeto decoded ao objeto de solicitação para uso posterior
          res.locals.user = token.user;
      
          // Chame o próximo middleware ou rota
          next();
        });
      }

    

}