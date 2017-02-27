
var defaultConf = requirejs.config({
    baseUrl: 'js', 
    context: 'default'
    
});
defaultConf(['require'], function(requirejs){
	requirejs(['jquery'],
		function($) {
			requirejs(['react', 'react-dom'], function(React, ReactDOM){
                    requirejs(['../components/wrapper'], function(wrapper){
                        ReactDOM.render(
                            wrapper,
                            document.querySelector('.contain')
                        );
                    })
                    
                }
			)
		}
	);
});
