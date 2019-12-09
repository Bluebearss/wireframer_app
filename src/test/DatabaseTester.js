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
                fireStore.collection('users').doc(doc.id).update({
                    wireframes: []
                }).then(() => {
                    console.log("Database has been cleared.");
                }).catch((err) => {
                    console.log(err);
                });
            })
        });
    }

    handleReset = () => {
        const fireStore = getFirestore();
        fireStore.collection('users').get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc){
                console.log("Clearing the user: " + doc.id);
                wireframeJson.users.forEach(aWireframeJson =>{
                    if (doc.data().email === aWireframeJson.email){
                        fireStore.collection('users').doc(doc.id).update({
                            isAdmin: aWireframeJson.isAdmin,
                            wireframes: aWireframeJson.wireframes,
                        }).then(() => {
                            console.log("Database has been reset.");
                        }).catch((err) => {
                            console.log(err);
                        });
                    }
                });
            })
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