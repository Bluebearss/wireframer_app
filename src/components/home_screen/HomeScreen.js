import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import WireframeLinks from './WireframeLinks'
import { newWireframeHandler } from '../../store/database/asynchHandler';

class HomeScreen extends Component {

    handleNewWireframe(){
        const { props } = this;
        const { firebase, profile } = props;
        let newWireframe = props.createNewWireframe(profile, firebase);
        console.log("Created a new Wireframe: ", newWireframe);
        this.props.history.push('/wireFrame/0');
    }

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m4">
                        <WireframeLinks />
                    </div>

                    <div className="">
                        <div className="banner">
                            Wireframer&#x2122;
                        </div>
                        
                        <div className="home_new_wireframe_container">
                                <button className="home_new_wireframe_button" onClick={this.handleNewWireframe.bind(this)}>
                                    Create New Wireframe
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.firebase.auth,
        auth: state.firebase.auth
    };
};

const mapDispatchToProps = (dispatch) => ({
    createNewWireframe: (profile, firebase) => dispatch(newWireframeHandler(profile, firebase))
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
      { collection: 'users' },
    ]),
)(HomeScreen);