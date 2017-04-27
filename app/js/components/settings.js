import React from 'react';

class Settings extends React.Component {
	constructor (props){
		super(props);
		this.state = {
			
		}
	}
	
	
	render(){
		return (<div className="content-tool__settings">
			<div className="content-tool__settings-default-path">
				<label htmlFor="default-path" className="content-tool__settings-label">
					Папка по умолчанию:
				</label>
				<input id="default-path" className="content-tool__settings-input"/>
			</div>
			</div>)
	}
	
}
export default Settings;
