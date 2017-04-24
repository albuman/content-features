import React from 'react';

	class FeedsList extends React.Component {
		constructor(props){
			super(props);
		}
		open(url){
			chrome.tabs.create({'url': url, active:false})
		}
		render(){
			var {found} = this.props; 
			return (<div className={this.props.className}>
				<ol className='checked'>
					{found.map((position, i)=>(
						<li key={i}>
							<a href={position.url} onClick={()=>{this.open(position.url)}}>
								{`${position.partNumber} ${position.name}`}
							</a>
						</li>
					))}
				</ol>
				{found.length ? <div className="toCop">
					<textarea>
						{found.reduce((acum, position)=>(acum += position.exist ? `${position.partNumber} ${position.name} \n` : ''), '')}
					</textarea>
					</div> : null}
			</div>)
		}
	}
	
export default FeedsList;
