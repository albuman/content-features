import feeds from './feeds';
import findPosition from './findPosition';
import feedsList from './feedsList';
import positionList from './positionList';
import {actionTypes, feedsQuantity, address} from '../const/constants';

class InputWrapper extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			type: 'text', // ТИП ИНПУТА, ДЛЯ ПОИСКА ПОЗИЦИЙ - TEXT, ДЛЯ ОТЗЫВОВ - NUMBER
			found: [], // МАССИВ С НАЙДЕННЫМИ ПОЗИЦИЯМИ
			feedsQuantity : feedsQuantity, //КОЛИЧЕСТВО ОТЗЫВОВ ДЛЯ ПОИСКА
			actionHandler : this.findPositions, // ФУНКЦИЯ ВЫЗЫВАЕМАЯ ПО УМОЛЧАНИЮ ПРИ НАЖАТИИ КНОПКИ "НАЙТИ"
			actionContainer: positionList, // КОНТЕЙНЕР ДЛЯ РАЗМЕЩЕНИЯ НАЙДЕНЫХ ПОЗИЦИЙ/ОТЗЫВОВ, ПО УМОЛЧАНИЮ ДЛЯ ПОЗИЦИЙ
			inputValue : '', // ЗНАЧЕНИЕ ДЛЯ ПОИСКА, (КОДЫ ПОЗИЦИЙ/ПАРТНАМБЕРЫ/КОЛИЧЕСТВО ОТЗЫВОВ)
			fetching : false // ОБОЗНАЧАЕТ СОСТОЯНИЕ ПОИСКА, ЕСЛИ TRUE - ЗНАЧИТ В ПРОЦЕССЕ ПОИСКА, БЛОКИРУЕТСЯ UI
		}
	}
	componentDidMount(){
        var self = this;
		$(document).on('daySelect', function(e, position){
        	self.setState({inputValue: position});
        	$(this).trigger('hide_calendar');
        	console.log($(this))
		})
	}

	componentWillReceiveProps(nextProp) {
        this.toggleState(nextProp);
    }

	toggleState(state){
		var newState = {};
		var {action} = state;
		var {findPosition, findFeedbacks} = actionTypes;
		
        switch (action) {
            case findPosition: // ПЕРЕКЛЮЧАЕТ СОСТОЯНИЕ НА ПОИСК ПОЗИЦИЙ
                newState.type = 'text';
            	newState.actionHandler = this.findPositions;
            	newState.actionContainer = positionList;
            	break;

            case findFeedbacks: // ПЕРЕКЛЮЧАЕТ СОСТОЯНИЕ НА ПОИСК ОТЗЫВОВ
                newState.type = 'number';
                newState.actionHandler = this.findFeedbacks;
                newState.actionContainer = feedsList;
                break;

            default:
            	break;
        }
        newState.found = [];// ОЧИЩАЕМ МАССИВ С СУЩЕСТВУЮЩИМИ ПОЗИЦИЯМИ
        newState.inputValue = '';// ОЧИЩАЕМ ИНПУТ СО СТАРЫМ ЗНАЧЕНИЕМ
        this.setState(newState);

	}
	inputHandler(e){
		this.setState({inputValue: e.target.value}); // СТАВИМ В СОСТОЯНИЕ ЗНАЧЕНИЕ ИНПУТА ДЛЯ ПОИСКА
	}
	findFeedbacks(value){
		this.setState({found : [], fetching : true}); // ЧИСТИМ СТАРЫЕ ПОЗИЦИИ / ПЕРЕКЛЮЧАЕМ В ПРОЦЕСС ПОИСКА ОЗЫВОВ И БЛОКИРУЕМ UI
		(function find(value){
			var {found, feedsQuantity} = this.state; // ДЕСТРУКТУРИЗАЦИЯ ОБЬЕКТА
			feeds.then(func=>(func(value))) // ЦЕПОЧКА ПРОМИСОВ )))
				 .then(position=>{
				 	var newFound = found.concat(position); // НОВЫЕ НАЙДЕННЫЕ ПОЗИЦИИ СОЕДИНЯЕМ СО СТАРЫМИ
				 	this.setState({
				 		found : newFound
				 	});
				 	return newFound; // МЕНЯЕМ СОСТОЯНИЕ НАЙДЕННЫХ ПОЗИЦИЙ НА НОВЫЙ МАСИВ
				 })
				 .then((arr)=>{
				 	if(arr.length < feedsQuantity){ // ЕСЛИ КОЛИЧЕСТВО НАЙДЕННЫХ ПОЗИЦИЙ МЕНЬШЕ ЧЕМ НАМ НАДО - РЕКУРСИВНО ВЫЗЫВАЕМ СНОВА СЕБЯ (ФУНКЦИЮ FIND)
						find.call(this, value)
					} else { // ЕСЛИ ПОЗИЦИЙ ДОСТАТОЧНОЕ УВЕДОМЛЯЕМ АЛЕРТОМ И РАЗБЛОКИРУЕМ UI
						alert('Done');
						this.setState({fetching : false});
					}
				 })
				 .catch(e=>(this.setState({fetching : false})))
		}).call(this, value)
		
		
	}
	findPositions(inputValue){
		this.setState({found : [], fetching : true}); // ЧИСТИМ СТАРЫЕ ПОЗИЦИИ / ПЕРЕКЛЮЧАЕМ В ПРОЦЕСС ПОИСКА ПОЗИЦИЙ И БЛОКИРУЕМ UI
		var positions = inputValue;
		if(positions.length < 1){ // ЕСЛИ ВВЕДЕНО МЕНЬШЕ 1-ГО ЗНАКА (НИЕГО НЕ ВВЕДЕНО) - ЗАПУСКАЕМ ПОИСК С ПОЗИЦИЯМИ В ФАЙЛЕ data/dir.txt
			$.get(address.lastChekout)
			.done(text=>{
				this.setState({inputValue : text.replace(/\s/g, ' ')}); // СТАВИМ В ИНПУТ ЗНАЧЕНИЕ ФАЙЛА ЗАМЕНЯЕМ ЛИШНИЕ ПРОБЕЛЫ НА ОДИН ПРОБЕЛ ИСПОЛЬЗУЯ РЕГ. ВЫРАЖЕНИЯ
				return check.call(this, text)
				}); // ВЫЗЫВАЕМ ФУНКЦИЮ CHECK С СОДЕРЖИМЫМ ФАЙЛА В КАЧЕСТВЕ АВРГУМЕНТА, т.к. ФУНКЦИЯ ОБЬЯВЛЕНА НЕ КАК МЕТОД, ЕЕ КОНТЕКСТ - WINDOW, А НАМ НУЖНО ОБЬЕКТ СОЗДАННЫЙ ДАННЫМ КОНСТРУКТОРОМ
		} else {
			check.call(this, positions); // В ПРОТИВНОМ СЛУЧАЕ ЕСЛИ МЫ ВВЕЛИ ЧТО-НИБУДЬ В ИНПУТ - ВЫЗЫВАЕТ С ЭТИМ ЗНАЧЕНИЕМ
		}
		function check(positions){ // А ДАЛЬШЕ МНЕ УЖЕ В ПАДЛУ РАСПИСЫВАТЬ... КОЛЯН УЖЕ НЕ ПЕРВЫЙ РАЗ ДОГАДЫВАЕТСЯ )))
			var positionArr = positions.split(/\s/).filter(code=>(code.length > 2));
			var now = new Date();
			var date = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate();
			$.ajax(this._POST_positionsAjaxSettings({[date]: positionArr}));
			var promiseChain = Promise.resolve();
			positionArr.forEach((pos , i)=>{
				promiseChain = promiseChain
					.then(()=>(findPosition(pos)))
					.then(position=>(this.setState({
						found : this.state.found.concat(position)
					})))
					.then(()=>{
						if(i == (positionArr.length - 1)){
							alert('Done');
							this.setState({fetching : false});
						}
					})
					.catch(e=>(this.setState({fetching : false})))
					
			})
		}
   	
	}
    _POST_positionsAjaxSettings(data){
        return {
            type: 'post',
            url: address.local,
            data: JSON.stringify({updateHistory: data}),
            contentType: 'application/json'
        }
    }
	enterPress(){ // НАЖАТИЕ НА ЕНТЕР ИМЕЕТ ТОТ ЖЕ ЭФФЕКТ ЧТО И КЛИК НА КНОПКУ "НАЙТИ"
		var self = this;
		return function(e){
			if(e.keyCode === 13){
				self.state.actionHandler.call(self, self.state.inputValue)
			}
		}
	}
	openTabs(){
		this.state.found.forEach(position=>{
			chrome.tabs.create({'url': position.url, active:false})
		})
	}
	render(){
		const ActionContainer = this.state.actionContainer;
		return (<div className="input-place">
				<div className="input-place__search">
					<input className = 'input-place__input' type={this.state.type} placeholder='Коды товаров' onChange={this.inputHandler.bind(this)} onKeyDown={this.enterPress()} value={this.state.inputValue}/>
					<a className="input-place__check-button" onClick={this.state.actionHandler.bind(this, this.state.inputValue)}>Найти</a>
				</div>
				<ActionContainer found={this.state.found} className='input-place__positions'/>
				<a className='input-place__open-button' onClick={this.openTabs.bind(this)}>Открыть</a>
				{this.state.fetching ? <div className="mask"></div> : null}
			</div>)
	}
	
}
export default InputWrapper;