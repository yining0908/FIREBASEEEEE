import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import * as firebase from 'firebase';
import { Tile, List, ListItem, Button } from 'react-native-elements';

// Make a component
class UserScreen extends Component {
  state = {
    email: null,
    birthday: null,
    username: null,
    phone: null,
    gender: null
  };

  componentDidMount() {
    this.setUserInfo();
  }

  setUserInfo = async () => {
    const { currentUser } = firebase.auth();
    let dbUserid = firebase.database().ref(`/users/${currentUser.uid}`);
    try {
      let snapshot = await dbUserid.once('value');
      let birthday = snapshot.val().birthday;
      let email = snapshot.val().email;
      let username = snapshot.val().username;
      let password = snapshot.val().password;
      let gender = snapshot.val().gender;

      this.setState({ username, email, password, gender,birthday });
    } catch (err) { }

  }

  onSignOut = () => {
    firebase.auth().signOut();
    this.props.navigation.navigate('LoginScreen');
  }

  render() {
    const { email, password, birthday, username, gender } = this.state;
    return (
      <ScrollView>
        <List>
            <ListItem
            title="User name"
            rightTitle={username}
            hideChevron
          />
          <ListItem
            title="Email"
            rightTitle={email}
            hideChevron
          />
          <ListItem
            title="Password"
            rightTitle={password}
            hideChevron
          />
           <ListItem
            title="Birthday"
            rightTitle={birthday}
            hideChevron
          />

           <ListItem
            title="Gender"
            rightTitle={gender}
            hideChevron
          />
        </List>

        <Button
          style={{ flex: 1, marginTop: 30 }}
          title='Sign out'
          onPress={this.onSignOut}
        />
      </ScrollView>
    );
  }
}

export default UserScreen;