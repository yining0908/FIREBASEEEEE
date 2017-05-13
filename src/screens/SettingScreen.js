import React, { Component } from 'react';
import { View, Picker, ActivityIndicator,ScrollView } from 'react-native';
import * as firebase from 'firebase';

import { FormLabel, FormInput, Button, CheckBox } from 'react-native-elements';

// Make a component
class SettingScreen extends Component {
  state = {
    email: null,
    password:null,
    username: null,
    birthday: null,
    gender: 'male',
    saving: false
  };

  async componentWillMount() {
    const { currentUser } = firebase.auth();
    let dbUserid = firebase.database().ref(`/users/${currentUser.uid}`);
    try {
      let snapshot = await dbUserid.once('value');
      let username = snapshot.val().username;
      let email = snapshot.val().email;
      let birthday = snapshot.val().birthday;
      let password = snapshot.val().password;
      let gender = snapshot.val().gender;

      this.setState({ username, email, birthday, password, gender });
    } catch (err) { }
  }

  onSaveInfo = async () => {
    this.setState({ saving: true });
    const { currentUser } = firebase.auth();
    const { email, password, username, birthday, gender } = this.state;
    let dbUserid = firebase.database().ref(`/users/${currentUser.uid}`);
    await dbUserid.set({ email,password, username, birthday, gender });
    this.setState({ saving: false });
  }

  renderButton() {
    if (this.state.saving) {
      return <ActivityIndicator size='large' />;
    }

    return (
      <Button
        style={{ marginTop: 10 }}
        title='Save Setting'
        onPress={this.onSaveInfo}
      />
    );
  }

  render() {
    console.log(this.state);
    return (
      <ScrollView style={styles.formStyle}>
        <FormLabel>Username</FormLabel>
        <FormInput
          autoCorrect={false}
          placeholder='John Doe'
          value={this.state.username}
          onChangeText={username => this.setState({ username })}
        />
        <FormLabel>Email</FormLabel>
        <FormInput
          placeholder='user@email.com'
          autoCorrect={false}
          autoCapitalize='none'
          keyboardType='email-address'
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        />
        <FormLabel>Password</FormLabel>
        <FormInput
          autoCorrect={false}
          placeholder='aabbccdd'
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
        />
        <FormLabel>Birthday</FormLabel>
        <FormInput
          autoCorrect={false}
          placeholder='1988.08.02'
          value={this.state.birthday}
          onChangeText={birthday => this.setState({ birthday })}
        />
        <Picker
          selectedValue={this.state.gender}
          onValueChange={gender => this.setState({ gender })}
        >
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
        {this.renderButton()}
      </ScrollView>
    );
  }
}

const styles = {
  formStyle: {
    marginTop: 20
  }
};

export default SettingScreen;
