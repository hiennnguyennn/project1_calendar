const express = require('express');
const router = express.Router();
const siteController = require('../app/controller/siteController');
const auth = require('../app/middleware/auth');
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - phone
 *         - dob
 *       properties:
 *         email:
 *           type: string
 *           description: User email
 *         username:
 *           type: string
 *           description: Username
 *         dob:
 *           type: string
 *           description: User date of birth
 *         phone:
 *           type: string
 *           description: User phone number
 *         password:
 *           type: string
 *           description: User password
 */

/**
 * @swagger
 * /login:
 *   post:
 *     description: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                - email
 *                - password
 *             properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *     responses:
 *       200:
 *         description: Login successfully
 *       401:
 *         description: wrong password
 *       404:
 *         description: Account not found
 */
router.post('/login', siteController.handleLogin);

/**
 * @swagger
 * /register:
 *   post:
 *     description: Register
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Register successfully
 *       409:
 *         description: Conflig
 */
router.post('/register', siteController.register);
router.get('/login', siteController.showLogin);
router.get('/register', siteController.showRegister);
router.get('/home', auth.requireAuth, siteController.home);
router.get('/', siteController.default);

module.exports = router;
