var express = require('express');
var router = express.Router();
const mydb = require('../models');
const data = {userName: 'admin', pass: '1234'};


class User {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}

/* GET login page. */
router.get('/', function (req, res, next) {
    res.render('login', {title: 'welcome'});
});


/* GET github page. */
router.post('/github', function (req, res, next) {

    user = new User(req.body.userName, req.body.pass);

    if (user.id === data.pass && user.name === data.userName)
        res.render('index', {title: 'welcome'});
    else
        res.render('error', {title: 'error'});
});


router.post('/save', function (req, res) {

    mydb.Contact.findOne({
        where: {login: req.body.userName}
    }).then(prod => {

        if (prod.login === req.body.userName) {

            mydb.Contact.findAll({}).then(prod => {
                res.json(prod);
            });
        }

    }).catch(function (err) {
        mydb.Contact.create({
            login: req.body.userName
        });
        mydb.Contact.findAll({}).then(prod => {
            res.json(prod);
        });
    });

});


router.post('/delete', function (req, res) {

    mydb.Contact.findOne({
        where: {login: req.body.userName}
    }).then(prod => {

        if (prod.login === req.body.userName) {
            mydb.Contact.destroy({
                where: {
                    login: prod.login
                }
            });
            mydb.Contact.findAll({}).then(prod => {
                res.json(prod);
            });
        }

    }).catch(function (err) {
        mydb.Contact.findAll({}).then(prod => {
            res.json(prod);
        });
    });
});



router.post('/', function(req, res) {
    mydb.Contact.findAll({}).then(prod => {
        res.json(prod);
    });
});


module.exports = router;
