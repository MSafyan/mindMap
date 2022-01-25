import React from 'react';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Test from '../src/pages/Test';
// import Agenda from './components/Agenda';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
							{/* <Route exact path='/agenda' component={Agenda}></Route> */}
            </Switch>
        </Router>
      </ThemeProvider>
			<ToastContainer autoClose={2000} />
    </div>
  );
}

export default App;
