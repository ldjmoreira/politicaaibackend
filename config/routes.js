const admin = require('./admin')

module.exports = app => {
    app.post('/login', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)
    app.post('/signup', app.api.auth.save)

    app.route('/admin/index',app)
    .all(app.config.passport.authenticate())

    //---------------------------------------politico
    app.route('/politico/index')
    .all(app.config.passport.authenticate())
    .get(admin(app.api.politico.index))

    //'politico/adcionar'

    app.route('/politico/create')
    .all(app.config.passport.authenticate())
    .post(admin(app.api.politico.create))

    app.route('/politico/update/:id')
    .all(app.config.passport.authenticate())
    .put(admin(app.api.politico.update))
    

    app.route('/politico/:id/edit')
    .all(app.config.passport.authenticate())
    .get(admin(app.api.politico.edit))

    app.route('/politico/delete/:id')
    .all(app.config.passport.authenticate())
    .delete(admin(app.api.politico.remove))

    //-------------------------------------reclamacao
    app.route('/reclamacao/index')
    .all(app.config.passport.authenticate())
    .get(app.api.reclamacao.index)

    app.route('/reclamacao/adicionar')
    .all(app.config.passport.authenticate())
    .get(app.api.reclamacao.adicionar)

    //'reclamacao/adicionar'

    app.route('/reclamacao/create')
    .all(app.config.passport.authenticate())
    .post(app.api.reclamacao.create)

    app.route('/reclamacao/delete/:id')
    .all(app.config.passport.authenticate())
    .delete(app.api.reclamacao.remove)

    app.route('/reclamacao/update/:id')
    .all(app.config.passport.authenticate())
    .put(app.api.reclamacao.update)

    app.route('/reclamacao/:id/edit')
    .all(app.config.passport.authenticate())
    .get(app.api.reclamacao.edit)
    
    app.route('/reclamacao/:id/show')
    .all(app.config.passport.authenticate())
    .get(app.api.reclamacao.show)

    //-------------------------------------Sobre
//'sobre/index'

}