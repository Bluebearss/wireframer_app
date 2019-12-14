import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeControls from './WireframeControls.js';
import ControlEditContainer from './ControlEditContainer.js'
import { firestoreConnect } from 'react-redux-firebase';
import zoomin from '../../css/images/zoomin.png';
import zoomout from '../../css/images/zoomout.png';
import Control from './Control.js';
import { prependWireframeHandler, saveWorkHandler, updateWireframeNameHandler } from '../../store/database/asynchHandler';

class EditScreen extends Component {
    state = {
        name: this.props.wireframe === undefined ? '' : this.props.wireframe.name,
        width: '',
        height: '',
        currentControl: -1,
        controls: JSON.parse(JSON.stringify(this.props.wireframe.controls)),
        changeMade: false,
    }

    handleChange = (e) => {
        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));
    }

    handleNameChange = (e) => {
        const { props } = this;
        const { firebase, profile } = props;
        const { id } = this.props;

        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }), () => {
            let wireframeName = JSON.parse(JSON.stringify(this.state.name));
            props.updateWireframeName(profile, wireframeName, id, firebase);
        });
    }

    handleSaveWork = (e) => {
        e.preventDefault();

        const { props } = this;
        const { firebase, profile } = props;
        const { wireframes, wireframe } = this.props;

        wireframes[wireframe.id].controls = this.state.controls;
        props.saveWork(profile, wireframes, firebase);
        
        this.setState(state => ({
            ...state,
            changeMade: false,
        }));
    }

    handleKeyPresses = (e) => {
        e.stopImmediatePropagation();

        if (e.ctrlKey && e.keyCode === 68) {
            e.preventDefault();
            this.duplicateControl(this.state.currentControl);
        }
        else {
            if (e.keyCode === 46) {
                e.preventDefault();
                this.deleteControl(this.state.currentControl);
            }
        }
    }

    duplicateControl = (controlIndex) => {
        if (controlIndex !== -1) {
            var controlDuplicate = JSON.parse(JSON.stringify(this.state.controls[controlIndex]));
            controlDuplicate.x_coordinate -= 100;
            controlDuplicate.y_coordinate -= 100;

            if (controlDuplicate.x_coordinate < 0) {
              controlDuplicate.x_coordinate = 0;
            }

            if (controlDuplicate.y_coordinate < 0) {
              controlDuplicate.y_coordinate = 0;
            }
            var new_controls = JSON.parse(JSON.stringify(this.state.controls));
            new_controls.push(controlDuplicate);
            this.setState(state => ({
              ...state,
              controls: new_controls,
              currentControl: new_controls.length - 1,
              changeMade: true,
            }));
          }
    
    }

    deleteControl = (controlIndex) => {
        if (controlIndex >= 0)
        {
            let newControls = this.state.controls;
            newControls.splice(controlIndex, 1);

            this.setState(state => ({ 
                ...state,
                controls: newControls,
                currentControl: -1,
                changeMade: true,
            }));
        }
    }

    selectControl = (e, controlIndex) => {
        e.stopPropagation();

        this.setState(state => ({ 
            ...state,
            currentControl: controlIndex
        }));

        //CHANGE CONTROL STUFF
    }

    addControl = (controlType) => {
        let controlHeight = 0;
        let controlWidth = 0;
        let controlText = "";

        switch(controlType) {
            case "button":
                controlWidth = 100;
                controlHeight = 10;
                controlText = "Button";
                break;
            case "textfield":
                controlWidth = 180;
                controlHeight = 110;
                controlText = "Textfield";
                break;
            case "label":
                controlWidth = 150;
                controlHeight = 30;
                controlText = "Label";
                break;
            case "container":
                controlWidth = 150;
                controlHeight = 90;
                break;
            default:
                controlWidth = 0;
                controlHeight = 0;
                controlText = "";  
        }

        var control;

        if (controlType !== "container") {
            control = {
                control_type: controlType,
                x_coordinate: 0,
                y_coordinate: 0,
                height: controlHeight,
                width: controlWidth,
                text: controlText,
                font_size: 14,
                background_color: "#ffffff",
                border_color: "#ffffff",
                text_color: "#000000",
                border_thickness: 1,
                border_radius: 0,
            }
        }
        else {
            control = {
                control_type: controlType,
                x_coordinate: 0,
                y_coordinate: 0,
                height: controlHeight,
                width: controlWidth,
                background_color: "#ffffff",
                border_color: "#ffffff",
                border_thickness: 1,
                border_radius: 0,
            }
        }

        let newControls = this.state.controls;
        newControls.push(control);

        this.setState(state => ({
            ...state,
            controls: newControls,
            changeMade: true,
        }));
    }

    repositionControl = (controlIndex, x_coord, y_coord) => {
        let newControls = this.state.controls;
        let control = newControls[controlIndex];
        control.x_coordinate = x_coord;
        control.y_coordinate = y_coord;
        newControls[controlIndex] = control;

        this.setState(state => ({ 
            ...state,
            controls: newControls,
            changeMade: true,
        }));
    }

    resizeControl = (controlIndex, width, height) => {
        let newControls = this.state.controls;
        let control = newControls[controlIndex];
        control.width = Number(width.substring(0, width.length - 2));
        control.height = Number(height.substring(0, height.length - 2));  
        newControls[controlIndex] = control;

        this.setState(state => ({ 
            ...state,
            controls: newControls,
            changeMade: true,
        }));
    }

    handleCloseWork = () => {
        if (this.state.changeMade) {
            console.log("Change mode");
        }
        else {
            this.props.history.push('/');
        }
    }

    componentDidMount = () => {
        const { props } = this;
        const { firebase, profile } = props;
        const { id } = this.props;
        var { wireframe } = this.props;
        if (id !== '0')
        {
            props.prependWireframe(profile, id, firebase);
        }
        
        var wireframe_height = document.getElementById("height");
        var wireframe_width = document.getElementById("width");
        wireframe_height.value = wireframe.height;
        wireframe_width.value = wireframe.width;

        // FOR ALL HANDLERS WITH KEY PRESSES
        document.addEventListener('keydown', this.handleKeyPresses);
    }

    componentWillUnmount = () => {
        document.removeEventListener('keydown', this.handleKeyPresses);
    }

    render() {
        const auth = this.props.auth;
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
                    <div>
                        Name:
                        <input type="text" name="name" id="name" onChange={this.handleNameChange} defaultValue={this.props.wireframe.name} />
                    </div>
                    <div className="wireframe-resize-save">
                        <img alt="zoomin" className="zoomin" src = {zoomin}/>
                        <img alt="zoomout" className="zoomout" src = {zoomout} />
                        <button className="save-button" onClick = {this.handleSaveWork} disabled={!this.state.changeMade}>Save</button>
                        <button className="close-button">Close</button>
                    </div>
                    <div className="height-width-container">
                        Height:
                        <input type="number" id="height"></input>
                        Width:
                        <input type="number" id="width"></input>
                    </div>
                    <div className="controls_container">
                        <div>
                            <button className = "container_control_button" onClick = {() => this.addControl("container")}><div className="container_control"></div></button>
                            <div className="center-align">Container </div>
                        </div>
                        <br /><br />
                        <div>
                            <button className = "label_control_button" onClick = {() => this.addControl("label")}><label className="label_control">Prompt for Input:</label></button>
                            <div className="center-align">Label </div>
                        </div>
                        <br /><br />
                        <div>
                            <button className="button_control" onClick = {() => this.addControl("button")}>Submit</button>
                            <div className="center-align">Button </div>
                        </div>
                        <br /><br />
                        <div>
                            <button className = "textfield_control_button" onClick = {() => this.addControl("textfield")}><input type="text" placeholder="Input" className="text_control"></input></button>
                            <div className="center-align">Textfield </div>
                        </div>
                    </div>
                </div>

                <div className = "wireframe-canvas" onClick={(event) => this.selectControl(event, -1)}>
                    {this.state.controls.map((control, index) => (
                        <Control 
                        index = {index}
                        control = {control}
                        selectControl = {this.selectControl}
                        repositionControl = {this.repositionControl}
                        resizeControl = {this.resizeControl} />
                    ))}
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
  const wireframe = wireframes ? wireframes[id] : null;
  
  if (wireframe)
  {
    wireframe.id = id;
  }

  return {
    wireframe,
    wireframes,
    id,
    profile: state.firebase.auth,
    auth: state.firebase.auth,
  };
};

const mapDispatchToProps = (dispatch) => ({
    prependWireframe: (profile, id, firebase) => dispatch(prependWireframeHandler(profile, id, firebase)),
    saveWork : (profile, wireframes, firebase) => dispatch(saveWorkHandler(profile, wireframes, firebase)),
    updateWireframeName: (profile, name, id, firebase) => dispatch(updateWireframeNameHandler(profile, name, id, firebase)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'users' },
  ]),
)(EditScreen);