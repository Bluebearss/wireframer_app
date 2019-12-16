import React, { Component } from 'react';
import { Rnd } from 'react-rnd';

class Control extends Component {
    render() {
        let styleObject = {
            width: '100%',
            height: '100%',
            fontSize: this.props.control.font_size,
            color: this.props.control.text_color,
            backgroundColor: this.props.control.background_color,
            border: String(this.props.control.border_thickness) + 'px solid black',
            borderColor: this.props.control.border_color,
            borderRadius: this.props.control.border_radius,
            display: 'inline-block',
        }

        switch(this.props.control.control_type) {
            case "button":
                return (
                    <Rnd
                        size={{ width: this.props.control.width,  height: this.props.control.height }}
                        position={{ x: this.props.control.x_coordinate, y: this.props.control.y_coordinate }}
                        bounds="parent"
                        minWidth={20}
                        minHeight={20}
                        className = {this.props.control.className}
                        onClick={(e) => this.props.selectControl(e, this.props.index)}
                        onDragStop={(e, d) => this.props.repositionControl(this.props.index, d.x, d.y)}
                        onResizeStop={(e, direction, ref, delta, position) => this.props.resizeControl(this.props.index, ref.style.width, ref.style.height)}
                    >
                        <button style={styleObject}>{this.props.control.text}</button>
                    </Rnd>
                );
            case "textfield":
                return (
                    <Rnd
                        size={{ width: this.props.control.width, height: this.props.control.height }}
                        position={{ x: this.props.control.x_coordinate, y: this.props.control.y_coordinate }}
                        bounds="parent"
                        minWidth={20}
                        minHeight={20}
                        className = {this.props.control.className}
                        onClick={(e) => this.props.selectControl(e, this.props.index)}
                        onDragStop={(e, d) => this.props.repositionControl(this.props.index, d.x, d.y)}
                        onResizeStop={(e, direction, ref, delta, position) => this.props.resizeControl(this.props.index, ref.style.width, ref.style.height)}
                    >
                        <input type = "text" style={styleObject} value={this.props.control.text} ></input>
                    </Rnd>
                );
            case "label":
                return (
                    <Rnd
                        size={{ width: this.props.control.width,  height: this.props.control.height }}
                        position={{ x: this.props.control.x_coordinate, y: this.props.control.y_coordinate }}
                        bounds="parent"
                        minWidth={20}
                        minHeight={20}
                        className = {this.props.control.className}
                        onClick={(e) => this.props.selectControl(e, this.props.index)}
                        onDragStop={(e, d) => this.props.repositionControl(this.props.index, d.x, d.y)}
                        onResizeStop={(e, direction, ref, delta, position) => this.props.resizeControl(this.props.index, ref.style.width, ref.style.height)}
                    >
                        <label style={styleObject}>{this.props.control.text}</label>
                    </Rnd>
                );
            case "container":
                return (
                    <Rnd
                        size={{ width: this.props.control.width,  height: this.props.control.height }}
                        position={{ x: this.props.control.x_coordinate, y: this.props.control.y_coordinate }}
                        bounds="parent"
                        minWidth={20}
                        minHeight={20}
                        className = {this.props.control.className}
                        onClick={(event) => this.props.selectControl(event, this.props.index)}
                        onDragStop={(e, d) => this.props.repositionControl(this.props.index, d.x, d.y)}
                        onResizeStop={(e, direction, ref, delta, position) => this.props.resizeControl(this.props.index, ref.style.width, ref.style.height)}
                    >
                        <div className = "container_wireframe" style={styleObject}></div>
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