import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, InputGroup, Alert } from 'react-native';
import AWS from 'aws-sdk';

const CONFIG_URL = 'https://s3.amazonaws.com/lunch-decider/lunch-places-1.json';

export default class App extends React.Component {
  constructor(){
    super();
    this.state = {
      places: [],
      text: ''
    }
  }

  componentDidMount() {
     this.fetchPlaces();
  }

  fetchPlaces() {
    fetch(CONFIG_URL)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        places: responseJson.places
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  onAddPress = () => {
    this.setState({
      places: [...this.state.places, this.state.text],
      text: ''
    });
  }

  onSavePress = () => {
    fetch(CONFIG_URL, {
      method: 'PUT',
      headers: {
        'X-Amz-ACL': 'public-read',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        places: this.state.places
      })
    })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        console.log('Success');
        console.log(response);
        Alert.alert('Uploaded...');
      } else {
        console.log('Fail');
        console.log(response);
        Alert.alert('Upload failed.');
      }
    })
    .catch((error) => {
      console.log('Error');
      console.log(response);
      Alert.alert(error);
    });
  }

  render() {
    const placesList = this.state.places.map(place => <Text key={place} style={{fontSize:20 }}>{place}</Text>);

    return (
      <View style={styles.container}>
        <View>
          {placesList}
        </View>
        <View style={{flexDirection:'row', width: window.width, margin: 0, justifyContent:'center', alignItems: 'flex-start'}}>
          <View style={{flex:4}}>
            <TextInput
              style={{height: 40, width: 150, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
            />
          </View>
          <View style={{flex:1}}>
            <Button
              onPress={this.onAddPress}
              title="Add"
              color="#841584"
            />
          </View>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Button
            onPress={this.onSavePress}
            title="Save"
            color="#841584"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingLeft: 4,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    //justifyContent: 'center',
  },
});
