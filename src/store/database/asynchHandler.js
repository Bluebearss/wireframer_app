import * as actionCreators from '../actions/actionCreators.js'

export const loginHandler = ({ credentials, firebase }) => (dispatch, getState) => {
    firebase.auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password,
    ).then(() => {
      console.log("LOGIN_SUCCESS");
      dispatch({ type: 'LOGIN_SUCCESS' });
    }).catch((err) => {
      dispatch({ type: 'LOGIN_ERROR', err });
    });
  };

export const logoutHandler = (firebase) => (dispatch, getState) => {
    firebase.auth().signOut().then(() => {
        dispatch(actionCreators.logoutSuccess);
    });
};

export const registerHandler = (newUser, firebase) => (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firebase.auth().createUserWithEmailAndPassword(
        newUser.email,
        newUser.password,
    ).then(resp => firestore.collection('users').doc(resp.user.uid).set({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        initials: `${newUser.firstName[0]}${newUser.lastName[0]}`,
        email: newUser.email,
        isAdmin: true,
    })).then(() => {
        dispatch(actionCreators.registerSuccess);
    }).catch((err) => {
        dispatch(actionCreators.registerError);
    });
};

export const newWireframeHandler = (profile, history, firebase) => (dispatch, getState, { getFirestore }) => {
  const fireStore = getFirestore();
  fireStore.collection('users').doc(profile.uid).get().then(function(doc) {
    if (doc.exists) {
      var user_wireframes = doc.data().wireframes;
      var new_wireframe = {
        key: user_wireframes.length,
        name: "Unknown",
        height: 1500,
        width: 2250,
        created: new Date(),
        controls: []
      }
      user_wireframes.unshift(new_wireframe);
      
      fireStore.collection('users').doc(doc.id).update({
        wireframes: user_wireframes
      }).then((doc)=>{
        history.push('/wireFrame/0');
        dispatch(actionCreators.createWireframeSuccess(doc))
        console.log(doc);
        console.log(getState);
      }).catch((err)=>{
        dispatch(actionCreators.createWireframeError(err))
      });
    }
    else {
      console.log("There is no document.");
    }
  }).catch(function(err) {
    console.log("Document Error: ", err);
  });
};
export const deleteWireframeHandler = (profile, wireframe, firebase) => (dispatch, getState, { getFirestore }) => {
  const fireStore = getFirestore();
  fireStore.collection('users').doc(profile.uid).update({
    wireframes: wireframe
  }).then((doc)=>{
    dispatch(actionCreators.deleteWireframeSuccess(doc))
    console.log(doc);
    console.log(getState);
  }).catch((err)=>{
    dispatch(actionCreators.deleteWireframeError(err))
  });
};
export const prependWireframeHandler = (profile, id, firebase) => (dispatch, getState, { getFirestore }) => {
  const fireStore = getFirestore();
  fireStore.collection('users').doc(profile.uid).get().then(function(doc) {
    if (doc.exists) {
      var user_wireframes = doc.data().wireframes;
      var temp = user_wireframes[id];
      user_wireframes.splice(id, 1);
      user_wireframes.unshift(temp);

      fireStore.collection('users').doc(doc.id).update({
        wireframes: user_wireframes
      }).then((doc)=>{
        dispatch(actionCreators.prependWireframeSuccess(doc))
        console.log(doc);
        console.log(getState);
      }).catch((err)=>{
        dispatch(actionCreators.prependWireframeError(err))
      });
    }
    else {
      console.log("There is no document.");
    }
  }).catch(function(err) {
    console.log("Document Error: ", err);
  });
};
export const saveWorkHandler = (profile, wireframes, firebase) => (dispatch, getState, { getFirestore }) => {
  const fireStore = getFirestore();
  fireStore.collection('users').doc(profile.uid).update({
    wireframes: wireframes
  }).then((doc)=>{
    dispatch(actionCreators.saveWorkSuccess(doc))
    console.log(doc);
    console.log(getState);
  }).catch((err)=>{
    dispatch(actionCreators.saveWorkError(err))
  });
};
export const updateWireframeNameHandler = (profile, name, id, firebase) => (dispatch, getState, { getFirestore }) => {
  const fireStore = getFirestore();
  fireStore.collection('users').doc(profile.uid).get().then(function(doc) {
    if (doc.exists) {
      var user_wireframes = doc.data().wireframes;
      user_wireframes[id].name = name;

      fireStore.collection('users').doc(doc.id).update({
        wireframes: user_wireframes
      }).then((doc)=>{
        dispatch(actionCreators.updateWireframeNameSuccess(doc))
        console.log(doc);
        console.log(getState);
      }).catch((err)=>{
        dispatch(actionCreators.updateWireframeNameError(err))
      });
    }
    else {
      console.log("There is no document.");
    }
  }).catch(function(err) {
    console.log("Document Error: ", err);
  });
};