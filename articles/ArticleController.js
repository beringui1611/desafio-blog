const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')
const adminAuth = require('../middlewares/middlewares')

router.get('/admin/articles',adminAuth, (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(article => {
       res.render('articles/index.ejs',{article: article})
   })
})

router.get('/admin/articles/new',adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('articles/new.ejs', { categories: categories })
  
    })

})

router.post('/article/save',adminAuth, (req, res) => {
    const title = req.body.title
    const body = req.body.body
    const category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect('/admin/articles')
    })
})



router.post('/articles/delete',adminAuth, (req, res) => {
    const id = req.body.id

    if (id != undefined) {


        Article.destroy({
            where: {
                id:id
            }
        }).then(() => {
            res.redirect('/admin/articles')
        })



        if (!isNaN(id)) { // se for um numero

        } else {
            res.redirect('/admin/articles')
        }
    } else {
        res.redirect('/admin/articles')
    }
})



router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    const id = req.params.id
   
    Article.findByPk(id, {
        include: [Category]
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render('articles/edit.ejs',{categories: categories, article: article}) 
            })
           
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})

router.post('/articles/update', adminAuth,(req, res) => {
    const id = req.body.id
    const body = req.body.body
    const title = req.body.title
    const category = req.body.category

    Article.update({
        title: title,
        body: body,
        categoryId: category,
        slug: slugify(title)
    }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/articles')
    }).catch(err => {
        res.redirect('/')
    })
})


router.get('/articles/page/:num', (req, res) => {
    const page = req.params.num;
    let offset;

    if (isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = (parseInt(page) -1 ) * 4;
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [['id', 'DESC']]
    }).then(article => {
        let next;

        if (offset + 4 >= article.count) {
            next = false;
        } else {
            next = true;
        }

        const result = {
            page: parseInt(page),
            next: next,
            article: article
        };

        Category.findAll().then(categories => {
            res.render('articles/pages.ejs', { result: result, categories: categories });
        });
    });
});


module.exports = router;