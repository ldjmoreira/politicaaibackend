module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation
    const index = (req, res) => {


        app.db('politicos')
            .select('id', 'name', 'partido')
            .where('user_id', req.user.id)
            .then(politicos => res.json(politicos))
            .catch(err => res.status(500).send(err))
    }

    const create = (req, res) => {
        const politico = { ...req.body }
        politico.user_id = req.user.id
        try {
            
            existsOrError(politico.name, 'Nome não informado')
            existsOrError(politico.partido, 'Descrição não informada')

        } catch(msg) {
            res.status(400).send(msg)
        }
        if(politico.name) {
            app.db('politicos')
                .insert(politico)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } 
    }

    const edit = (req, res) => {
            app.db('politicos')
                .where({ id: req.params.id })
                .first()
                .then(politicos => res.json(politicos))
                .catch(err => res.status(500).send(err))
    }

    const update = (req, res) => {
        const politico = { ...req.body }
        politico.user_id = req.user.id
        if(req.params.id) politico.id = req.params.id

        try {
            existsOrError(politico.name, 'Nome não informado')
            existsOrError(politico.partido, 'Descrição não informada')

        } catch(msg) {
            res.status(400).send(msg)
        }


        if(politico.id) {
            app.db('politicos')
                .update(politico)
                .where({ id: politico.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            console.log("error! em politico line 56")
        }


    }

    const remove = async (req, res) => {
        const politico = { ...req.body }
        if(req.params.id) { politico.id = req.params.id}
        else {throw "Erro na requisição"}


        
        try {
            
            const temReclamacao = await app.db('reclamacaos')
            .where({ politico_id: req.params.id })
            notExistsOrError(temReclamacao, 'O politico possui reclamações')


            const userExcluded = await app.db('politicos')
                .where({ id: req.params.id }).del()
           // notExistsOrError(userExcluded, 'não foi possivel excluir.')
            
            
            res.status(204).send()
        } catch(msg) {
            console.log(msg)
            res.status(408).send(msg)
        }
    }

    return {remove, update, index, edit, create,   }


    //fim
}