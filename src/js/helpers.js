"use strict";

export function createDOMElement(tag, attrs) {
	try {
		var _domelem = document.createElement(tag);

		for (var attr in attrs) {
			_domelem.setAttribute(attr, attrs[attr])
		}

		return _domelem;
	} catch (e) {
		console.error(e);
	}	
}

export function getFirstMonthDayNumber(dateObj) {
	return new Date( dateObj.getFullYear(), dateObj.getMonth(), 0 ).getDay();
}

export function getDaysInMonth(dateObj) {
	return 33 - new Date( dateObj.getFullYear(), dateObj.getMonth(), 33 ).getDate();
}

export function getDayString(dateObj) {
	var currentDay = dateObj.getDay();

	switch (currentDay) {
		case 0: return "Sunday";
		case 1: return "Monday";
		case 2: return "Tuesday";
		case 3: return "Wednesday";
		case 4: return "Thursday";
		case 5: return "Friday";
		case 6: return "Saturday";
	}	
}

export function getMonthString(dateObj) {
	var currentMonth = dateObj.getMonth();

	switch (currentMonth) {
		case 0: return "January";
		case 1: return "February";
		case 2: return "March";
		case 3: return "April";
		case 4: return "May";
		case 5: return "June";
		case 6: return "July";
		case 7: return "August";
		case 8: return "September";
		case 9: return "October";
		case 10: return "November";
		case 11: return "December";
	}	
}