import {isChromeExtension} from '../const/constants';

class PositionList extends React.Component {
	constructor(props){
		super(props)
	}
    open(url){
        if(isChromeExtension){
            chrome.tabs.create({'url': url, active:false});
        }
        else{
            window.open(url);
        }

    }
	render(){
		var {found} = this.props;
		
		return (
			<div className={this.props.className}>
				<ol className="feeds">
					{found.map((position, i)=>(
						<li key={i}>
							<a href={position.url} onClick={(e)=>{e.preventDefault(); this.open(position.url)}}>{position.name}</a>
							<p>{`Отзывов: ${position.feedsQuantity}`}</p>
						</li>
					))}
				</ol>
			</div>
		);
	}
}

export default PositionList;
