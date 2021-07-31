import React, { Component } from 'react';

import './Auth.css';
import AuthContext from '../context/auth-context';



class AuthPage extends Component {
    state ={
        isLogin: true
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchModeHandler = () =>{
        this.setState(prevState => {
            return {isLogin: !prevState.isLogin}
        })
    }

    
    submitHandler = (event) => {
        event.preventDefault(); //prevent form submit

        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        //Check if fields are empty.
        /*
        if (email.trim().length === 0 || password.trim().length === 0 ) {
            return;
        }
        */


        //Build graphql query
        let requestBody = {
            query: `
                query {
                    login(email: "${email}", password: "${password}")
                    {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        }

        if(!this.state.isLogin)
        {
            requestBody = {
                query: `
                    mutation {
                        createUser(userInput: {email: "${email}", password: "${password}"}) {
                            _id
                            email
                        }
                    }
                `
            };
        }


        //Debug.
        console.log("requestBody=", requestBody);





        //Communicate with backend.
        //fetch('//localhost:3001/graphql', {
        fetch('http://localhost:3001/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                //Special headers information for graphql
                headers: {
                    'Content-Type': 'application/json'
                    
                }
            })
            .then(res => {
                if (res.status !== 200 && res.status !==201) {
                    throw new Error('failed');
                }

                return res.json();
            })
            .then(resData =>{
                //if (this.state.isLogin) {
                if (resData.data.login.token) { //check if data return is from login
                    this.context.login(
                        resData.data.login.token, 
                        resData.data.login.userId, 
                        resData.data.login.tokenExpiration
                    );
                }

                console.log("resData=", resData);
            })
            .catch((fetchError => {
                console.log("fetchError=", fetchError);
                throw new Error(fetchError);
            })
        );
        //"Content-Type": "application/json"

        //debug.
        console.log("email=", email);
        console.log("password=", password);
    };
  
  
    render() {
      return (
          <React.Fragment>
            <div>
                <h1>
                    Auth page
                </h1>
            </div>
            <form className="auth-form" onSubmit={this.submitHandler}>
                <div className="form-control">
                    <label htmlFor="email">
                        E-mail
                    </label>
                    <input type="email" id="email" ref={this.emailEl}>
                    </input>
                </div>
                <div className="form-control">
                    <label htmlFor="password">
                        Password
                    </label>
                    <input type="password" id="password" ref={this.passwordEl}>
                    </input>
                </div>
                <div className="form-actions">
                    <button type="button" onClick={this.switchModeHandler}>
                        Switch {this.state.isLogin ? 'Sign-up' : 'Login'}
                    </button>
                    <button type="submit">
                        Submit
                    </button>
                </div>

            </form>
          </React.Fragment>
      );
    }

  }
  
  export default AuthPage;  
