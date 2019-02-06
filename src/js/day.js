import {getDayString} from "./helpers.js";

"use strict";

export default class Day {
	constructor({ n, HTMLTemplate, holiday, note, title }) {
		this.dayNumber = n;

		this.day = getDayString( new Date(new Date().getFullYear(), 
																			new Date().getMonth(), 
																			this.dayNumber) );

		this.HTMLElement = HTMLTemplate.cloneNode(true).content.querySelector(".calendar-day");
		this.HTMLElement.dateDay = this.HTMLElement.querySelector(".calendar-day__day");
		this.HTMLElement.dateNumber = this.HTMLElement.querySelector(".calendar-day__number");
		this.HTMLElement.titleElement = this.HTMLElement.querySelector(".calendar-day__title");
		this.HTMLElement.hostObject = this;

		this.title = title;
		this.note = note;

		this.holiday = holiday;
	}

	fillHTML() {
		this.HTMLElement.dateNumber.textContent = this.dayNumber;
		if ( !this.title.length ) {
			this.HTMLElement.titleElement.textContent = "...";
		} else if ( this.title.length > 18 ) {
			this.HTMLElement.titleElement.textContent = this.title.slice(0, 16) + "...";
		} else {
			this.HTMLElement.titleElement.textContent = this.title;
		}

		if ( this.holiday ) {
			this.HTMLElement.classList.add("day_holiday");
		}

		if ( new Date().getDate() === this.dayNumber ) {
			this.HTMLElement.classList.add("current_day");
		}
	}
}