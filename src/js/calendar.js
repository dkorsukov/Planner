import {getMonthString, 
				getDaysInMonth, 
				createDOMElement, 
				getFirstMonthDayNumber} from "./helpers.js";
import Day from "./day.js";

"use strict";

export default class Calendar {
	constructor({ calendarSelector, headerSelector, clearSelector, downloadSelector, daysContainerSelector, 
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
			closeBtnSelector: ".day-modal__close-btn",
			visibleCls: "day-modal_visible"
		});

		this.HTMLElement = document.querySelector(`${calendarSelector}`);
		this.HTMLElement.header = this.HTMLElement.querySelector(`${headerSelector}`);
		this.HTMLElement.daysContainer = this.HTMLElement.querySelector(`${daysContainerSelector}`);
		this.HTMLElement.downloadBtn = this.HTMLElement.querySelector(`${downloadSelector}`);
		this.HTMLElement.clearBtn = this.HTMLElement.querySelector(`${clearSelector}`);

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

		if (this.storage.lastMonth === undefined) {
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

	initModal({ statusElemSelector, animCls, backgroundSelector, closeBtnSelector, visibleCls }) {
		let statusElem = document.querySelector(statusElemSelector);

		let closeModal = () => {
			this.modalWindow.classList.remove( this.modalWindow.visibleCls );

			this.clearDays();
			this.loadDays();			
		};

		document.querySelector(backgroundSelector).addEventListener("click", closeModal);
		document.querySelector(closeBtnSelector).addEventListener("click", closeModal);

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
		console.time("Load time");

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

		console.timeEnd("Load time");
	}

	download() {
		let downloadData = [];

		for (let nb in this.storage) {
			if ( isNaN(nb) ) continue;

			if ( this.storage[nb].note.trim() ) {
				let t = this.storage[nb].title,
						n = this.storage[nb].note;

				// control character "\r" moves the printing position to the start of the line
				downloadData.push(`${this.month} ${nb}, "${t}": \r\n ${n.split("\n").join("\r\n ")} \r\n \r\n`);
			}
		}

		if ( !downloadData.length ) {
			return null;
		}

		let blob = new Blob(downloadData, { type: "text/plain" }),
				url = URL.createObjectURL(blob);

		let a = document.createElement("a");
		a.download = "notes.txt";
		a.href = url;

		a.dispatchEvent( new MouseEvent("click") );

		URL.revokeObjectURL(url);
	}

	clearApp() {
		this.storage = {};
		this.initAppStorage();

		this.clearDays();
		this.loadDays();
	}

	init() {
		this.initAppStorage();

		let firstDayNumber = getFirstMonthDayNumber( new Date() );

			// add empty elements for columns alignment															 
		for (let i = 1; i <= firstDayNumber + 1; i++) {
			let emptyElem = createDOMElement("div", {
				class: "empty-element"
			});

			this.HTMLElement.daysContainer.appendChild(emptyElem);
		}	
		
		if ( !!(new Blob) ) {
			this.HTMLElement.downloadBtn.addEventListener("click", (evt) => {
				this.download();
			});
		} else {
			this.HTMLElement.downloadBtn.parentNode.removeChild( this.HTMLElement.downloadBtn );
		}

		this.HTMLElement.clearBtn.addEventListener("click", (evt) => {
			this.clearApp();
		});

		this.loadDays();
	}
}