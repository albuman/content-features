import React from 'react';
import jQuery from 'jquery'

var $ = jQuery;

class Settings extends React.Component {
	constructor (props){
		super(props);
		this.state = {
            visibleSettings: false
		}
	}
	componentDidMount(){
		var path = window.localStorage.getItem("defaultFolder");
		if(path){
			this.defaultPath.value = path;
		}
	}
    showSettings(e){
        var {visibleSettings} = this.state;
        var self = this;
        if(visibleSettings){
            this.setState({visibleSettings: false})
        } else {
            document.addEventListener('click', function(evt){
                if(!self.settings.contains(evt.target) &&  evt.target !== self.settings)
                    self.setState({visibleSettings: false})
            }, true);
            this.setState({visibleSettings: true})
        }
    }
	saveDefaultPath(){
    	window.localStorage.setItem("defaultFolder", this.defaultPath.value)
	}
	render(){
        var {visibleSettings} = this.state;
		return (<div className="content-tool__settings">
		<div className="content-tool__settings-icon" onClick={this.showSettings.bind(this)}>

		</div>
			<div className="content-tool__settings-sidebar" ref={(settings=>{this.settings = settings})}
				 style={visibleSettings ? {transform: "translateX(0)"} : {transform: "translateX(100%)"}}>
			<div className="content-tool__settings-default-path">
				<label htmlFor="default-path" className="content-tool__settings-label">
					Папка по умолчанию:
				</label>
				<input id="default-path" className="content-tool__settings-input" ref={defpath=>{this.defaultPath = defpath}} onInput={this.saveDefaultPath.bind(this)}/>
			</div>
			</div>
		</div>)
	}
	
}
export default Settings;
