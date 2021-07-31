import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

class EventsPage extends Component {
    state = {
      creating: false
    };

    constructor(props) {
      super(props);
    }

    startCreateEventHandler = () => {
      this.setState({creating: true});
    }

    modalConfirmHandler = () => {
      this.setState({creating: false});
    };

    modalCancelHandler = () => {
      this.setState({creating: false});
    };
  
    render() {
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
                <input type="text" id="title"></input>
              </div>

              <div className="form-control">
                <label htmlFor="price">
                  Price
                </label>
                <input type="number" id="price"></input>
              </div>

              <div className="form-control">
                <label htmlFor="date">
                  Date
                </label>
                <input type="number" id="date"></input>
              </div>

              <div className="form-control">
                <label htmlFor="description">
                  Description
                </label>
                <textarea id="description" rows="4"></textarea>
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
        </React.Fragment>
      );
    }

  }
  
  export default EventsPage;  
