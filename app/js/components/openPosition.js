import  {isChromeExtension} from '../const/constants';
class OpenTabs extends React.Component {
	constructor(props){
		super(props)
	}
	componentWillReceiveProps(nextProps){
		var wHeight = nextProps.wHeight;
		if(this.openTab.offsetTop > wHeight - 50){
			$(this.openTab).addClass('fixed')
		}
		
	}
	openTabs(){
		var openFunc = function(url){
			isChromeExtension ? chrome.tabs.create({'url': url, active:false}) : window.open(url, '_blank');
		};
		
		this.props.found.forEach(position=>{
			openFunc(position.url)
		})
	}
	render(){
		return (
			<div className="input-place__open-positions" ref={(openTab=>{this.openTab = openTab})}>
				<a className='input-place__open-button' onClick={this.openTabs.bind(this)}>Открыть</a>
			</div>
		)
	}
}
export default OpenTabs;