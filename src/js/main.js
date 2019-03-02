/* STYLES */
import "../scss/main.scss";
/* ------ */

/* IMAGES */
import "../img/favicon.png";
/* ------ */

/* SCRIPTS */
import * as helpers from "./helpers.js";
import setThemeBySeason from "./themes.js";
import Calendar from "./calendar.js";
/* ------- */

"use strict";

window.addEventListener("load", () => {
	let menuBtn = document.querySelector(".calendar-header__menu-open"),
			menu = document.querySelector(".calendar-header__menu-items");

	menuBtn.addEventListener("click", (evt) => {
		menuBtn.classList.toggle("opened");

		menu.classList.toggle("menu_visible");
	});		

	setThemeBySeason([ document.querySelector(".calendar-header"),
										 document.querySelector(".day-modal__date-side") ]);

	let	dayTemplate = document.querySelector(".calendar-day-template"),
			sn = "_plannerApp";

	let app = new Calendar({
		calendarSelector: ".calendar",
		headerSelector: ".calendar-header",
		clearSelector: ".calendar-header__clear-btn",
		downloadSelector: ".calendar-header__download-btn",
		daysContainerSelector: ".calendar-days",
		dayHTMLTemplate: dayTemplate,
		daySelector: ".calendar-day",
		linkedModalSelector: ".day-modal",
		storageName: sn
	});

	app.init();
});