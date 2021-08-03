import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';

class EventsPage extends Component {
    state = {
      creating: false,
      events: []
    };

    static contextType = AuthContext;

    constructor(props) {
      super(props);

      //Control information by reference (alternative way to form control by state)
      this.titleElRef = React.createRef();
      this.priceElRef = React.createRef();
      this.dateElRef = React.createRef();
      this.descriptionElRef = React.createRef();
    }

    componentDidMount(){
      this.fetchEvents();
    }

    startCreateEventHandler = () => {
      this.setState({creating: true});
    }

    modalConfirmHandler = () => {
      this.setState({creating: false});

      const title = this.titleElRef.current.value;
      const price = +this.priceElRef.current.value;
      const date = this.dateElRef.current.value;
      const description = this.descriptionElRef.current.value;

      const event = {title, price, date, description}; //shortcut for same keyname as variables.
      console.log("event=", event);

      //Build graphql query
      const requestBody = {
          query: `
              mutation {
                  createEvent(userInput: {
                      title: "${title}", 
                      description: "${description}",
                      price: ${price}, 
                      date: "2021-07-10T23:39:55.882Z"
                    }){
                      title
                      description
                  }
              }
          `
      };



      const token = this.context.token;
      console.log("token (inside event)=", token);


      //Communicate with backend.
      //fetch('//localhost:3001/graphql', {
      fetch('http://localhost:3001/graphql', {
              method: 'POST',
              body: JSON.stringify(requestBody),
              //Special headers information for graphql
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + token
              }
          })
          .then(res => {
              if (res.status !== 200 && res.status !==201) {
                  throw new Error('failed');
              }

              return res.json();
          })
          .then(resData =>{
              /*
              //if (this.state.isLogin) {
              if (resData.data.login.token) { //check if data return is from login
                  this.context.login(
                      resData.data.login.token, 
                      resData.data.login.userId, 
                      resData.data.login.tokenExpiration
                  );
              }
              */



              console.log("resData=", resData);
          })
          .catch((fetchError => {
              console.log("fetchError=", fetchError);
              throw new Error(fetchError);
          })
      );

    };


    fetchEvents(){
      //Build graphql query
      const requestBody = {
          query: `
              query {
                  events {
                    _id
                    title
                    description
                  }
              }
          `
      };


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
              /*
              //if (this.state.isLogin) {
              if (resData.data.login.token) { //check if data return is from login
                  this.context.login(
                      resData.data.login.token, 
                      resData.data.login.userId, 
                      resData.data.login.tokenExpiration
                  );
              }
              */

             const events = resData.data.events;
             this.setState({events: events})


              //this.fetchEvents();
              console.log("resData=", resData);
          })
          .catch((fetchError => {
              console.log("fetchError=", fetchError);
              throw new Error(fetchError);
          })
      );



    }

  

    modalCancelHandler = () => {
      this.setState({creating: false});
    };
  
    render() {
      const eventsList = this.state.events.map(event => {
        return <li key={event._id} className="events__list-item">
          {event.title}
        </li>;
      });


      return (
        <React.Fragment>
          {this.state.creating && <Backdrop />}
          {this.state.creating && <Modal title="Add Event" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
            {/*children */}
            <form>
              <div className="form-control">
                <label htmlFor="title">
                  Title
                </label>
                <input type="text" id="title" ref={this.titleElRef}></input>
              </div>

              <div className="form-control">
                <label htmlFor="price">
                  Price
                </label>
                <input type="number" id="price" ref={this.priceElRef}></input>
              </div>

              <div className="form-control">
                <label htmlFor="date">
                  Date
                </label>
                <input type="datetime-local" id="date" ref={this.dateElRef}></input>
              </div>

              <div className="form-control">
                <label htmlFor="description">
                  Description
                </label>
                <textarea id="description" rows="4" ref={this.descriptionElRef}></textarea>
              </div>
            </form>
          </Modal>}
          <div>
            <h1>
              Events page
            </h1>

            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
          <section className="events__list">
              <ul>
                <li className="events__list-item">Test 1</li>
                <li className="events__list-item">Test 2</li>
                {eventsList}
              </ul>
          </section>
        </React.Fragment>
      );
    }

  }
  
  export default EventsPage;  
