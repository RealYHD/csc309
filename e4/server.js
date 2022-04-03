/* 
 * This code is provided solely for the personal and private use of students 
 * taking the CSC309H course at the University of Toronto. Copying for purposes 
 * other than this use is expressly prohibited. All forms of distribution of 
 * this code, including but not limited to public repositories on GitHub, 
 * GitLab, Bitbucket, or any other online platform, whether as given or with 
 * any changes, are expressly prohibited. 
*/

/* E4 server.js */
'use strict';
const log = console.log;

// Express
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json());

// Mongo and Mongoose
const { ObjectID } = require('mongodb')
const { mongoose } = require('./db/mongoose');
const { Restaurant } = require('./models/restaurant')

/* 
   Restaurant API routes below. 
   Note: You may use async-await if you wish, but you will have to modify the functions as needed.
*/

/// Route for adding restaurant, with *no* reservations (an empty array).
/* 
Request body expects:
{
	"name": <restaurant name>
	"description": <restaurant description>
}
Returned JSON should be the database document added.
*/
// POST /restaurants
app.post('/restaurants', async (req, res) => {
	// Add code here
	try {
		if (!req.body) {
			res.status(400).send("Missing body.");
			return;
		}
		if (!req.body.name) {
			res.status(400).send("Missing restaurant name in body.");
			return;
		}
		if (!req.body.description) {
			res.status(400).send("Missing restaurant description in body.");
			return;
		}

		let restaurant = new Restaurant({
			name: req.body.name,
			description: req.body.description,
			reservations: []
		});
		res.status(201).send(await restaurant.save());
	} catch (error) {
		res.status(500).send("Internal server error.");
	}
})


/// Route for getting all restaurant information.
// GET /restaurants
app.get('/restaurants', async (req, res) => {
	// Add code here
	try {
		res.status(200).send(await Restaurant.find());
	} catch (error) {
		res.status(500).send("Internal server error.");
	}
})


/// Route for getting information for one restaurant.
// GET /restaurants/<id>
app.get('/restaurants/:id', async (req, res) => {
	// Add code here
	try {
		const rest_id = req.params.id;
		if (!ObjectID.isValid(rest_id)) {
			res.status(400).send("Invalid restaurant ID format.");
			return;
		}
		const rest_result = await Restaurant.findById(req.params.id);
		if (!rest_result) {
			res.status(400).send("Could not find restaurant with given ID.");
			return;
		}
		res.status(200).send(rest_result);
	} catch (error) {
		res.status(500).send("Internal server error.");
	}
})


/// Route for adding reservation to a particular restaurant.
/* 
Request body expects:
{
	"time": <time>
	"people": <number of people>
}
*/
// Returned JSON should have the updated restaurant database 
//   document that the reservation was added to, AND the reservation subdocument:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// POST /restaurants/<id>
app.post('/restaurants/:id', async (req, res) => {
	// Add code here
	try {
		const rest_id = req.params.id;
		if (!ObjectID.isValid(rest_id)) {
			res.status(400).send("Invalid restaurant ID format.");
			return;
		}
		const restaurant = await Restaurant.findById(rest_id);
		if (!restaurant) {
			res.status(400).send("Could not find restaurant with given ID.");
			return;
		}
		if (!req.body.time) {
			res.status(400).send("Missing time in body.");
			return;
		}
		if (!req.body.people) {
			res.status(400).send("Missing people in body.");
			return;
		}
		restaurant.reservations.push({
			time: req.body.time,
			people: req.body.people
		});
		await restaurant.save();
		const reservation = restaurant.reservations[restaurant.reservations.length - 1];
		res.status(201).send({
			reservation: reservation,
			restaurant: restaurant,
		});
	} catch (error) {
		res.status(500).send("Internal server error.");
	}
	// TODO: add error checking

})


/// Route for getting information for one reservation of a restaurant (subdocument)
// GET /restaurants/<restaurant_id>/<reservation_id>
app.get('/restaurants/:id/:resv_id', async (req, res) => {
	// Add code here
	try {
		const rest_id = req.params.id;
		const resv_id = req.params.resv_id;
		if (!ObjectID.isValid(rest_id)) {
			res.status(400).send("Invalid restaurant ID format.");
			return;
		}
		if (!ObjectID.isValid(resv_id)) {
			res.status(400).send("Invalid reservation ID format.");
			return;
		}
		const restaurant = await Restaurant.findById(rest_id);
		if (!restaurant) {
			res.status(400).send("Could not find restaurant with the given ID.");
			return;
		}
		const reservation = restaurant.reservations.id(resv_id);
		if (!reservation) {
			res.status(400).send("Could not find reservation under the given restaurant ID with the given reservation ID.");
			return;
		}
		res.status(200).send(reservation);
	} catch (error) {
		res.status(500).send("Internal server error.");
	}
})


/// Route for deleting reservation
// Returned JSON should have the updated restaurant database
//   document from which the reservation was deleted, AND the reservation subdocument deleted:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// DELETE restaurant/<restaurant_id>/<reservation_id>
app.delete('/restaurants/:id/:resv_id', async (req, res) => {
	// Add code here
	try {
		const rest_id = req.params.id;
		const resv_id = req.params.resv_id;
		if (!ObjectID.isValid(rest_id)) {
			res.status(400).send("Invalid restaurant ID format.");
			return;
		}
		if (!ObjectID.isValid(resv_id)) {
			res.status(400).send("Invalid reservation ID format.");
			return;
		}

		const restaurant = await Restaurant.findById(rest_id);
		if (!restaurant) {
			res.status(400).send("Could not find restaurant with the given ID.");
			return;
		}
		const reservation = restaurant.reservations.id(resv_id);
		if (!reservation) {
			res.status(400).send("Could not find reservation under the given restaurant ID with the given reservation ID.");
			return;
		}
		reservation.remove();
		res.status(200).send({
			reservation: reservation,
			restaurant: restaurant,
		});
		await restaurant.save();
	} catch (error) {
		res.status(500).send("Internal server error.");
	}
})


/// Route for changing reservation information
/* 
Request body expects:
{
	"time": <time>
	"people": <number of people>
}
*/
// Returned JSON should have the updated restaurant database
//   document in which the reservation was changed, AND the reservation subdocument changed:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// PATCH restaurant/<restaurant_id>/<reservation_id>
app.patch('/restaurants/:id/:resv_id', async (req, res) => {
	// Add code here
	try {
		const rest_id = req.params.id;
		const resv_id = req.params.resv_id;
		if (!ObjectID.isValid(rest_id)) {
			res.status(400).send("Invalid restaurant ID format.");
			return;
		}
		if (!ObjectID.isValid(resv_id)) {
			res.status(400).send("Invalid reservation ID format.");
			return;
		}

		const restaurant = await Restaurant.findById(req.params.id);
		if (!restaurant) {
			res.status(400).send("Could not find restaurant with the given ID.");
			return;
		}
		const reservation = restaurant.reservations.id(resv_id);
		if (!reservation) {
			res.status(400).send("Could not find reservation under the given restaurant ID with the given reservation ID.");
			return;
		}
		if (!req.body.time) {
			res.status(400).send("Missing time in body.");
			return;
		}
		if (!req.body.people) {
			res.status(400).send("Missing people in body.");
			return;
		}
		reservation.time = req.body.time;
		reservation.people = req.body.people;
		await restaurant.save();
		res.status(200).send({
			reservation: reservation,
			restaurant: restaurant
		});
	} catch (error) {
		res.status(500).send("Internal server error.");
	}
})


////////// DO NOT CHANGE THE CODE OR PORT NUMBER BELOW
const port = process.env.PORT || 5001
app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
