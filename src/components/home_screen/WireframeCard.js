import React from 'react';

class WireframeCard extends React.Component {

    render() {
        const { wireframe } = this.props;
        console.log(wireframe);
        console.log("WireframeCard, wireFrame.id: " + wireframe.id);
        return (
            <div className="card z-depth-0 wireframe-link">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">{wireframe.name}</span>
                </div>
            </div>
        );
    }
}
export default WireframeCard;