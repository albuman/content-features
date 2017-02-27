define(['react'], function(React){
	var create = React.createElement;
	class PositionList extends React.Component {
		constructor(props){
			super(props)
		}
		open(url){
			chrome.tabs.create({'url': url, active:false})
		}
		render(){
			var {found} = this.props;
			var list = create('ol', {className : 'feeds'}, found.map((position, i)=>{
				var anchor = create('a', {href : position.url, onClick : ()=>{this.open(position.url)}}, position.name),
					quantity = create('p', null, `Отзывов: ${position.feedsQuantity}`),
					li = create('li', {key : i}, [anchor, quantity]);
				return li

			})),
				foundPosition = create('div', {className : this.props.className}, list);
			return foundPosition
		}
	}
	return PositionList
})