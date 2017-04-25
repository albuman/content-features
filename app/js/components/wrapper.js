import React from 'react';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';
import InputWrapper from './inputPlace';
import Calendar from './calendar';

var $ = jQuery;
class Wrapper extends React.Component {
	constructor(props){
		super(props);
		this.state  = {
			action : 'check',
			history : ''

		}
	}
	componentWillMount(){
		console.log('Loading');

	}
	componentDidMount(){
		console.log('Loaded')
	}
	handleChange(action){
		switch (action) {
			case 'check':
				this.setState({
					action: 'check',
				});
				return;
			case 'feeds':
				this.setState({
					action: 'feeds',
					history : ''
				});
				return;
			default :
				console.log('default');
				return;

		}
	}
	showCalendar(e){
		e.stopPropagation();
		$('body').css({"min-height" : "570px"});
		$('.container').fadeIn()
		
	}
	render() {
		var {action, history} = this.state;
		
		return (<div className={this.props.className}>
			<div className='trigger'>
				<label htmlFor='check' key="1" className={action == 'check' ? 'active' : ''}>
					<span>Позиции</span>
					<input type="radio" id="check" name="actionType" onChange={this.handleChange.bind(this, 'check')}/>
				</label>
				<label htmlFor='feeds' key="2" className={ action == 'feeds' ? 'active' : ''}>
					<span>Отзывы</span>
					<input type='radio' id='feeds' name='actionType' onChange={this.handleChange.bind(this, 'feeds')}/>
				</label>
			</div>
			<InputWrapper action={action} history={history} />
			<div className='history' onClick={this.showCalendar}>
				<img src="/app/img/calendar.png"/>
			</div>
			<div className="calendar">
				<Calendar/>
			</div>
		</div>)
	}
}
export default Wrapper;

