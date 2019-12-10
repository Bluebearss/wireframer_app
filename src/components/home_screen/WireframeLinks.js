import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeCard from './WireframeCard';

class WireframeLinks extends React.Component {
    render() {
        const wireframes = this.props.wireframes;
        console.log(wireframes);
        return (
            <div className="wireframes section">
                <div className="wireframe-links-title">Recent Work</div>
                {wireframes && wireframes.map((wireframe, index) => (
                    <Link to={'/wireFrame/' + index} key={wireframe.id}>
                        <WireframeCard wireframe={wireframe} />
                    </Link>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        wireframes: state.firebase.profile.wireframes,
    };
};

export default compose(connect(mapStateToProps))(WireframeLinks);