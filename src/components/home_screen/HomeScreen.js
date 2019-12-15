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
        const { history } = this.props;
        props.createNewWireframe(profile, history, firebase);
    }

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m4">
                        <WireframeLinks goHome={this.goHome} history={this.props.history} />
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
        auth: state.firebase.auth,
        wireframes: state.firebase.profile.wireframes,
    };
};

const mapDispatchToProps = (dispatch) => ({
    createNewWireframe: (profile, history, firebase) => dispatch(newWireframeHandler(profile, history, firebase))
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
      { collection: 'users' },
    ]),
)(HomeScreen);