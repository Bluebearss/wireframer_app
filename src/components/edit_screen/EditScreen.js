import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import zoomin from '../../css/images/zoomin.png';
import zoomout from '../../css/images/zoomout.png';
import Control from './Control.js';
import { saveWorkHandler, goHomeHandler } from '../../store/database/asynchHandler';
import { SketchPicker } from 'react-color';
import { Modal } from 'react-materialize';

class EditScreen extends Component {
    state = {
        name: this.props.wireframe === undefined ? '' : this.props.wireframe.name,
        height: this.props.wireframe.height,
        width: this.props.wireframe.width,
        newHeight: this.props.wireframe.height,
        newWidth: this.props.wireframe.width,
        currentControl: -1,
        controls: JSON.parse(JSON.stringify(this.props.wireframe.controls)),
        changeMade: false,
        dimensionsChanged: false,
        dimensionsUpdated: false,
        zoomHeight: 100,
        zoomWidth: 60,
        zoom: 1,
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
        const { wireframes } = this.props;

        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
            changeMade: true,
        }));

        wireframes[props.wireframe.id].name = this.state.name;
    }

    handleGoHome = () => {
        const { id } = this.props;
        const { props } = this;
        const { firebase, profile } = props;
        const { wireframes } = this.props;

        const temp = wireframes[id];
        wireframes.splice(id, 1);
        wireframes.unshift(temp);
        props.goHome(profile, wireframes, firebase);
        this.props.history.push('/');
    }

    handleSaveWork = (e) => {
        e.preventDefault();

        const { props } = this;
        const { firebase, profile } = props;
        const { wireframes, wireframe } = this.props;

        wireframes[wireframe.id].controls = this.state.controls;
        wireframes[wireframe.id].name = this.state.name;

        if (this.state.dimensionsUpdated) {
            wireframes[wireframe.id].height = this.state.newHeight;
            wireframes[wireframe.id].width = this.state.newWidth;
        }

        props.saveWork(profile, wireframes, firebase);
        
        this.setState(state => ({
            ...state,
            changeMade: false,
        }));
    }

    handleDimensions = (e) => {
        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
            dimensionsChanged: true,
        }))
    }

    handleUpdateDimensions = (e) => {
        e.preventDefault();

        if ((this.state.newHeight > 5000) || (this.state.newHeight < 1) || (this.state.newWidth > 5000) || (this.state.newWidth < 1)) {
            console.log("These are invalid dimensions");
        }
        else {
            document.getElementById("wireframe-canvas").style.height = (this.state.newHeight * 625/5000) + "px";
            document.getElementById("wireframe-canvas").style.width = (this.state.newWidth * 625/5000) + "px";
            this.setState({dimensionsUpdated: true, changeMade: true});
        }
    }

    zoomIn = () => {
        var canvas = document.getElementById("draw");
        var factor = 0;
        if(this.state.zoom >= 1)
          factor = this.state.zoom + 1;
        else
          factor = this.state.zoom * 2;
        this.setState({ zoom: factor }, () => {
          canvas.style.width = (this.state.zoomWidth / this.state.zoom) + "%";
          canvas.style.height = (this.state.zoomHeight / this.state.zoom) + "%";
          canvas.style.transform = "scale(" + this.state.zoom + ")";
        });
    }
    
    zoomOut = () => {
        var canvas = document.getElementById("draw");
        var factor = 0;
        if(this.state.zoom > 1)
          factor = this.state.zoom - 1;
        else
          factor = this.state.zoom / 2;
        this.setState({ zoom: factor }, () => {
          canvas.style.width = (this.state.zoomWidth * (1 / this.state.zoom)) + "%";
          canvas.style.height = (this.state.zoomHeight * (1 / this.state.zoom)) + "%";
          canvas.style.transform = "scale(" + this.state.zoom + ")";
        });
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
        if (controlIndex !== -1)
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

        this.state.controls.map((control) => (
            control.className -= "borderimg"
        ));

        if (controlIndex !== -1) {
            let newControls = this.state.controls;
            newControls[controlIndex].className = "borderimg";

            this.setState(state => ({ 
                ...state,
                controls: newControls,
            }));
        }

        this.setState(state => ({ 
            ...state,
            currentControl: controlIndex,
        }));
    }

    addControl = (controlType) => {
        let controlHeight = 0;
        let controlWidth = 0;
        let controlText = "";

        switch(controlType) {
            case "button":
                controlWidth = 100;
                controlHeight = 50;
                controlText = "Button";
                break;
            case "textfield":
                controlWidth = 180;
                controlHeight = 110;
                controlText = "Textfield";
                break;
            case "label":
                controlWidth = 150;
                controlHeight = 50;
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

        var control = {
                control_type: controlType,
                x_coordinate: 0,
                y_coordinate: 0,
                height: controlHeight,
                width: controlWidth,
                text: controlText,
                font_size: 14,
                background_color: "#fff",
                border_color: "#000",
                text_color: "#000",
                border_thickness: 3,
                border_radius: 0,
        }

        if (controlType === "container") {
            control = {
                control_type: controlType,
                x_coordinate: 0,
                y_coordinate: 0,
                height: controlHeight,
                width: controlWidth,
                text: controlText,
                font_size: 0,
                background_color: "#fff",
                border_color: "#000",
                text_color: "#000",
                border_thickness: 3,
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

    modalSave = (e) => {
        this.handleSaveWork(e);
        this.props.history.push('/');
    }

    handleCloseWork = () => {
        this.handleGoHome();
    }

    setTextValue = () => {
        if (this.state.currentControl === -1 || this.state.controls[this.state.currentControl].control_type === "container") {
            return ""
        }
        else {
            return this.state.controls[this.state.currentControl].text;
        }
    }

    changeControlText = (e) => {
        if (this.state.currentControl !== -1) {
            const { target } = e;

            let newControls = this.state.controls;
            newControls[this.state.currentControl].text = target.value;

            this.setState(state => ({
                ...state,
                controls: newControls,
            }));
        }
    }

    setFontSize = () => {
        if (this.state.currentControl === -1 || this.state.controls[this.state.currentControl].control_type === "container") {
            return ""
        }
        else {
            return this.state.controls[this.state.currentControl].font_size;
        }
    }

    changeFontSize = (e) => {
        if (this.state.currentControl !== -1) {
            const { target } = e;

            let newControls = this.state.controls;
            newControls[this.state.currentControl].font_size = Number(target.value);

            this.setState(state => ({
                ...state,
                controls: newControls,
            }));
        }
    }

    setColor = (color_type) => {
        if (this.state.currentControl === -1) {
            return "#000";
        }
        else {
            if (color_type === "text" && this.state.controls[this.state.currentControl].control_type !== "container") {
                return this.state.controls[this.state.currentControl].text_color;
            }
            else {
                if (color_type === "background") {
                    return this.state.controls[this.state.currentControl].background_color;
                }
                else {
                    return this.state.controls[this.state.currentControl].border_color;
                }
            }
        }
    }

    changeColor = (color, color_type) => {
        let newControls = this.state.controls;

        if (this.state.currentControl !== -1) {
            if (color_type === "text") {
                newControls[this.state.currentControl].text_color = color.hex;

                this.setState(state => ({
                    ...state,
                    controls: newControls,
                }));
            }

            if (color_type === "background") {
                newControls[this.state.currentControl].background_color = color.hex;

                this.setState(state => ({
                    ...state,
                    controls: newControls,
                }));
            }
            
            if (color_type === "border") {
                newControls[this.state.currentControl].border_color = color.hex;

                this.setState(state => ({
                    ...state,
                    controls: newControls,
                }));
            }
        }
    }

    setBorderThickness = () => {
        if (this.state.currentControl === -1) {
            return ""
        }
        else {
            return this.state.controls[this.state.currentControl].border_thickness;
        }
    }

    changeBorderThickness = (e) => {
        if (this.state.currentControl !== -1) {
            const { target } = e;

            let newControls = this.state.controls;
            newControls[this.state.currentControl].border_thickness = Number(target.value);

            this.setState(state => ({
                ...state,
                controls: newControls,
            }));
        }
    }

    setBorderRadius = () => {
        if (this.state.currentControl === -1) {
            return ""
        }
        else {
            return this.state.controls[this.state.currentControl].border_radius;
        }
    }

    changeBorderRadius = (e) => {
        if (this.state.currentControl !== -1) {
            const { target } = e;

            let newControls = this.state.controls;
            newControls[this.state.currentControl].border_radius = Number(target.value);

            this.setState(state => ({
                ...state,
                controls: newControls,
            }));
        }
    }

    componentDidMount = () => {
        // FOR ALL HANDLERS WITH KEY PRESSES
        document.addEventListener('keydown', this.handleKeyPresses);
        document.getElementById("wireframe-canvas").style.height = (this.state.height * 600/5000) + "px";
        document.getElementById("wireframe-canvas").style.width = (this.state.width * 600/5000) + "px";
    }

    componentWillUnmount = () => {
        document.removeEventListener('keydown', this.handleKeyPresses);
    }

    render() {
        const auth = this.props.auth;
        const height = this.props.wireframe.height;
        const width = this.props.wireframe.width;
        const close_button = <button id="close" className="close-button" onClick={this.handleCloseWork}>Close</button>;
        const trigger_close_modal = <button id="trigger_modal_close_button" className="close-button">Close</button>;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        return (
            <div className="card z-depth-0 wireframe_editor">
                <div className="wireframe-controls">
                    <div className="name_container">
                        Name:
                        <input type="text" name="name" id="name" onChange={this.handleNameChange} defaultValue={this.props.wireframe.name} />
                    </div>
                    <div className="wireframe-resize-save">
                        <img alt="zoomin" onClick={this.zoomIn} className="zoomin" src = {zoomin}/>
                        <img alt="zoomout" onClick={this.zoomOut} className="zoomout" src = {zoomout} />
                        <button className="save-button" onClick = {this.handleSaveWork} disabled={!this.state.changeMade}>Save</button>
                        {
                        this.state.changeMade ?
                        <Modal id = "save_modal_container" header="Hello User!" trigger={this.state.changeMade ? trigger_close_modal : null}>
                            Changes to the Wireframe have not been saved yet.<br /><br /><br />
                            <div className= "modal_text">Are you sure you want to proceed without saving changes?</div>
                            <div>If you do, click the Close Button.</div>
                            <br /><br />
                            <button className="waves-effect waves-green btn-flat blue lighten-3 modal_yes_button" onClick={this.modalSave}>Yes</button>
                            <button className="waves-effect waves-green btn-flat orange lighten-3 modal_no_button" onClick={this.handleCloseWork}>Close</button>
                            
                            <div>The work unsaved will not be retreivable.</div>
                        </Modal>
                        : close_button
                        }
                    </div>
                    <div className="height-width-container">
                        Height:
                        <input type="number" id="newHeight" defaultValue={height} onChange={this.handleDimensions}></input>
                        Width:
                        <input type="number" id="newWidth" defaultValue={width} onChange={this.handleDimensions}></input>
                        <button id="updateButton" disabled={!this.state.dimensionsChanged} onClick={this.handleUpdateDimensions}>Update Dimensions</button>
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
                <div className = "canvasContainer" id="draw">
                    <div id = "wireframe-canvas" className = "wireframe-canvas" onClick={(event) => this.selectControl(event, -1)}>
                        {this.state.controls.map((control, index) => (
                            <Control 
                            index = {index}
                            control = {control}
                            selectControl = {this.selectControl}
                            repositionControl = {this.repositionControl}
                            resizeControl = {this.resizeControl} />
                        ))}
                    </div>
                </div>
                <div className = "control-edit-properties">
                    <div>Properties </div><br />
                    <div> Text: <input value={this.setTextValue()} onChange={this.changeControlText} type="text"></input></div><br />
                    <div> Font Size: <input value={this.setFontSize()} onChange={this.changeFontSize} type="number"></input></div><br />
                    <div className="font-color-name"> Font Color: </div><SketchPicker color={this.setColor("text")} onChange={(color) => this.changeColor(color, "text")} className="color-picker" /><br />
                    <div className="background-name"> Background: </div><SketchPicker color={this.setColor("background")} onChange={(color) => this.changeColor(color, "background")} className="background-color-picker" /><br />
                    <div className="font-color-name"> Border Color: </div><SketchPicker color={this.setColor("border")} onChange={(color) => this.changeColor(color, "border")} className="color-picker" /><br />
                    <div className="border-name-1"> Border Thickness: </div><input value={this.setBorderThickness()} onChange={this.changeBorderThickness} type="number" className="border-input-field"></input><br />
                    <div className="border-name"> Border Radius: </div><input value={this.setBorderRadius()} onChange={this.changeBorderRadius} type="number" className="border-input-field"></input>
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
    saveWork : (profile, wireframes, firebase) => dispatch(saveWorkHandler(profile, wireframes, firebase)),
    goHome: (profile, wireframe, firebase) => dispatch(goHomeHandler(profile, wireframe, firebase)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'users' },
  ]),
)(EditScreen);