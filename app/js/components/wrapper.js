import InputWrapper from './inputPlace';
import Calendar from './calendar';
import Settings from './settings';
import {actionTypes} from '../const/constants';



class Wrapper extends React.Component {
	constructor(props){
		super(props);
		this.state  = {
			action : actionTypes.findPosition,//default action upon start application render
		}
	}
	handleChange(action){
		var self = this;
		Object.keys(actionTypes).map(function(act_type){
			if(actionTypes[act_type] == action){
				self.setState({
					action: action
				});
			}
		})
	}
	showCalendar(){
		$(document).trigger('show_calendar');
	}

	render() {
		var {action} = this.state;
		var {findPosition, findFeedbacks} = actionTypes;
		return (<div className="content-tool">
			<div className='content-tool__trigger'>
				<label htmlFor={findPosition} key="1" className={action == findPosition ? 'content-tool__trigger--active' : ''}>
					<span>Позиции</span>
					<input type="radio" id={findPosition} className="content-tool__trigger__input" name="actionType" onChange={this.handleChange.bind(this, findPosition)}/>
				</label>
				<label htmlFor={findFeedbacks} key="2" className={action == findFeedbacks ? 'content-tool__trigger--active' : ''}>
					<span>Отзывы</span>
					<input type='radio' id={findFeedbacks} className="content-tool__trigger__input" name='actionType' onChange={this.handleChange.bind(this, findFeedbacks)}/>
				</label>
			</div>
			<InputWrapper action={action}/>
			<div className='content-tool__history' onClick={this.showCalendar.bind(this)}>
				
			</div>
			<Calendar/>
			<Settings/>
		</div>)
	}
}
export default Wrapper;

