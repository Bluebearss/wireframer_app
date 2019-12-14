import React, { Component } from 'react';
import { Rnd } from 'react-rnd';

class Control extends Component {
    render() {
        switch(this.props.control.control_type) {
            case "button":
                return (
                    <Rnd
                        size={{ width: this.props.control.width,  height: this.props.control.height }}
                        position={{ x: this.props.control.x_coordinate, y: this.props.control.y_coordinate }}
                        bounds="parent"
                        minWidth={this.props.control.width + 55}
                        minHeight={this.props.control.height + 18}
                        style={{ borderStyle: 'solid', borderColor: 'black' }}
                        onClick={(e) => this.props.selectControl(e, this.props.index)}
                        onDragStop={(e, d) => this.props.repositionControl(this.props.index, d.x, d.y)}
                        onResizeStop={(e, direction, ref, delta, position) => this.props.resizeControl(this.props.index, ref.style.width, ref.style.height)}
                    >
                        <button style={{ width: '100%', height: '100%'}}>{this.props.control.text}</button>
                    </Rnd>
                );
            case "textfield":
                return (
                    <Rnd
                        size={{ width: this.props.control.width, height: this.props.control.height }}
                        position={{ x: this.props.control.x_coordinate, y: this.props.control.y_coordinate }}
                        bounds="parent"
                        minWidth={this.props.control.width}
                        minHeight={this.props.control.height}
                        style={{ borderStyle: 'solid', borderColor: 'black' }}
                        onClick={(e) => this.props.selectControl(e, this.props.index)}
                        onDragStop={(e, d) => this.props.repositionControl(this.props.index, d.x, d.y)}
                        onResizeStop={(e, direction, ref, delta, position) => this.props.resizeControl(this.props.index, ref.style.width, ref.style.height)}
                    >
                        <input type = "text" style={{ width: '100%', height: '100%'}} defaultValue={this.props.control.text} ></input>
                    </Rnd>
                );
            case "label":
                return (
                    <Rnd
                        size={{ width: this.props.control.width,  height: this.props.control.height }}
                        position={{ x: this.props.control.x_coordinate, y: this.props.control.y_coordinate }}
                        bounds="parent"
                        minWidth={this.props.control.width}
                        minHeight={this.props.control.height}
                        style={{ borderStyle: 'solid', borderColor: 'black' }}
                        onClick={(e) => this.props.selectControl(e, this.props.index)}
                        onDragStop={(e, d) => this.props.repositionControl(this.props.index, d.x, d.y)}
                        onResizeStop={(e, direction, ref, delta, position) => this.props.resizeControl(this.props.index, ref.style.width, ref.style.height)}
                    >
                        <label style={{ width: '100%', height: '100%'}}>{this.props.control.text}</label>
                    </Rnd>
                );
            case "container":
                return (
                    <Rnd
                        size={{ width: this.props.control.width,  height: this.props.control.height }}
                        position={{ x: this.props.control.x_coordinate, y: this.props.control.y_coordinate }}
                        bounds="parent"
                        minWidth={this.props.control.width}
                        minHeight={this.props.control.height}
                        style={{ borderStyle: 'solid', borderColor: 'black', borderRadius: '5px' }}
                        onClick={(event) => this.props.selectControl(event, this.props.index)}
                        onDragStop={(e, d) => this.props.repositionControl(this.props.index, d.x, d.y)}
                        onResizeStop={(e, direction, ref, delta, position) => this.props.resizeControl(this.props.index, ref.style.width, ref.style.height)}
                    >
                        <div className = "container_wireframe" style={{ width: '100%', height: '100%'}}></div>
                    </Rnd>
                );
            default:
                return (
                    <React.Fragment></React.Fragment>
                );
        }
    }
}

export default (Control);