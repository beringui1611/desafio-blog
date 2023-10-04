const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')


router.get('/admin/users', (req, res) => {
    User.findAll().then(users => {
        res.render('users/index.ejs', {
            users: users
        })
    })
})

router.get('/admin/user/create', (req, res) => {
    res.render('users/create.ejs')
})

router.post('/users/create', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    User.findOne({ where: { email: email } }).then(user => {
        if (user == undefined) {

            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
        
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect('/')
            }).catch(err => {
                res.redirect('/')
            })
        
        } else {
            res.redirect('/admin/user/create')
        }
    })


})


router.get('/login', (req, res) => {
    res.render('login/login.ejs')
})

router.post('/authenticate', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    User.findOne({
        where:{email : email}
    }).then(user => {
        if (user != undefined) {
            const correct = bcrypt.compareSync(password, user.password)
            if (correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/admin/articles')
            } else {
                res.redirect('/login')
            }
        } else {
            res.redirect('/login')
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.user = undefined
    res.redirect('/')
 })

module.exports = router