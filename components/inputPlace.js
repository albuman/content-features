define(['react', 'feeds', 'findPosition', '../components/feedsList', '../components/positionList'], 
	function(React, feeds, findPosition, feedsList, positionList){
	const create = React.createElement;
	class InputWrapper extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				type: 'text', // ТИП ИНПУТА, ДЛЯ ПОИСКА ПОЗИЦИЙ - TEXT, ДЛЯ ОТЗЫВОВ - NUMBER
				found: [], // МАССИВ С НАЙДЕННЫМИ ПОЗИЦИЯМИ
				feedsQuantity : 10, //КОЛИЧЕСТВО ОТЗЫВОВ ДЛЯ ПОИСКА
				actionHandler : this.findPositions, // ФУНКЦИЯ ВЫЗЫВАЕМАЯ ПО УМОЛЧАНИЮ ПРИ НАЖАТИИ КНОПКИ "НАЙТИ" 
				actionContainer: positionList, // КОНТЕЙНЕР ДЛЯ РАЗМЕЩЕНИЯ НАЙДЕНЫХ ПОЗИЦИЙ/ОТЗЫВОВ, ПО УМОЛЧАНИЮ ДЛЯ ПОЗИЦИЙ 
				inputValue : '', // ЗНАЧЕНИЕ ДЛЯ ПОИСКА, (КОДЫ ПОЗИЦИЙ/ПАРТНАМБЕРЫ/КОЛИЧЕСТВО ОТЗЫВОВ)
				fetching : false // ОБОЗНАЧАЕТ СОСТОЯНИЕ ПОИСКА, ЕСЛИ TRUE - ЗНАЧИТ В ПРОЦЕССЕ ПОИСКА, БЛОКИРУЕТСЯ UI 
			}
		}
		componentWillReceiveProps(nextProp){
			var {action, history} = nextProp;
			switch (action) {
				case 'check': // ПЕРЕКЛЮЧАЕТ СОСТОЯНИЕ НА ПОИСК ПОЗИЦИЙ
					this.setState({
						type : 'text',
						found : [], // ОЧИЩАЕМ МАССИВ С СУЩЕСТВУЮЩИМИ ПОЗИЦИЯМИ
						actionHandler : this.findPositions, 
						actionContainer : positionList,
						inputValue : '' // ОЧИЩАЕМ ИНПУТ СО СТАРЫМ ЗНАЧЕНИЕМ
					});
					break
				case 'feeds': // ПЕРЕКЛЮЧАЕТ СОСТОЯНИЕ НА ПОИСК ОТЗЫВОВ
					this.setState({
						type : 'number',
						found : [], // ОЧИЩАЕМ МАССИВ С СУЩЕСТВУЮЩИМИ ПОЗИЦИЯМИ
						actionHandler : this.findFeedbacks,
						actionContainer : feedsList,
						inputValue : '' // ОЧИЩАЕМ ИНПУТ СО СТАРЫМ ЗНАЧЕНИЕМ
					});
					break
				default:
					console.log(action)
					break
			};
			if(history){
				this.setState({inputValue : history}) // СТАВИМ В СОСТОЯНИЕ ПЕРЕДАННОЕ ЗНАЧЕНИЕ ИЗ КАЛЕНДАРЯ
			}
			

		}
		inputHandler(e){
			this.setState({inputValue: e.target.value}) // СТАВИМ В СОСТОЯНИЕ ЗНАЧЕНИЕ ИНПУТА ДЛЯ ПОИСКА
			console.log(e.target.value)
		}
		findFeedbacks(value){
			this.setState({found : [], fetching : true}); // ЧИСТИМ СТАРЫЕ ПОЗИЦИИ / ПЕРЕКЛЮЧАЕМ В ПРОЦЕСС ПОИСКА ОЗЫВОВ И БЛОКИРУЕМ UI
			(function find(value){
				var {found, feedsQuantity} = this.state; // ДЕСТРУКТУРИЗАЦИЯ ОБЬЕКТА
				feeds.then(func=>(func(value))) // ЦЕПОЧКА ПРОМИСОВ )))
					 .then(position=>{
					 	var newFound = this.state.found.concat(position); // НОВЫЕ НАЙДЕННЫЕ ПОЗИЦИИ СОЕДИНЯЕМ СО СТАРЫМИ
					 	this.setState({
					 		found : newFound 
					 	})
					 	return newFound // МЕНЯЕМ СОСТОЯНИЕ НАЙДЕННЫХ ПОЗИЦИЙ НА НОВЫЙ МАСИВ 
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
				fetch(chrome.extension.getURL('../data/dir.txt'))
				.then(response=>{
					if(response.ok) // ЕСЛИ URL ПРАВИЛЬНЫЙ И ФАЙЛ СУЩЕСТВУЕТ - ПОЛУЧИМ RESPONSE.OK = TRUE
						return response.text()
					else {
						return new Error(`Can't load file ${response.url}.`)
					}
				})
				.then(text=>{
					this.setState({inputValue : text.replace(/\s/g, ' ')}) // СТАВИМ В ИНПУТ ЗНАЧЕНИЕ ФАЙЛА ДЛЯ НАГЛЯДНОСТИ ИСПОЛЬЗУЯ РЕГ. ВЫРАЖЕНИЯ ДЛЯ ЗАМЕНЫ ЛЮБОГО ПРОБЕЛЬНОГО СИМВОЛА
					return check.call(this, text)
					}) // ВЫЗЫВАЕМ ФУНКЦИЮ CHECK С СОДЕРЖИМЫМ ФАЙЛА В КАЧЕСТВЕ АВРГУМЕНТА, т.к. ФУНКЦИЯ ОБЬЯВЛЕНА НЕ КАК МЕТОД, ЕЕ КОНТЕКСТ - WINDOW, А НАМ НУЖНО ОБЬЕКТ СОЗДАННЫЙ ДАННЫМ КОНСТРУКТОРОМ
			} else {
				check.call(this, positions) // В ПРОТИВНОМ СЛУЧАЕ ЕСЛИ МЫ ВВЕЛИ ЧТО-НИБУДЬ В ИНПУТ - ВЫЗЫВАЕТ С ЭТИМ ЗНАЧЕНИЕМ
			}
			function check(positions){ // А ДАЛЬШЕ МНЕ УЖЕ В ПАДЛУ РАСПИСЫВАТЬ... КОЛЯН УЖЕ НЕ ПЕРВЫЙ РАЗ ДОГАДЫВАЕТСЯ ))) 
				var positionArr = positions.split(/\s/).filter(code=>(code.length > 2));
				var now = new Date();
				var date = now.getDate() + "-" + now.getMonth() + "-" + now.getFullYear();
				window.localStorage.setItem(date, positionArr.join(' '));
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
			var input = create('input', {
					id : 'area', 
					type: this.state.type, 
					placeholder: 'Коды товаров', 
					onChange: this.inputHandler.bind(this), 
					onKeyDown : this.enterPress(),
					value : this.state.inputValue
				}, null),

				buttonCheck = create('a', {
					id : 'check', 
					onClick: this.state.actionHandler.bind(this, this.state.inputValue)
				}, 'Найти'),
				InputWrap = create('div', {className: 'checkInfo'}, [input, buttonCheck]),
				openButton = create('a', {className: 'openTabs', onClick : this.openTabs.bind(this)}, 'Открыть'),
				mask = create('div', {className : 'mask'}), // МАСКА ДЛЯ БЛОКИРОВКИ UI В ПРОЦЕССЕ ПОИСКА ОТЗЫВОВ ИЛИ ПОЗИЦЫЙ

				genWrapper = create('div', {id: 'inner'}, 
					[
						InputWrap, 
						create(this.state.actionContainer, {found: this.state.found, className : 'positionContainer'}), 
						openButton, this.state.fetching ? mask : null
					]);
			return genWrapper
		}
	}
	return InputWrapper
})