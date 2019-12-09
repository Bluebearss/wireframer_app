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
           
            <div className="card z-depth-0 wireframer">
                <div className = "wireframeEditor">
                    <div className = "wireframeFinalize">
                        <img alt="zoomin" src = {zoomin}/>
                        <img alt="zoomout" src = {zoomout} />
                        <button>Save</button>
                        <button>Close</button>
                    </div>
                    <div>
                        <div>Height: <input type="number"></input></div>
                        <div>Width: <input type="number"></input></div>
                    </div>
                    <div>
                        <button><div className = "container_wireframe"></div></button>
                        <div>Container </div>
                    </div>
                    <div>
                        <button><label>Label</label></button>
                        <div>Label </div>
                    </div>
                    <div>
                        <button><button>Button</button></button>
                        <div>Button </div>
                    </div>
                    <div>
                        <button> <input type = "text"></input> </button>
                        <div>Textfield </div>
                    </div>
                </div>

                <div className = "wireframeCanvas">
                <div>
                </div>
                </div>

                <div className = "controls">
                    <div>Properties: </div>
                    <div> Font Size: <input type="number"></input></div>
                    <div> Font Color: <input type="color"></input></div>
                    <div> Background Color: <input type="color"></input></div>
                    <div> Border Color: <input type="color"></input></div>
                    <div> Border Thickness: <input type="number"></input></div>
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