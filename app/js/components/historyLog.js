import {monthsArr} from '../const/constants';

class HistoryLog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isVisible: false
        }
    }
    componentDidMount(){
        var self = this;
        //event listeners

        $(document).on('show_log', function(){
            self.setState({isVisible: true});

        });

        $(document).on('hide_log', function(){
            self.setState({isVisible: false});
        });

        window.addEventListener('scroll', function(){
            if(document.body.scrollTop > self._$historyLog.offsetTop){
                self._$closeButton.style.position =  'fixed'
            } else {
                self._$closeButton.style.position =  'absolute'
            }
        });

        $(self._$closeButton).on('click', function(e){
            e.stopPropagation();
            self.setState({isVisible: false});
        });


    }
    getSortedDates(log){
        var dates,
            sorted;

        dates = Object.keys(log).sort();
        sorted = {};
        dates.forEach(function(date){
            var oldDate;

            oldDate = date.split('-');
            var [year, month, day] = oldDate;

            if(year && month && day){
                if(!sorted[year]){
                    sorted[year] = {};
                }
                if(!sorted[year][month]){
                    sorted[year][month] = [];
                }
                sorted[year][month].push(day);
            }
        });
        sorted = Object.keys(sorted).map(function(year){
            return Object.keys(sorted[year]).map(function(month){
                return sorted[year][month].sort(function(a ,b){
                    return +a > +b;
                }).map(function(day){
                    return {
                        verbal: `${year} ${monthsArr[month]} ${day}`,
                        numeral: `${year}-${month}-${day}`
                    }
                })
            })
        }).reduce(function(acum, arr){
            return acum.concat(arr);
        }, []).reduce(function(acum, arr){
            return acum.concat(arr);
        }, []);

        return sorted;
    }

    createLogRows(log){
        var sortedDays = this.getSortedDates(log);

        return sortedDays.map(function(date, i){
            return (
                <tr className="log-row" key={`${i}-${date.numeral}`}>
                    <td className="log-date">
                        {date.verbal}
                    </td>
                    <td className="log-value">
                        {log[date.numeral].join(' ')}
                    </td>
                </tr>
            )
        })
    }

    render(){
        var {log} = this.props;
        var {isVisible} = this.state;
        return (
            <div className="content-tool__history-log" ref={historyLog=>{this._$historyLog = historyLog}}
                 style={isVisible ? {display: 'block'}: {display: 'none'}}>
                <span className="content-tool__history-log-close" ref={closeButton=>{this._$closeButton = closeButton}}>
                    X
                </span>
                <table style={{width: '100%', margin: 'auto'}}>
                    <thead>
                        <tr>
                           <td>
                               Дата:
                           </td>
                           <td>
                               Позиции:
                           </td>

                        </tr>

                    </thead>
                    <tbody>
                        {this.createLogRows(log)}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default HistoryLog;