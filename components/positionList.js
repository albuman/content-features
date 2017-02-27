define(['react'], function(React){
	var create = React.createElement;
	class FeedsList extends React.Component {
		constructor(props){
			super(props);
		}
		open(url){
			chrome.tabs.create({'url': url, active:false})
		}
		render(){
			var {found} = this.props; 
			if(found.length > 0){
				var text = create('textarea', {value: found.reduce((acum, position)=>(acum += position.exist ? `${position.partNumber} ${position.name} \n` : ''), '')}),
					textWrap = create('div', {className : 'toCop'}, text);
			}
			
			var list = create('ol', {className : 'checked'}, found.map((position, i)=>{
				var anchor = create('a', {href : position.url, onClick : ()=>{this.open(position.url)}}, `${position.partNumber} ${position.name}`),
					li = create('li', {key : i}, anchor);
				return li
			})),
				foundPosition = create('div', {className : this.props.className}, [list, textWrap]);
			return foundPosition
		}
	}
	return FeedsList
})