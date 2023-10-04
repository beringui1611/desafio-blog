const express = require('express')
const router = express.Router()
const Category = require('./Category')
const slugify = require('slugify')

router.get('/admin/categories/new', (req, res) => {
    res.render('categories/new.ejs')
})

router.post('/categories/save', (req, res) => {
    const title = req.body.title

    if (title != undefined) {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/admin/categories')
        })
    } else {
        res.redirect('/admin/categories/new')
    }
})

router.get('/admin/categories', (req, res) => {

    Category.findAll().then(categories => {
        res.render('categories/index.ejs', { categories: categories })
    })

})

router.post('/categories/delete', (req, res) => {
    const id = req.body.id

    if (id != undefined) {


        Category.destroy({
            where: {
                id:id
            }
        }).then(() => {
            res.redirect('/admin/categories')
        })



        if (!isNaN(id)) { // se for um numero

        } else {
            res.redirect('/admin/categories')
        }
    } else {
        res.redirect('/admin/categories')
    }
})


router.get("/admin/categories/edit/:id", (req, res) => {
    const id = req.params.id

  


    Category.findByPk(id).then(category => {
        if (category != undefined) {
            res.render('categories/edit.ejs',{category: category})
        }
        else {
            res.redirect('/admin/categories')
        }
    }).catch(err => {
        res.redirect('admin/categories')
    })
})


router.post('/categories/update', (req, res) => {
    const id = req.body.id
    const title = req.body.title

    Category.update({ title: title, slug: slugify(title) }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/categories')
    })
})

module.exports = router;