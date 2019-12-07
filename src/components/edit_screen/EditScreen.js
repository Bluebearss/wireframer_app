import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeControls from './WireframeControls.js';
import ControlEditContainer from './ControlEditContainer.js'
import { firestoreConnect } from 'react-redux-firebase';

class EditScreen extends Component {
    state = {
        name: '',
        width: '',
        height: '',
    }

    handleChange = (e) => {
        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));
    }

    render() {
        const auth = this.props.auth;
        const wireframe = this.props.wireframe;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        return (
            <div className="container white">
                <h5 className="grey-text text-darken-3">Wireframe</h5>
                <div className="input-field">
                    <label htmlFor="email">Name</label>
                    <input className="active" type="text" name="name" id="name" onChange={this.handleChange} value={wireframe.name} />
                </div>
                <div className="input-field">
                    <label htmlFor="password">Width</label>
                    <input className="active" type="text" name="width" id="width" onChange={this.handleChange} value={wireframe.width} />
                </div>
                <div className="input-field">
                    <label htmlFor="password">Height</label>
                    <input className="active" type="text" name="height" id="height" onChange={this.handleChange} value={wireframe.height} />
                </div>
                <WireframeControls wireframe={wireframe} />
                <ControlEditContainer wireframe={wireframe} />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { wireframes } = state.firestore.data;
  const wireframe = wireframes ? wireframes[id] : null;
  wireframe.id = id;

  return {
    wireframe,
    auth: state.firebase.auth,
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'todoLists' },
  ]),
)(EditScreen);