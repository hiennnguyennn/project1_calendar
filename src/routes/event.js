const express = require('express');
const router = express.Router();
const eventController = require('../app/controller/EventController');
const owner = require('../app/middleware/ownEvent');
/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - name
 *         - start
 *         - end
 *         - private
 *       properties:
 *         name:
 *           type: string
 *           description: Event name
 *         location:
 *           type: string
 *           description: Event location
 *         description:
 *           type: string
 *           description: Event description
 *         start:
 *           type: string
 *           description: Event date start
 *         end:
 *           type: string
 *           description: Event date end
 *         private:
 *           type: boolean
 *           description: Event private or public
 */

/**
 * @swagger
 * /events:
 *   post:
 *     description: Create event
 *     tags: [Event]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Event'
 *       409:
 *         description: Conflig
 */
router.post('/', eventController.createEvent);
router.get('/export', eventController.exportToExcel);
/**
 * @swagger
 * /events/update/{eventId}:
 *   post:
 *     description: Create event
 *     tags: [Event]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *              type: number
 *         required: true
 *         description: Event id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Update successfully
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Event'
 *       409:
 *         description: Conflig
 */
router.post('/update/:eventId', owner.requireOwn, eventController.updateEvent);

/**
 * @swagger
 * /events/remove/{eventId}:
 *   post:
 *     description: Delete event
 *     tags: [Event]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *              type: number
 *         required: true
 *         description: Event id
 *     responses:
 *       200:
 *         description: Delete successfully
 *       409:
 *         description: Conflig
 */
router.post('/remove/:eventId', owner.requireOwn, eventController.deleteEvent);

/**
 * @swagger
 * /events/list/{date_start}:
 *   get:
 *     description: List events in 7 day
 *     tags: [Event]
 *     parameters:
 *       - in: path
 *         name: date_start
 *         schema:
 *              type: string
 *         required: false
 *         description: Start date for event
 *     responses:
 *       200:
 *         description: List event
 *         content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Event'
 */
router.get('/list/:date_start*?', eventController.getEvent);

router.post('/import/:id*?', eventController.importEvent);

module.exports = router;
