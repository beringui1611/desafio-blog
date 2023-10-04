const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const session = require('express-session')

const CategoryController = require('./categories/CategoryController')
const ArticleController = require('./articles/ArticleController')
const UserController = require('./user/UserController')


const Article = require('./articles/Article')
const Category = require('./categories/Category')






app.set('view engine', 'ejs')
app.use(express.static('public'))


//Sessões
app.use(session({
    secret: "caique",
    cookie: {maxAge: 30000}
}))


app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//databse
connection.authenticate()
    .then(() => {
    console.log("conexao feita com sucesso")
    }).catch((msgErr) => {
    console.log(msgErr)
    })


app.use('/', CategoryController)
app.use('/', ArticleController)
app.use('/', UserController)

// ...




app.get('/', (req, res) => {
    Article.findAll({
        order: [['id', 'DESC']],
        limit: 4
    }).then(articles => { // Alterei de article para articles
        Category.findAll().then(categories => {
            res.render('index.ejs', { articles: articles, categories: categories }); // Alterei article para articles
        });
    });
});

// ...


app.get('/:slug', (req, res) => {

    const slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render('article.ejs',{article: article, categories: categories})
            })
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })

   

})


app.get('/category/:slug', (req, res) => {
    const slug = req.params.slug

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if (category != undefined) {

            Category.findAll().then(categories => {
                res.render('index', { articles: categories.article, categories: categories})
            })
            
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})

app.listen(8080, () => {
    console.log("server on")
})