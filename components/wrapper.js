define(['react', '../components/inputPlace', 'calendar'], function(React, inputWrapper, calendar){
		var create =  React.createElement;
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
			  			})
			  			return;
			  		case 'feeds':
			  			this.setState({
			  				action: 'feeds', 
			  				history : ''
			  			})
			  			return;
			  		default :
			  			console.log('default')	
			  			return;

			  	}
			  }
			  showCalendar(){
			  	var self = this;
			  	return function(e){
			  		e.stopPropagation();
            		document.body.style.cssText = "min-height: 570px;"
	            	var days = calendar.createCalendar(document.body)
	            		(calendar.months, calendar.year, calendar.numberOfMonth, self.setState.bind(self));
			  	}
			  	
			  }
			  render() {
			  	var {action, history} = this.state;
			    var check = create('input', {type: 'radio', id : 'check', name: 'actionType', onChange: this.handleChange.bind(this, 'check')}, null),
			    	feeds = create('input', {type: 'radio', id : 'feeds', name: 'actionType', onChange: this.handleChange.bind(this, 'feeds')}, null),
			    	spanCheck = create('span', {}, 'Позиции'),
			    	labelForCheck = create('label', {htmlFor: 'check', key : 1, className : action == 'check' ? 'active' : ''}, [spanCheck, check]),
			    	spanFeeds = create('span', {}, 'Отзывы'),
			    	labelForFeeds = create('label', {htmlFor: 'feeds', key : 2, className : action == 'feeds' ? 'active' : ''}, [spanFeeds, feeds]),
			    	trigger = create('div', {className: 'trigger'}, [labelForCheck, labelForFeeds]),
			    	calendarLogo = create('img', {src: '../img/calendar.png'}, null),
			    	calendarWrapper = create('div', {className : 'history', onClick : this.showCalendar()}, calendarLogo),
			    	container = create('div', 
				    	{
				    		className: this.props.className
				    	}, 
				    	[
					    	trigger, 
					    	create(inputWrapper, 
						    	{
						    		action: this.state.action, 
						    		history : this.state.history
						    	}), 
				    		calendarWrapper
				    	]);
			    
			    return container;


			  }
			}
		return create(Wrapper, {className: 'wrap'}, null)
})

