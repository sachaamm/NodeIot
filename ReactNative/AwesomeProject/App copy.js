/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Platform,
  DeviceEventEmitter,
  Keyboard
} from 'react-native';

import RNFetchBlob from 'rn-fetch-blob'

import ToastExample from './ToastExample';
import UDPHandler from './UDPHandler';

import Navigation from './MyNavigation/Navigation'
import TabNavigator from './MyNavigation/Navigation'

import HomeScreen from './screens/HomeScreen'



//import AppNavigator from './navigation/AppNavigator';


//import console = require('console');

ToastExample.show('Awesome', ToastExample.SHORT);
UDPHandler.create(3333, '192.168.1.29');


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


console.log("hello !!!!");


type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View >
        
        <TabNavigator/>


      </View>
    );
  }

  async  getResult() {


    RNFetchBlob
      .config({
        // add this option that makes response data to be stored as a file,
        // this is much more performant.
        fileCache: true,
      })
      .fetch('GET', 'http://192.168.1.29/get?log=20190704', {
        //some headers ..
      })
      .then((res) => {
        // the temp file path
        //console.log(res);
        res.text().then(function (res) {
          //console.log(res);

          let splText = res.split("\r\n");
          console.log(splText);
        });

        //let splText = text.split("\r\n");
        //console.log(text);

        //
        console.log('The file saved to ', res.path())
      })


    //
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('myAwesomeEvent', function (e) {

      //let a = e.relativeX + "";
      //ToastExample.show(a, ToastExample.SHORT);
    });

    this.listener = DeviceEventEmitter.addListener('receiveUdp', function (e) {

      let a = e.relativeX + "";
      ToastExample.show(a, ToastExample.SHORT);
    });

    this.myLoop();

  }



  myLoop() {

    //UDPHandler.askESP32Values(3333,'192.168.1.29');

    //setTimeout(this.myLoop,5000);

  }

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
