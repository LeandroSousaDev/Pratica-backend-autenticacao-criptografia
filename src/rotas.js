const express = require('express')
const { loginUsuario, cadastraUsuario } = require('./controladores/usuarios')
const { cadastraPokemon, detalhaPokemon, listarPokemon, excluirPokemon } = require('./controladores/pokemons')
const verificaUsuario = require('./intermediario/autenticacao')

const rotas = express()

rotas.post('/cadastra', cadastraUsuario)
rotas.post('/login', loginUsuario)

rotas.use(verificaUsuario)

rotas.get('/listaPokemons', listarPokemon)
rotas.get('/getpokemon/:id', detalhaPokemon)
rotas.post('/cadastraPokemon', cadastraPokemon)
rotas.delete('/excuirPokemon/:id', excluirPokemon)

module.exports = rotas