import React from "react";
import { View } from 'react-native';
import { Provider } from "react-redux";
import { createStore } from "redux";
import firebase from "react-native-firebase";
import reducers from "./reducers";
import  { loadPersistedState, loadDefaultState } from "./modules/localStorage";
import GroupList from "./components/GroupList";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() {
    // TODO: You: Do firebase things
    // const { user } = await firebase.auth().signInAnonymously();
    // console.warn('User -> ', user.toJSON());
    // await firebase.analytics().logEvent('foo', { bar: '123'});
  }

  render() {
    // load previous state in case of crash
    let persistedState = loadPersistedState();
    const store = createStore(reducers, persistedState);

    return (
      <Provider store={store}>
        <View>
          <GroupList />
        </View>
      </Provider>
    );
  }
}