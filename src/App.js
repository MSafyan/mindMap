import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import Test from '../src/pages/Test';

const theme = createMuiTheme({
	palette: {
		primary: {
			main: 'rgb(114, 54, 223)',
			
		},
		secondary: {
			main: '#eee',
		},

	},
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
						<Switch>
							<Route exact path='/' component={Test}></Route>
            </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
