const express = require('express');
const router = express.Router();
const userController = require('../app/controller/UserController');

/**
 * @swagger
 * components:
 *   schemas:
 *     UserInfo:
 *       type: object
 *       required:
 *         - username
 *         - email
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
 */

/**
 * @swagger
 * /user/me/update:
 *   post:
 *     description: Update
 *     tags: [UserInfo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  username:
 *                     type: string
 *                     description: Username
 *                  dob:
 *                     type: string
 *                     description: date of birth
 *                  phone:
 *                     type: string
 *                     description: phone number
 *     responses:
 *       200:
 *         description: Update successfully
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UserInfo'
 *       409:
 *         description: Conflig
 */
router.post('/me/update', userController.updateProfile);

/**
 * @swagger
 * /user/follow/{id}:
 *   post:
 *     description: Follow the user by id
 *     tags: [UserInfo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: Followed
 *       404:
 *         description: The user was not found
 */
router.post('/follow/:id', userController.follow);

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: My profile
 *     tags: [UserInfo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserInfo'
 *       404:
 *         description: The user was not found
 */
router.get('/me', userController.myProfile);

/**
 * @swagger
 * /user/me/changePassword:
 *   put:
 *     description: Update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  currentPassword:
 *                     type: string
 *                     description: User current password
 *                  newPassword:
 *                     type: string
 *                     description: new password
 *     responses:
 *       200:
 *         description: Change password successfully
 *       409:
 *         description: Conflig
 */
router.put('/me/changePassword', userController.changePassword);

router.get('/logout', userController.logout);
/**
 * @swagger
 * /user:
 *   get:
 *     description: Get the user by email
 *     tags: [UserInfo]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The user email
 *     responses:
 *       200:
 *         description: The user description by email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserInfo'
 *       404:
 *         description: The user was not found
 */
router.get('/', userController.profile);

module.exports = router;
