import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import './App.css';

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';

import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

/*
function App() {
  return (
    <div className="App">
      <h1>
        It works!
      </h1>
    </div>
  );
}
*/

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({token: token, userId: userId});
  };

  logout = () => {
    this.setState({token: null, userId: null});
  };
  
  render() {

    console.log("this.context.token=", this.context.token);

    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider 
            value={{
              token: this.state.token, 
              userId: this.state.userId, 
              login: this.login, 
              logout: this.logout
            }}>
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {this.context.token && <Redirect from="/" to="/events" exact />}
                {this.context.token && <Redirect from="/auth" to="/events" exact />}
                
                {!this.context.token && <Route path="/auth" component={AuthPage} />}
                
                <Route path="/events" component={EventsPage} />

                {this.context.token && <Route path="/bookings" component={BookingsPage} />}

                {!this.context.token && <Redirect from="/" to="/auth" exact />}
                {!this.context.token && <Redirect from="/bookings" to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
