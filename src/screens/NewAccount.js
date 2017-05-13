import React, { Component } from 'react';
import { View, Picker, ActivityIndicator,AsyncStorage ,ScrollView } from 'react-native';
import * as firebase from 'firebase';
import { Facebook } from 'expo';

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

  facebookLogin = async () => {
    console.log('Testing token....');
    let token = await AsyncStorage.getItem('fb_token');

    if (token) {
      console.log('Already having a token...');
      this.setState({ token });

      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`);
      this.setState({ status: `Hello ${(await response.json()).name}` });
      console.log(response);

    } else {
      console.log('DO NOT having a token...');
      this.doFacebookLogin();
    }
  };

  doFacebookLogin = async () => {
    let { type, token } = await Facebook.logInWithReadPermissionsAsync(
      '656114477909123',
      {
        permissions: ['public_profile'],
        behavior: 'web'
      });

    if (type === 'cancel') {
      console.log('Login Fail!!');
      return;
    }

    await AsyncStorage.setItem('fb_token', token);
    this.setState({ token });
    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${token}`);
    this.setState({ status: `Hello ${(await response.json()).name}` });
    console.log(response);
    const credential = firebase.auth.FacebookAuthProvider.credential(token);

    // Sign in with credential from the Facebook user.
    try {
      await firebase.auth().signInWithCredential(credential);
      const { currentUser } = await firebase.auth();
      console.log(`currentUser = ${currentUser.uid}`);
      this.props.navigation.navigate('UserStack');
    } catch (err) {

    }
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

   onCreateUser = async () => {
    const { username, email, birthday, password, gender } = this.state;
    try {
      
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      // const { username, email, birthday, password, gender } = this.state;
       const { currentUser } = firebase.auth();
       let dbUserid = firebase.database().ref(`/users/${currentUser.uid}`);
       dbUserid.set({ username, email, birthday, password, gender });

      this.props.navigation.navigate('UserStack');
      
    } catch (err) {
      this.setState({
        email: '',
        password: '',
        error: err.message,
        loading: false
      });
   this.props.navigation.navigate('UserScreen');
    }
     
  }
userscreen = () => {
    this.props.navigation.navigate('UserScreen');
  }

  renderButton() {
    if (this.state.saving) {
      return <ActivityIndicator size='large' />;
    }
    

    return (
      <Button
        style={{ marginTop: -10 }}
        title='Sign Up'
         onPress={this.onCreateUser}
      
      />
    );
  }
async componentDidMount() {
    await AsyncStorage.removeItem('fb_token');
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
        <View style={styles.formStyle}>
          <Button
            title='Sign in with Facebook'
            backgroundColor='#39579A'
            onPress={this.facebookLogin}
            buttonStyle={{marginTop:10}}
          />
        </View>

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
