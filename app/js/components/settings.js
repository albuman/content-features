import {address} from '../const/constants';

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
			try{

				self.setState({path: _.assignIn({}, res)});
				self.setState({fetchedPath: _.assignIn({}, res)});
				
				
			}catch(e){
				console.error(e);
			}
			
		});
        document.addEventListener('click', function(evt){
            evt.stopPropagation();
            if(!self._$settings.contains(evt.target) &&  evt.target !== self._$settings){

                if(!self.isRelevantPaths()) {
                    $.ajax(self._POST_defPahsAjaxSettings(self.state.path))
                        .done(function () {
                            self.setState({fetchedPath: _.assignIn({}, self.state.path)})
                        })
                }
                self.setState({visibleSettings: false});
            }

        });
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
			url: address.defaultPathsUrl,
			dataType: 'json'
		}
	}
	_POST_defPahsAjaxSettings(data){
		return {
			type: 'post',
			url: address.local,
			data: JSON.stringify({path: data}),
			contentType: 'application/json'
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
			return false;
		}
		return true;
	}
	
    toggleSettings(e){
        var {visibleSettings} = this.state;

        if(visibleSettings){
        	this.setState({visibleSettings: false})
        } else {

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

		return (<div className="content-tool__settings" ref={(settings=>{this._$settings = settings})}>
		<div className="content-tool__settings-icon" onClick={this.toggleSettings.bind(this)}>

		</div>
			<div className="content-tool__settings-sidebar"
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
			<div className="content-tool__settings-row">
				<div className="content-tool__settings-show-history">
					<button className="content-tool__settings-history-button">
                        {"Показать историю"}
					</button>
				</div>
			</div>
			</div>
		</div>)
	}
	
}
export default Settings;
