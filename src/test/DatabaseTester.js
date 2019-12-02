import React from 'react'
import { connect } from 'react-redux';
import wireframeJson from './TestWireframerAppData.json'
import { getFirestore } from 'redux-firestore';

class DatabaseTester extends React.Component {

    // NOTE, BY KEEPING THE DATABASE PUBLIC YOU CAN
    // DO THIS ANY TIME YOU LIKE WITHOUT HAVING
    // TO LOG IN
    handleClear = () => {
        const fireStore = getFirestore();
        fireStore.collection('users').get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                console.log("deleting " + doc.id);
                fireStore.collection('users').doc(doc.id).delete();
            })
        });
    }

    handleReset = () => {
        const fireStore = getFirestore();
        wireframeJson.users.forEach(wireframeJson => {
            fireStore.collection('users').add({
                firstName: wireframeJson.firstName,
                lastName: wireframeJson.lastName,
                initials: wireframeJson.initials,
                email: wireframeJson.email,
                wireframes: wireframeJson.wireframes
                }).then(() => {
                    console.log("DATABASE RESET");
                }).catch((err) => {
                    console.log(err);
                });
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.handleClear}>Clear Database</button>
                <button onClick={this.handleReset}>Reset Database</button>
            </div>)
    }
}

const mapStateToProps = function (state) {
    return {
        auth: state.firebase.auth,
        firebase: state.firebase
    };
}

export default connect(mapStateToProps)(DatabaseTester);