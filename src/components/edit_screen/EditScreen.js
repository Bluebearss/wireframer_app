import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeControls from './WireframeControls.js';
import ControlEditContainer from './ControlEditContainer.js'
import { firestoreConnect } from 'react-redux-firebase';
import zoomin from '../../css/images/zoomin.png';
import zoomout from '../../css/images/zoomout.png';

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
            /*
            <div className="container white">
                <h5 className="grey-text text-darken-3">Wireframe</h5>
                <img src={zoomin} alt="zoomin" />
                <div className="input-field">
                    <label htmlFor="email" className="active">Name</label>
                    <input type="text" name="name" id="name" onChange={this.handleChange} value={wireframe.name} />
                </div>
                <div className="input-field">
                    <label htmlFor="password" className="active">Width</label>
                    <input type="text" name="width" id="width" onChange={this.handleChange} value={wireframe.width} />
                </div>
                <div className="input-field">
                    <label htmlFor="password" className="active">Height</label>
                    <input type="text" name="height" id="height" onChange={this.handleChange} value={wireframe.height} />
                </div>
                <WireframeControls wireframe={wireframe} />
                <ControlEditContainer wireframe={wireframe} />
            </div>
            */
           
            <div className="card z-depth-0 wireframe_editor">
                <div className="wireframe-controls">
                    <div className="wireframe-resize-save">
                        <img alt="zoomin" src = {zoomin}/>
                        <img alt="zoomout" className="zoomout" src = {zoomout} />
                        <button className="save-button">Save</button>
                        <button className="close-button">Close</button>
                    </div>
                    <div className="height-width-container">
                        Height:
                        <input type="number"></input>
                        Width:
                        <input type="number"></input>
                    </div>
                    <div className="controls_container">
                        <div>
                            <button className = "container_control_button"><div className="container_control"></div></button>
                            <div className="center-align">Container </div>
                        </div>
                        <br /><br />
                        <div>
                            <button className = "label_control_button"><label className="label_control">Prompt for Input:</label></button>
                            <div className="center-align">Label </div>
                        </div>
                        <br /><br />
                        <div>
                            <button className="button_control">Submit</button>
                            <div className="center-align">Button </div>
                        </div>
                        <br /><br />
                        <div>
                            <button className = "textfield_control_button"><input type="text" placeholder="Input" className="text_control"></input></button>
                            <div className="center-align">Textfield </div>
                        </div>
                    </div>
                </div>

                <div className = "wireframe-canvas">
                <div>
                </div>
                </div>

                <div className = "control-edit-properties">
                    <div>Properties </div><br />
                    <div> Font Size: <input type="number"></input></div><br />
                    <div> Font Color: <input type="color" className="color-picker"></input></div><br />
                    <div> Background: <input type="color" className="color-picker"></input></div><br />
                    <div> Border Color: <input type="color" className="color-picker"></input></div><br />
                    <div> Border Thickness: <input type="number"></input></div><br />
                    <div> Border Radius: <input type="number"></input></div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const wireframes = state.firebase.profile.wireframes;
  console.log(wireframes);
  const wireframe = wireframes ? wireframes[id] : null;
  
  if (wireframe)
  {
    wireframe.id = id;
  }

  return {
    wireframe,
    auth: state.firebase.auth,
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'users' },
  ]),
)(EditScreen);