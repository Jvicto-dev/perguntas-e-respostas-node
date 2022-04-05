const Sequelize = require('sequelize')
const connection = require('./database')

const Pergunta = connection.define('pergunta', {
    // campos da tabela
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
}, {});

/**
 * Sincroniza com o banco de dados 
 * e não força a criação de uma nova tabela 
 * no banco de dados caso já exista 
 */
Pergunta.sync({ force: false }).then(() => { })
module.exports = Pergunta;
