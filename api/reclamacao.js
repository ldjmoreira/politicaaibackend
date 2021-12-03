module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation
    const limit = 3 // usado para paginação
    const index = async (req, res) => {

        const page = req.query.page || 1
        //ver se precisa
        const result = await app.db('reclamacaos').count('id as a').first()//tem q tratar
        const count = parseInt(result.a)
        
        app.db('reclamacaos')
        .join('politicos','reclamacaos.politico_id', '=', 'politicos.id')
        .select('reclamacaos.id', 'reclamacaos.titulo','reclamacaos.area','politicos.name', 'reclamacaos.datap')
        .where({'reclamacaos.user_id': req.user.id})
        .limit(limit).offset(page * limit - limit)
        .then(reclamacao => res.json({ data: reclamacao, count, limit }))
        .catch(err => res.status(500).send(err))
    }

    const create = (req, res) => {

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        
        today = yyyy + '/' + mm + '/' + dd;


        const reclamacao = { ...req.body }
        reclamacao.datap = today
        reclamacao.user_id = req.user.id
        console.log(reclamacao)
        try {
            existsOrError(reclamacao.titulo, 'titulo não informado')
            existsOrError(reclamacao.area, 'Area não informada')
            existsOrError(reclamacao.politico_id, 'politico não informado')
            existsOrError(reclamacao.descricao, 'Descrição não informada')
            
            //existsOrError(reclamacao.datap, 'Descrição não informada')
            existsOrError(reclamacao.texto, 'texto não informada')

        } catch(msg) {
            res.status(400).send(msg)
        }
        if(reclamacao.area) {
            app.db('reclamacaos')
                .insert(reclamacao)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } 
    }

    const edit = (req, res) => {
            app.db('reclamacaos')
                .where({ id: req.params.id })
                .first()
                .then(reclamacaos => res.json(reclamacaos))
                .catch(err => res.status(500).send(err))
    }

    const adicionar = (req, res) => {
        app.db('politicos')
            .select('id', 'name')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const show = (req, res) => {
        app.db('reclamacaos')
            .innerJoin('politicos', 'reclamacaos.politico_id', '=', 'politicos.id')
            .whereRaw('reclamacaos.id = ?', [req.params.id])
            
            .then(reclamacaos => res.json(reclamacaos))
            .catch(err => res.status(500).send(err))
}

    const update = (req, res) => {
        //const reclamacao = { ...req.body }

        const reclamacao = {
            id: req.body.id,
            titulo: req.body.titulo,
            area: req.body.area,
            politico_id: req.body.politico_id,
            descricao: req.body.descricao,
            thumblink: req.body.thumblink,
            texto: req.body.texto

        }

        if(req.params.id) reclamacao.id = req.params.id

        try {
            existsOrError(reclamacao.titulo, 'titulo não informado')
            existsOrError(reclamacao.area, 'Area não informada')
            existsOrError(reclamacao.politico_id, 'politico não informado')
            existsOrError(reclamacao.descricao, 'Descrição não informada')
            existsOrError(reclamacao.thumblink, 'thumblink não informada')
            existsOrError(reclamacao.texto, 'Texto não informada')

        } catch(msg) {
            res.status(400).send(msg)
        }


        if(reclamacao.id) {
            app.db('reclamacaos')
                .update(reclamacao)
                .where({ id: reclamacao.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
                
        } else {
        console.log("error! em reclamacao line 56")
        }
    }

    const remove = async (req, res) => {
        const reclamacao = { ...req.body }
        if(req.params.id) { reclamacao.id = req.params.id}
        else {throw "Erro na requisição"}

        try {
         /*   
            const temReclamacao = await app.db('reclamacaos')
            .where({ politico_id: req.params.id })
            notExistsOrError(temReclamacao, 'O politico possui reclamações')
        */

            const userExcluded = await app.db('reclamacaos')
                .where({ id: req.params.id }).del()
           // notExistsOrError(userExcluded, 'não foi possivel excluir.')
            
            
            res.status(204).send()
        } catch(msg) {
            console.log(msg)
            res.status(408).send(msg)
        }
    }



    return { index, create, edit, update, show, adicionar, remove }


    //fim
}