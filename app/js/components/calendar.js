import {address} from '../const/constants';

var monthsArr = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

class Calendar extends React.Component {
	constructor(props){
		super(props);
		var now = new Date();
		this.state = {
			currentMonth: now.getMonth(),
			currentDate: now.getDate(),
			currentYear: now.getFullYear(),
			allHistory: {}
		};
		
	}
	componentDidMount(){
		var {currentMonth, currentYear} = this.state;
		var self = this;
		$.ajax(this._GET_historyAjaxSettings())
			.done(function(historyObj){
				self.setState({allHistory: historyObj})
			})
			.then(function(){
                self.renderWeeks(currentYear, currentMonth);
                self.setHistoryHandler();
			});
		this.setVisibleHandlers();

	}
    _GET_historyAjaxSettings(){
        return {
            type: 'get',
            url: address.history,
            dataType: 'json'
        }
    }
	daysInMonth (_, nthMonth) {
        ++nthMonth;
		return (28 + (nthMonth + Math.floor(nthMonth/8)) % 2 + 2 % nthMonth + 2 * Math.floor(1/nthMonth));
	}
	dayPos(year, month, day){
		var dayPosition = new Date(year, month, day);
		dayPosition = dayPosition.getDay();
		dayPosition = dayPosition === 0 ? 7 : dayPosition;
		return dayPosition;
	}
	renderWeeks(year, month){
        var self,
			weeks;

        weeks = this.buildCalendar(year, month);
        self = this;
		weeks = weeks.map(function (week, indx) {
				return (<tr key={indx}>
					{(function(){
						var dayRow =[];
						for(let i = 0; i < week.length; i++){
							dayRow.push(<td key={`${indx}-${i}`}><a style = {self.existLocalData(week[i]) ? {color: 'green'} : null}>{week[i]}</a></td>)
						}
						return dayRow;
					})()}
				</tr>)
			});
		this.setState({weeks});

	}
	setHistoryHandler(){
		var self = this;
		$('.daysNames tbody td').on('click', function(){
			var $td,
				date,
				positions;

			var {currentMonth, currentYear, allHistory} = self.state;

			$td = $(this);
			date = currentYear + '-' + currentMonth + '-' + $td.text();
			positions = allHistory[date];
			if(positions)
				$(document).trigger('daySelect', positions.join(' '))

		});
	}
	setVisibleHandlers(){
		var self = this;
		$(document).on('hide_calendar', function(e){
			$(self.container).fadeOut();
		});
        $(document).on('show_calendar', function(e){
            $('body').css({"min-height" : "570px"});
            $(self.container).fadeIn();
        });
	}
	buildCalendar(year, monthIndex){

		let months,
            weeksInMonth,
            daysInCurrMonth,
            firstDayPositionInWeek;

        months = monthsArr.map(this.daysInMonth);
		months[1] = year % 4==0 ? 29 : 28;
		daysInCurrMonth = months[monthIndex];
		firstDayPositionInWeek = this.dayPos(year, monthIndex, 1);
		weeksInMonth = new Array(Math.ceil((daysInCurrMonth + firstDayPositionInWeek)/7));

		for(let from = firstDayPositionInWeek, daysPerWeek = 7, date = 1; date <= daysInCurrMonth; from++, date++ ){
			let weekOrder = Math.ceil(from/daysPerWeek) - 1;
			if(!weeksInMonth[weekOrder])
				weeksInMonth[weekOrder] = [];

			weeksInMonth[weekOrder][(from-1)%daysPerWeek] = date;
		}

		return weeksInMonth;
	}
	existLocalData(date){
		var {currentMonth, currentYear, allHistory} = this.state;
		date = currentYear + '-' + currentMonth + '-' + date;
		if(allHistory[date]){
			return true
		}
	}
	prevMonth(){
		var {currentMonth, currentYear} = this.state;
		--currentMonth;
		if(currentMonth < 0){
			currentMonth = 11;
			--currentYear;
		}
		this.setState({currentYear, currentMonth}, ()=>{
            this.renderWeeks(currentYear, currentMonth);
		});



	};
	nextMonth(){
		var {currentMonth, currentYear} = this.state;
		++currentMonth;
		if(currentMonth > 11){
			currentMonth = 0;
			++currentYear;
		}
		this.setState({currentYear, currentMonth}, ()=>{
			console.log(this.state.currentMonth, this.state.currentYear);
            this.renderWeeks(currentYear, currentMonth);
        });


	};
	hideCalendar(e){
		e.stopPropagation();
		if(e.currentTarget == e.target){
			$(document).trigger('hide_calendar');
		}

	}
	render(){
		var now,
			daysArr,
			daysAbbr;


		now = new Date();
		daysAbbr = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
		daysArr = ["Понедельник", "Вторник", "Среда", "Черверг", "Пятница", "Суббота", "Воскресенье"];


		return (<div className="container" ref={(calendarContainer=>{this.container = calendarContainer})} style={{display: "none"}} onClick={this.hideCalendar.bind(this)}>
			<div className="calendWrap">
				<div className="todayWrap">
					<span className="todayDateBlock">
						{now.getDate()}
					</span>
					<span className="todayBlock">
						{daysArr[this.dayPos(now.getFullYear(), now.getMonth(), now.getDate())-1].toUpperCase()}
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
export default Calendar;


		