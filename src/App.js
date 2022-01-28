import React,{useState} from 'react';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Test from '../src/pages/Test';
import { AppContext,RecordingContext } from './context';

import Agenda from './pages/Agenda';
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
	const [durationElements,setDurationElements] = useState([]);
	const [recording,setRecording] = useState(false);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
				<AppContext.Provider value={{ durationElements, setDurationElements }}>
					<RecordingContext.Provider value={{ recording, setRecording }}>
						<Router>
								<Switch>
									<Route exact path='/' component={Test}></Route>
									<Route exact path='/agenda' component={Agenda}></Route>
								</Switch>
						</Router>
					</RecordingContext.Provider>
				</AppContext.Provider>
      </ThemeProvider>

			<ToastContainer autoClose={2000} />
    </div>
  );
}

export default App;
