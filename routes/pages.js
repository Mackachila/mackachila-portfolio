//imports

const express = require('express');
const path = require('path');

const { isAuthenticated, isAdminAuthenticated} = require('../middlewares/auth');

const router = express.Router();




router.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'registration.html'));
  });

  router.get('/passwordreset', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'passwordreset.html'));
  });

  router.get('/studentportal', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'studentportal.html'));
  });

   router.get('/adminportal', isAdminAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'adminportal.html'));
  });

   router.get('/adminlogin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'adminlogin.html'));
  });


  router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
  });

router.get('/mackachila', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'mackachila.html'));
  });


router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'mackachila.html'));
});



module.exports = router;
