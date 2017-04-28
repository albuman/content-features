import React from 'react';
import {address} from '../const/constants';
import jQuery from 'jquery';

var $ = jQuery;
var defaults= {
	folder: "defaultFolder",
	drive: "defaultDrive"
};

class Settings extends React.Component {
	constructor (props){
		super(props);
		this.state = {
            visibleSettings: false,
			path: {
            	folder:'', //default value of input.
				drive: '' //default value of input.
			},
			
		}
	}
	componentDidMount(){
		var self = this;
		$.ajax(this._GET_defPahsAjaxSettings()).done(function (res) {
			var data;
			try{
				data = JSON.parse(res);
				
				self.setState({path: new Object(data.path)});
				self.setState({fetchedPath: new Object(data.path)});
				
				
			}catch(e){
				console.error(e)
			}
			
		})
	}
	
	_getFetchedFolder(){
		return this.state.fetchedPath.folder;
	}
	
	_getFetchedDrive(){
		return this.state.fetchedPath.drive;
	}
	_GET_defPahsAjaxSettings(){
		return {
			type: 'get',
			url: address.defaultPathsUrl
		}
	}
	_POST_defPahsAjaxSettings(data){
		return {
			type: 'post',
			url: address.defaultPathsUrl,
			data: JSON.stringify(data)
		}
	}
	isRelevantPaths(){
		var savedDrive,
			savedFolder,
			existingPath,
			existingFolder,
			existingDrive;
		
		savedFolder = this._getFetchedFolder();
		savedDrive = this._getFetchedDrive();
		
		existingPath  = this.state.path;
		existingFolder = existingPath.folder;
		existingDrive = existingPath.drive;
		
		if((savedDrive !== existingDrive) || (existingFolder !== savedFolder)){
			return false
		}
		
	}
	
    toggleSettings(e){
        var {visibleSettings} = this.state;
        var self;
	
		
		self = this;
        if(visibleSettings){
        	this.setState({visibleSettings: false})
        } else {
            document.addEventListener('click', function(evt){
                
            	if(!self._$settings.contains(evt.target) &&  evt.target !== self._$settings){
					
					if(!self.isRelevantPaths()){
						self._POST_defPahsAjaxSettings(self.state.path);
					}
					self.setState({visibleSettings: false});
				}
					
            }, true);
            this.setState({visibleSettings: true})
        }
    }
	saveDefaultFolder(){
    	var {path} = this.state;
    	path.folder = this.defaultFolder.value;
    	this.setState({path: path});
	}
	saveDefaultPositionDrive(){
		var {path} = this.state;
		path.drive = this.defaultDrive.value;
		this.setState({path: path});
	}
	render(){
        var {visibleSettings, path} = this.state;
		return (<div className="content-tool__settings">
		<div className="content-tool__settings-icon" onClick={this.toggleSettings.bind(this)}>

		</div>
			<div className="content-tool__settings-sidebar" ref={(settings=>{this._$settings = settings})}
				 style={visibleSettings ? {transform: "translateX(0)"} : {transform: "translateX(100%)"}}>
			<div className="content-tool__settings-row">
				<label htmlFor="default-path" className="content-tool__settings-label">
					Рабочая папка:
				</label>
				<input id="default-path" className="content-tool__settings-input" ref={defpath=>{this.defaultFolder = defpath}}
					   value={path.folder} onInput={this.saveDefaultFolder.bind(this)}/>
			</div>
			<div className="content-tool__settings-row">
				<label htmlFor="default-position-drive" className="content-tool__settings-label">
					Диск с позициями:
				</label>
				<input id="default-position-drive" className="content-tool__settings-input" ref={defdrive=>{this.defaultDrive = defdrive}}
					   value={path.drive} onInput={this.saveDefaultPositionDrive.bind(this)}/>
			</div>
			</div>
		</div>)
	}
	
}
export default Settings;
