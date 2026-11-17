const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verificarToken = require('../middlewares/authMiddleware');

router.post('/register', authController.registrarUsuario);
router.post('/login', authController.iniciarSesion);
router.post('/logout', verificarToken, authController.cerrarSesion);

module.exports = router;