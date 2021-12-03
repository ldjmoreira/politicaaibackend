const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation
    const { getDate } = app.api.date_utils

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }



    const signin = async (req, res) => {
        
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Informe usuário e senha!')
        }
        console.log(req.body)
        const user = await app.db('users')
        .where({ email: req.body.email })
        .first()
        console.log(req.body)
        if (!user) return res.status(400).send('Usuário não encontrado!')
        
        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        console.log(isMatch)
        console.log("ola")
        if (!isMatch) return res.status(401).send('Email/Senha inválidos!')

        const now = Math.floor(Date.now() / 1000)

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.is_admin,
            iat: now,
            exp: now + (60 * 60 * 24 * 3) //tempo para terminar a seção em segundos
        }
        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })

    }

    const validateToken = async (req, res) => {


        const userData = req.body || null
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch(e) {
            // problema com o token
        }

        res.send(false)
    }

    const save = async (req, res) => {
        
        //vem req.user leonardo leitao //logado, vem do payload
        //vem req.body no corpo {email: e password} vem do corpo
        const user = { ...req.body }
        
        user.start_date = getDate()
        


        if(!req.originalUrl.startsWith('/users')) user.is_admin = true
        //console.log(user)
        
        try {
            /*
            existsOrError(user.nome, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, user.confirmPassword,
                'Senhas não conferem')
            */
            const userFromDB = await app.db('users')
                .where({ email: user.email }).first()
                
            if(!user.id) {
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }
        } catch(msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword
        console.log(user)
        if(user.id) {
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .whereNull('deletedAt')
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

 




    return { signin, validateToken, save }



}