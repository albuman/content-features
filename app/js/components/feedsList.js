import React from 'react';

class PositionList extends React.Component {
	constructor(props){
		super(props)
	}
	open(url){
		chrome.tabs.create({'url': url, active:false})
	}
	render(){
		var {found} = this.props;
		
		return (
			<div className={this.props.className}>
				<ol className="feeds">
					{found.map((position, i)=>(
						<li key={i}>
							<a href={position.url} onClick={()=>{this.open(position.url)}}>{position.name}</a>
							<p>{`Отзывов: ${position.feedsQuantity}`}</p>
						</li>
					))}
				</ol>
			</div>
		);
	}
}

export default PositionList;
