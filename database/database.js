const Sequelize = require('sequelize')

const connection = new Sequelize('guiapress', 'root', 'Caique17242630', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-3:00"
})

module.exports = connection