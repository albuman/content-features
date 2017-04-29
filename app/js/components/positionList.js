import {isChromeExtension} from '../const/constants';

class FeedsList extends React.Component {
	constructor(props){
		super(props);
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
		return (<div className={this.props.className}>
			<ol className='checked'>
				{found.map((position, i)=>(
					<li key={i}>
						<a href={position.url} onClick={(e)=>{e.preventDefault();this.open(position.url)}}>
							{`${position.partNumber} ${position.name}`}
						</a>
					</li>
				))}
			</ol>
			{found.length ? <div className="checked__raw-text">
				<textarea value={
					found.reduce((acum, position)=>(
						acum += position.exist ? `${position.partNumber} ${position.name} \n` : '')
					, '')
				}/>
				</div> : null}
		</div>)
	}
}
	
export default FeedsList;
