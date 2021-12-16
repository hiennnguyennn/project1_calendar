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
 * /events/{eventId}:
 *   get:
 *     description: Event detail
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
 *         description: Created successfully
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Event'
 */
router.get('/:eventId', eventController.getEventInfo);

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

/**
 * @swagger
 * /events/{eventId}:
 *   put:
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
router.put('/:eventId', owner.requireOwn, eventController.updateEvent);

/**
 * @swagger
 * /events/{eventId}:
 *   delete:
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
router.delete('/:eventId', owner.requireOwn, eventController.deleteEvent);

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
 *         required: true
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
router.get('/list/:date_start', eventController.getEvent);

/**
 * @swagger
 * /events/import/{id}:
 *   get:
 *     description: List events in 7 day
 *     tags: [Event]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *              type: number
 *         required: true
 *         description: Event id to import
 *     responses:
 *       201:
 *         description: Imported
 *       409:
 *         description: Conflig
 */
router.get('/import/:id', eventController.importEvent);
module.exports = router;
