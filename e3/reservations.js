/*
 * This code is provided solely for the personal and private use of students
 * taking the CSC309H course at the University of Toronto. Copying for purposes
 * other than this use is expressly prohibited. All forms of distribution of
 * this code, including but not limited to public repositories on GitHub,
 * GitLab, Bitbucket, or any other online platform, whether as given or with
 * any changes, are expressly prohibited.
*/

/* Reservations.js */
'use strict';

const log = console.log
const fs = require('fs');
const datetime = require('date-and-time')

const startSystem = () => {

	let status = {};

	try {
		status = getSystemStatus();
	} catch (e) {
		status = {
			numRestaurants: 0,
			totalReservations: 0,
			currentBusiestRestaurantName: null,
			systemStartTime: new Date(),
		}

		fs.writeFileSync('status.json', JSON.stringify(status))
	}

	return status;
}

/*********/


// You may edit getSystemStatus below.  You will need to call updateSystemStatus() here, which will write to the json file
const getSystemStatus = () => {
	const status = fs.readFileSync('status.json')

	return JSON.parse(status)
}

/* Helper functions to save JSON */
// You can add arguments to updateSystemStatus if you want.
const updateSystemStatus = () => {
	const status = {}

	/* Add your code below */

	fs.writeFileSync('status.json', JSON.stringify(status))
}

const saveRestaurantsToJSONFile = (restaurants) => {
	/* Add your code below */
	fs.writeFileSync('restaurants_example.json', JSON.stringify(restaurants))
};

const saveReservationsToJSONFile = (reservations) => {
	/* Add your code below */
	fs.writeFileSync('restaurants_example.json', JSON.stringify(reservations))
};

/*********/

// Should return an array of length 0 or 1.
const addRestaurant = (name, description) => {
	// Check for duplicate names

	return [];

	// if no duplicate names:
	const restaurant = null; // remove null and assign it to proper value


	return [restaurant];

}

// should return the added reservation object
const addReservation = (restaurant, time, people) => {

	/* Add your code below */
	const reservation = null; // remove null and assign it to proper value
	return reservation;

}


/// Getters - use functional array methods when possible! ///

// Should return an array - check to make sure restaurants.json exists
const getAllRestaurants = () => {
	if (!fs.existsSync('restaurants.json')) {
		return [];
	}
	let restaurants = JSON.parse(fs.readFileSync('restaurant.json'));
	return restaurants;
};

// Should return the restaurant object if found, or an empty object if the restaurant is not found.
const getRestaurantByName = (name) => {
	/* Add your code below */
	return getAllRestaurants().find((restuarant) => restaurant.name == name);
};

// Should return an array - check to make sure reservations.json exists
const getAllReservations = () => {
	/* Add your code below */
	if (!fs.existsSync('reservations.json')) {
		return [];
	}
	let restaurants = JSON.parse(fs.readFileSync('reservations.json'));
	return restaurants;
};

// Should return an array
const getAllReservationsForRestaurant = (name) => {
	/* Add your code below */
	getAllReservations().filter((reservation) => reservation.restaurant == name);
};


// Should return an array
const getReservationsForHour = (time) => {
	/* Add your code below */
	getAllReservations().filter((reservation) => reservation.time)
}

// should return a reservation object
const checkOffEarliestReservation = (restaurantName) => {

	const checkedOffReservation = null; // remove null and assign it to proper value
	return checkedOffReservation;
}


const addDelayToReservations = (restaurant, minutes) => {
	// Hint: try to use a functional array method

}

startSystem(); // start the system to create status.json (should not be called in app.js)


// DO NOT modify the contents of module.exports.  You may not need all of these in app.js..but they're here.
module.exports = {
	addRestaurant,
	getSystemStatus,
	getRestaurantByName,
	getAllRestaurants,
	getAllReservations,
	getAllReservationsForRestaurant,
	addReservation,
	checkOffEarliestReservation,
	getReservationsForHour,
	addDelayToReservations
}

