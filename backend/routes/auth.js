const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// register route
router.post('/register', register);

// login route  
router.post('/login', login);

// test route to verify the route is working
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes working!' });
});

module.exports = router;