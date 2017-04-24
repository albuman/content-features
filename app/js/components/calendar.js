import $ from 'jquery';
	function createStructure(parent){
		var container = document.createElement('div');
		container.className = "container";
		var calendWrap = document.createElement('div');
		calendWrap.className = 'calendWrap';
		var todayWrap = document.createElement('div');
		todayWrap.className = 'todayWrap';
		var todayDateBlock = document.createElement('span');
		todayDateBlock.className = 'todayDateBlock';
		var todayBlock = document.createElement('span');
		todayBlock.className = 'todayBlock';
		todayWrap.appendChild(todayDateBlock);
		todayWrap.appendChild(todayBlock);
		

		var monthContainer  = document.createElement('div');
		monthContainer.className = 'monthContainer';
		var monthWrap  = document.createElement('div');
		monthWrap.className = 'monthWrap';
		var prevMonth = document.createElement('span');
		prevMonth.className = 'prevMonth';
		prevMonth.innerHTML = '<';
		var monthLine = document.createElement('span');
		monthLine.className = 'monthLine';
		var nextMonth = document.createElement('span');
		nextMonth.className = 'nextMonth';
		nextMonth.innerHTML = '>';
		monthWrap.appendChild(prevMonth);
		monthWrap.appendChild(monthLine);
		monthWrap.appendChild(nextMonth);
		

		var daysAbbr = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
		var daysWrap  = document.createElement('div');
		daysWrap.className = 'daysWrap';
		var days  = document.createElement('div');
		days.className = 'days';
		var daysNames  = document.createElement('table');
		daysNames.className = 'daysNames';
		var tbody = document.createElement('tbody');
		var tr = document.createElement('tr');
		for(let i =0; i < daysAbbr.length; i++){
			var td = document.createElement('td');
			td.innerHTML = daysAbbr[i];
			tr.appendChild(td);
		};
		tbody.appendChild(tr);
		daysNames.appendChild(tbody);
		days.appendChild(daysNames);
		daysWrap.appendChild(days);


		monthContainer.appendChild(monthWrap);
		monthContainer.appendChild(daysWrap);
		calendWrap.appendChild(todayWrap);
		calendWrap.appendChild(monthContainer);
		container.appendChild(calendWrap);
		parent.appendChild(container);
		document.onclick = function(elem){
			if(!isParent(elem.target)){
				$('.container').remove();
				document.onclick = null;
				c.created = false;
			};
		}
		
		return parent;
		
		
	}
	function isParent(parent){
            		
        if(parent == document){
            return false;
        };
        if(parent == document.querySelector('.calendWrap')){
			return true;
        }
        else{
			return isParent(parent.parentNode)
        }

    }	
	


		function days (month, x) { 
			x=x+1;
			return {month: month, days: (28 + (x + Math.floor(x/8)) % 2 + 2 % x + 2 * Math.floor(1/x))}; 
		}
		function dayPos(year, month, day){
			var dayPosition = new Date(year, month, day);
			dayPosition = dayPosition.getDay();
			dayPosition = dayPosition === 0 ? 7 : dayPosition;
			return dayPosition;
		}
		var monthsArr = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
		var day = ["Понедельник", "Вторник", "Среда", "Черверг", "Пятница", "Суббота", "Воскресенье"];
		var	months = monthsArr.map(days);
		var reactSetStateFunction = null; // assign setState function to work with another months during re-rendering new month
		var $calendarContainer = null; // caching parent-node calendar to calling Calendar.prototype.createCalendar(parent)

		function Calendar(months){
			
			this.year = (new Date()).getFullYear();
			this.numberOfMonth = (new Date()).getMonth();
			this.currentMonth = months[this.numberOfMonth];
			this.date = (new Date()).getDate();
			this.monthsArr = monthsArr;
			this.days = day;
			this.months = months;


		}
		function Day (elem, year, month, date){
			this.day = document.createElement(elem);
			this.year = year;
			this.month = month;
			this.date = date;
		}

		Calendar.prototype.createCalendar = function(parent){
			if(parent){
				$calendarContainer = createStructure(parent);
			}
			return (function(monthsArray, year, numberOfMonth, reactSetState){
				var parentClass = ".daysNames";
				var $parent = document.querySelector(parentClass);
				reactSetStateFunction = reactSetState;
				var month = months[numberOfMonth];
				var currentMonth = {};
				var now = new Date();
				document.querySelector('.todayDateBlock').innerText = now.getDate();
				document.querySelector('.todayBlock').innerText = day[dayPos(now.getFullYear(), now.getMonth(), now.getDate())-1].toUpperCase();
				
				while($parent.getElementsByClassName('week')[0]){
					$parent.removeChild($parent.getElementsByClassName('week')[0]);
				};
				months[1].days = year % 4==0 ? 29 : 28;

				document.querySelector('.monthLine').innerHTML = month.month.toUpperCase();
				
				let startFrom = 1;
				let firstDayPosition = dayPos(year, numberOfMonth, startFrom);
				let weeks = new Array(Math.ceil((month.days+firstDayPosition)/7));
				let daysInThisMonth = month.days;

				for(let currentWeek = [], weekIndex = 0; weeks.length > weekIndex; weekIndex++){
					var tr = document.createElement('tr');
					tr.className = "week";
					$parent.appendChild(tr);
					for(let daysQuantity = 7, currentDay = 1; daysQuantity >= currentDay; currentDay++){
							let dayButton, 
								dayIndex,
								date,
								td;
							dayIndex = (weekIndex * daysQuantity) + currentDay;
							
							date = startFrom + '-' + numberOfMonth + '-' + year;
							
							td = document.createElement('td');
							
							tr.appendChild(td);
							
							if(dayIndex >= firstDayPosition && startFrom <= daysInThisMonth){
								dayButton = document.createElement('a');
								td.appendChild(dayButton); 
								dayButton.innerText = startFrom++;
								dayButton.onclick = function(){
									if(window.localStorage[date]){
										reactSetState({history : window.localStorage[date]}); // use reactSetState to compatible calendar events with react-app 
										$calendarContainer.click();// to exit from calendar to main UI
									}
									else {
										alert('Пусто!')
									}

								}
							}
							if(window.localStorage[date]) {
								dayButton.style.color = '#03a51b';
							}
							
						}
					
					
					

					
				}
				this.created = true;
				document.querySelector('.prevMonth').onclick = this.prevMonth.bind(this);
				document.querySelector('.nextMonth').onclick = this.nextMonth.bind(this);
					
				
			}).bind(this)
		}
		Calendar.prototype.prevMonth = function(newCalendar){
			--this.numberOfMonth;
			if(this.numberOfMonth < 0){
				this.numberOfMonth = 11;
				--this.year;
			}
			this.createCalendar()(this.months, this.year, this.numberOfMonth, reactSetStateFunction);


		};
		Calendar.prototype.nextMonth = function(newCalendar){
			++this.numberOfMonth;
			if(this.numberOfMonth > 11){
				this.numberOfMonth = 0;
				++this.year;
			}
			this.createCalendar()(this.months, this.year, this.numberOfMonth, reactSetStateFunction);
		};

		var c = new Calendar(months);

		export {c as calendar};

		