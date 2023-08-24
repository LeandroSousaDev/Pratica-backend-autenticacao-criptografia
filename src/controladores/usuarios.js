const poll = require('../conexao')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const senhasegura = require('../senha')



const cadastraUsuario = async (req, res) => {
    const { nome, email, senha } = req.body

    try {
        const senhatCrypt = await bcrypt.hash(senha, 10)

        const novoUsuario = await poll.query(
            'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *',
            [nome, email, senhatCrypt]
        )

        return res.status(201).json(novoUsuario.rows[0])

    } catch (error) {
        return res.status(500).json('Erro interno do servidor')
    }
}

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body

    try {
        const usuarios = await poll.query(
            'select * from usuarios where email = $1',
            [email]
        )

        if (usuarios.rowCount < 1) {
            return res.status(404).json('email ou senha invalido')
        }

        const verificaSenha = await bcrypt.compare(senha, usuarios.rows[0].senha)

        if (!verificaSenha) {
            return res.status(404).json('email ou senha invalido')
        }

        const token = jwt.sign({ id: usuarios.rows[0].id }, senhasegura, { expiresIn: '8h' })

        const { senha: _, ...dadosUsuario } = usuarios.rows[0]

        return res.json({ dadosUsuario, token })

    } catch (error) {
        console.log(error)
        return res.status(500).json('Erro interno do servidor')
    }
}


module.exports = {
    cadastraUsuario,
    loginUsuario,
    senhasegura
}