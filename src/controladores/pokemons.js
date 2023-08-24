const pool = require('../conexao')

const cadastraPokemon = async (req, res) => {
    const { nome, habilidades, imagem } = req.body

    const usuario = req.usuario.id

    try {
        const { rows } = await pool.query(
            'insert into pokemons ( usuario_id, nome, habilidades, imagem) values ($1, $2, $3, $4) returning *',
            [usuario, nome, habilidades, imagem]
        )

        return res.status(201).json(rows[0])
    } catch (error) {
        console.log(error)
        console.log(usuario)
        return res.status(500).json('Erro interno do servidor')
    }
}

const listarPokemon = async (req, res) => {

    try {
        const { rows } = await pool.query('select * from pokemons')

        return res.json(rows)
    } catch (error) {
        return res.status(500).json('Erro interno do servidor')
    }
}

const detalhaPokemon = async (req, res) => {
    const { id } = req.params

    try {
        const { rows, rowCount } = await pool.query(
            'select * from pokemons where id = $1',
            [id]
        )

        if (rowCount < 1) {
            return res.status(404).json({ mensagem: 'Pokemon não encontrado' })
        }

        return res.json(rows[0])
    } catch (error) {
        return res.status(500).json('Erro interno do servidor')
    }
}

const excluirPokemon = async (req, res) => {
    const { id } = req.params

    try {
        const { rowCount } = await pool.query(
            'select * from pokemons where id = $1',
            [id]
        )

        if (rowCount < 1) {
            return res.status(404).json('pokemon não encontrado')
        }

        await pool.query('delete from pokemons where id = $1', [id])

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json('Erro interno do servidor')
    }
}

module.exports = {
    cadastraPokemon,
    listarPokemon,
    detalhaPokemon,
    excluirPokemon
}