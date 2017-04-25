import jQuery from 'jquery';
import React from 'react';

var $ = jQuery;
var monthsArr = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

class Calendar extends React.Component {
	constructor(props){
		super(props);
		var now = new Date();
		this.state = {
			currentMonth: now.getMonth(),
			currentDate: now.getDate(),
			currentYear: now.getFullYear(),
		};
		
	}
	componentDidMount(){
		var {currentMonth, currentYear} = this.state;
		this.renderWeeks(currentYear, currentMonth);
	}
	days (month, x) {
		x=x+1;
		return {month: month, days: (28 + (x + Math.floor(x/8)) % 2 + 2 % x + 2 * Math.floor(1/x))};
	}
	dayPos(year, month, day){
		var dayPosition = new Date(year, month, day);
		dayPosition = dayPosition.getDay();
		dayPosition = dayPosition === 0 ? 7 : dayPosition;
		return dayPosition;
	}
	renderWeeks(year, month){
		var weeks = this.buildCalendar(year, month);
		var self = this;
		weeks = weeks.map(function (week) {
				return (<tr>
					{(function(){
						var dayRow =[];
						for(let i = 0; i < week.length; i++){
							dayRow.push(<td><a onClick={self.checkLocalStorage.bind(self, week[i])}>{week[i]}</a></td>)
						}
						return dayRow;
					})()}
				</tr>)
			});
		this.setState({weeks});
		
	}
	buildCalendar(year, monthIndex){
		
		let months = monthsArr.map(this.days);
		months[1].days = year % 4==0 ? 29 : 28;
		let currentMonth = months[monthIndex];
		let firstDayPositionInWeek = this.dayPos(year, monthIndex, 1);
		let weeksInMonth = new Array(Math.ceil((currentMonth.days + firstDayPositionInWeek)/7));
		let daysInMonth = currentMonth.days;
		for(let from = firstDayPositionInWeek, daysPerWeek = 7, date = 1; date <= daysInMonth; from++, date++ ){
			let weekOrder = Math.ceil(from/daysPerWeek) - 1;
			if(!weeksInMonth[weekOrder])
				weeksInMonth[weekOrder] = [];
			
			weeksInMonth[weekOrder][(from-1)%daysPerWeek] = date;
		}
		
		return weeksInMonth;
	}
	checkLocalStorage(date){
		if(window.localStorage[date]){
			reactSetState({history : window.localStorage[date]}); // use reactSetState to compatible calendar events with react-app
			$calendarContainer.click();// to exit from calendar to main UI
		}
		else {
			alert('Пусто!')
		}
	}
	prevMonth(){
		var {currentMonth, currentYear} = this.state;
		--currentMonth;
		if(currentMonth < 0){
			currentMonth = 11;
			--currentYear;
		}
		this.setState({currentMonth, currentYear});
		this.renderWeeks(currentYear, currentMonth);
		
		
	};
	nextMonth(){
		var {currentMonth, currentYear} = this.state;
		++currentMonth;
		if(currentMonth > 11){
			currentMonth = 0;
			++currentYear;
		}
		this.setState({currentMonth, currentYear});
		this.renderWeeks(currentYear, currentMonth);
		
		
	};
	hideCalendar(e){
		e.stopPropagation();
		if(e.currentTarget == e.target){
			$(e.currentTarget).fadeOut();
		}
		
	}
	render(){
		var daysAbbr = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
		var day = ["Понедельник", "Вторник", "Среда", "Черверг", "Пятница", "Суббота", "Воскресенье"];
		var now = new Date();
		this.buildCalendar(now.getFullYear(), now.getMonth());
		return (<div className="container" style={{display: "none"}} onClick={this.hideCalendar.bind(this)}>
			<div className="calendWrap">
				<div className="todayWrap">
				<span className="todayDateBlock">
					{now.getDate()}
				</span>
					<span className="todayBlock">
					{day[this.dayPos(now.getFullYear(), now.getMonth(), now.getDate())-1].toUpperCase()}
				</span>
				</div>
				<div className="monthContainer">
					<div className="monthWrap">
					<span className="prevMonth" onClick={this.prevMonth.bind(this)}>
						{"<"}
					</span>
					<span className="monthLine">
						{monthsArr[this.state.currentMonth]}
					</span>
						<span className="nextMonth" onClick={this.nextMonth.bind(this)}>
						{">"}
					</span>
					</div>
					<div className="daysWrap">
						<div className="days">
							<table className="daysNames">
								<thead>
								<tr>
									{daysAbbr.map(function(day, i){
										return <td key={i}>{day}</td>
									})}
								</tr>
								</thead>
								<tbody>
									{this.state.weeks}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		
		</div>)
	}
}

	/*Calendar.prototype.createCalendar = function(parent){
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
			

			document.querySelector('.monthLine').innerHTML = month.month.toUpperCase();
			
			let startFrom = 1;
			let firstDayPosition = dayPos(year, numberOfMonth, startFrom);
			let weeks = new Array(Math.ceil((month.days+firstDayPosition)/7));
			let daysInThisMonth = month.days;

			for(let weekIndex = 0; weeks.length > weekIndex; weekIndex++){
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
	Calendar.prototype.
	Calendar.prototype.nextMonth = function(newCalendar){
		++this.numberOfMonth;
		if(this.numberOfMonth > 11){
			this.numberOfMonth = 0;
			++this.year;
		}
		this.createCalendar()(this.months, this.year, this.numberOfMonth, reactSetStateFunction);
	};*/

export default Calendar;


		