import {getMonthString, 
				getDaysInMonth, 
				createDOMElement, 
				getFirstMonthDayNumber} from "./helpers.js";
import Day from "./day.js";

"use strict";

export default class Calendar {
	constructor({ calendarSelector, headerSelector, daysContainerSelector, 
								dayHTMLTemplate, daySelector, linkedModalSelector, storageName }) {
		this.days = getDaysInMonth( new Date() );
		this.month = getMonthString( new Date() );

		this.modalWindow = document.querySelector(`${linkedModalSelector}`);
		this.modalWindow.tInput = this.modalWindow.querySelector(`${linkedModalSelector}__title-input`); // title input
		this.modalWindow.nInput = this.modalWindow.querySelector(`${linkedModalSelector}__note-input`); // note input
		this.modalWindow.hInput = this.modalWindow.querySelector(`${linkedModalSelector}__holiday-input`); // holiday checkbox

		this.initModal({
			statusElemSelector: ".day-modal__save-status",
			animCls: "save-status_hiding",
			backgroundSelector: ".day-modal__background",
			visibleCls: "day-modal_visible"
		});

		this.HTMLElement = document.querySelector(`${calendarSelector}`);
		this.HTMLElement.header = this.HTMLElement.querySelector(`${headerSelector}`);
		this.HTMLElement.daysContainer = this.HTMLElement.querySelector(`${daysContainerSelector}`);

		document.querySelector(`${headerSelector}__current-month`).textContent = this.month;
		document.querySelector(`${headerSelector}__current-year`).textContent = new Date().getFullYear();

		this.dayTemplate = dayHTMLTemplate;
		this.daySelector = daySelector;

		this.storageName = storageName;	// name of object in local storage for this app
		this.storage = JSON.parse( localStorage.getItem(storageName) ); // object for writing to local storage
	}

	cloneToLocalStorage() { // clone calendar storage to local storage
		localStorage.setItem( this.storageName,
													JSON.stringify(this.storage) );		
	}

	initAppStorage() {
		if (!this.storage) {
			this.storage = {};
		}

		if (!this.storage.lastMonth) {
			this.storage.lastMonth = new Date().getMonth();
		}

		if ( this.storage.lastMonth != new Date().getMonth() ) {
			this.storage = {
				lastMonth: new Date().getMonth()
			};
		}

		for (let i = 1; i <= this.days; i++) {
			if (!this.storage[i]) {
				this.storage[i] = {
					title: "",
					note: "",
					holiday: false
				}
			}
		}	

		this.cloneToLocalStorage();
	}

	initModal({ statusElemSelector, animCls, backgroundSelector, visibleCls }) {
		let statusElem = document.querySelector(statusElemSelector);

		document.querySelector(backgroundSelector).addEventListener("click", (evt) => {
			this.modalWindow.classList.remove( this.modalWindow.visibleCls );

			this.clearDays();
			this.loadDays();
		});

		this.modalWindow.visibleCls = visibleCls;

		let tInput = this.modalWindow.tInput,
				nInput = this.modalWindow.nInput,
				hInput = this.modalWindow.hInput;

		tInput.addEventListener("input", (evt) => {
			this.storage[ evt.target.getAttribute("data-for-day") ].title = evt.target.value;
			
			this.cloneToLocalStorage();
		});

		nInput.addEventListener("input", (evt) => {
			this.storage[ evt.target.getAttribute("data-for-day") ].note = evt.target.value;
			
			this.cloneToLocalStorage();
		});

		hInput.addEventListener("input", (evt) => {
			this.storage[ evt.target.getAttribute("data-for-day") ].holiday = evt.target.checked;
			
			this.cloneToLocalStorage();
		});

		[tInput, nInput, hInput].forEach( (input) => {
				input.addEventListener("input", (evt) => {
					statusElem.classList.remove(animCls);
					statusElem.offsetHeight; // reflow
					statusElem.classList.add(animCls);
				});
			} );
	}

	openModal(dayObj) {
		this.modalWindow.classList.add( this.modalWindow.visibleCls );

		let modalCls = this.modalWindow.classList[0];

		this.modalWindow.querySelector(`.${modalCls}__date-number`).textContent = dayObj.dayNumber;
		this.modalWindow.querySelector(`.${modalCls}__date-day`).textContent = dayObj.day;

		let tInput = this.modalWindow.tInput,
				nInput = this.modalWindow.nInput,
				hInput = this.modalWindow.hInput;

		tInput.setAttribute("data-for-day", dayObj.dayNumber);
		nInput.setAttribute("data-for-day", dayObj.dayNumber);
		hInput.setAttribute("data-for-day", dayObj.dayNumber);
		
		[tInput.value, nInput.value, hInput.checked] = [dayObj.title, dayObj.note, dayObj.holiday];
	}

	clearDays() {
		for (let i = 1; i <= this.days; i++) {
			let tempDay = this.HTMLElement.daysContainer.querySelector(this.daySelector);

			this.HTMLElement.daysContainer.removeChild(tempDay);
		}
	}

	loadDays() {
		console.time("Load time: ");

		for (let i = 1; i <= this.days; i++) {
			let tempTitle = this.storage[i].title,
					tempNote = this.storage[i].note,
					tempHoliday = this.storage[i].holiday

			let day = new Day({
				n: i,
				HTMLTemplate: this.dayTemplate,
				holiday: tempHoliday,
				note: tempNote,
				title: tempTitle
			});

			day.fillHTML();

			day.HTMLElement.addEventListener("click", (evt) => {
				let targetDay = evt.target;

				while ( targetDay.classList[0] !== "calendar-day" ) {
					targetDay = targetDay.parentNode;
				}

				this.openModal(targetDay.hostObject, "day-modal_visible", {
					titleInputSelector: ".day-modal__title-input",
					noteInputSelector: ".day-modal__note-input",
					holidayInputSelector: ".day-modal__holiday-input"
				});
			});

			this.HTMLElement.daysContainer.appendChild( day.HTMLElement );
		}		

		console.timeEnd("Load time: ");
	}

	init() {
		this.initAppStorage();

		let firstDayNumber = getFirstMonthDayNumber( new Date() );

			// add empty elements for columns alignment															 
		for (let i = 1; i <= firstDayNumber; i++) {
			let emptyElem = createDOMElement("div", {
				class: "empty-element"
			});

			this.HTMLElement.daysContainer.appendChild(emptyElem);
		}	
		
		this.loadDays();
	}
}