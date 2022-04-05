const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const connection = require('./database/database')

// Meus models 
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')
const banana = require('./database/Pessoas')

// Teste de conexão
connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com o banco de dados !')
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })

// estou dizendo ao express usar o EJS como view engine
app.set('view engine', 'ejs');

// para eu usar meu css e js 
app.use(express.static('public'));

// Para permitir o uso dos dados do formulario
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());











// Minhas rotas
app.get('/', (req, res) => {
    /**
     * Chamo meu model "Pergunta",
     * e passo a renderizar minha view como resposta 
     * do meu then e passo o array 
     * 
     * 
     *  */  
    Pergunta.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then((perguntas) => {

        res.render('index', {
            perguntas: perguntas
        })

    })
})

app.get('/perguntar', (req, res) => {
    res.render('perguntar')
})

app.post('/salvarpergunta', (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Pergunta.create({
        titulo: req.body.titulo,
        descricao: req.body.descricao
    }).then(() => {
        res.redirect('/');
    })
})




app.get('/pergunta/:id', (req, res) => {
    var meuId = req.params.id
    Pergunta.findOne({
        where: {
            id: meuId
        }
    }).then((pergunta) => {
        if (pergunta != undefined) {
            Resposta.findAll({
                where: { perguntaId: pergunta.id },
                order: [['id', 'DESC']]
            }).then((respostas) => {
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
        } else {
            res.redirect('/')
        }
    })
})

app.post('/responder', (req, res) => {
    var corpo = req.body.corpo
    var id_pergunta = req.body.idpergunta

    Resposta.create({
        corpo: corpo,
        perguntaId: id_pergunta
    }).then(() => {
        res.redirect('/pergunta/' + id_pergunta)
    })

})


app.get('/pessoas/', (req, res) => {
    banana.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then((pessoas) => {
        res.render('pessoas', {
            pessoas: pessoas
        })
    })
})

// Rodar o servidor
app.listen(3000, () => {
    console.log('App rodando...')
})