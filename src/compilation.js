import React from 'react';
import ReactDOM from 'react-dom';
import materialUiStylesMuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import materialUiPaper from 'material-ui/Paper';

export const Root = props => {
  const bundledProps = {"components":[{"title":"Hello, world!","image":"https://upload.wikimedia.org/wikipedia/commons/d/d1/Pepperoni_pizza.jpg","caption":"This text is from content.json."}]};
  const mergedProps = Object.assign({}, bundledProps, props);
  const getProps = pointerFn => pointerFn(mergedProps);

  return (
    <div id="root" data-props={JSON.stringify(props)}>
      {
React.createElement(
  materialUiStylesMuiThemeProvider,
  {}, 
  
React.createElement(
  materialUiPaper,
  {"style": {"maxWidth":"45%","padding":"10px"}}, 
  
React.createElement(
  'h1',
  {"style": {"fontFamily":"sans-serif"}}, 
  getProps(function anonymous(obj
/**/) {
if (typeof(obj) !== 'undefined' &&
  typeof((obj = obj['components'])) !== 'undefined' &&
  typeof((obj = obj['0'])) !== 'undefined' &&
  typeof((obj = obj['title'])) !== 'undefined') {
return obj;
}
}).toString()
)
, 
React.createElement(
  'img',
  {"style": {"maxWidth":"100%","height":"auto"}, "src": getProps(function anonymous(obj
/**/) {
if (typeof(obj) !== 'undefined' &&
  typeof((obj = obj['components'])) !== 'undefined' &&
  typeof((obj = obj['0'])) !== 'undefined' &&
  typeof((obj = obj['image'])) !== 'undefined') {
return obj;
}
})}
  
)
, 
React.createElement(
  'p',
  {}, 
  `Some static text. `, getProps(function anonymous(obj
/**/) {
if (typeof(obj) !== 'undefined' &&
  typeof((obj = obj['components'])) !== 'undefined' &&
  typeof((obj = obj['0'])) !== 'undefined' &&
  typeof((obj = obj['caption'])) !== 'undefined') {
return obj;
}
}).toString(), ` More static text.`
)

)

)
}
    </div>
  );
};
export default function render(element) {
  const root = document.getElementById('root');
  const props = root ? JSON.parse(root.getAttribute('data-props')) : {};
  ReactDOM.render(<Root {...props}/>, element);
}
