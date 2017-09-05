import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, InputGroup, Alert } from 'react-native';
import AWS from 'aws-sdk';

const CONFIG_URL = 'https://s3.amazonaws.com/lunch-decider/lunch-decider.json';

export default class App extends React.Component {
  constructor(){
    super();
    this.state = {
      places: [
        'to eat at Hasia today',
        'to order Asian',
        'to eat burritos at Condessa',
        'to go to Leonardi'
    ],
      text: ''
    }
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
        Alert.alert('Updated...');
      } else {
        Alert.alert('Update failed.');
      }
    })
    .catch((error) => {
      Alert.alert(error);
    });
  }

  onDeletePress(place) {
    var array = this.state.places;
    var index = array.indexOf(place)
    array.splice(index, 1);
    this.setState({places: array });
  }

  render() {
    const placesList = this.state.places.map(place => {
      return (
        <View key={place} style={{flexDirection:'row', width: window.width, margin: 0, justifyContent:'center', alignItems: 'flex-start'}}>
          <View style={{flex:4}}>
            <Text style={{fontSize:20}}>{place}</Text>
          </View>
          <View style={{flex:1}}>
            <Button
              onPress={() => this.onDeletePress(place)}
              title="Delete"
              color="red"
            />
          </View>
        </View>
      );
    });

    return (
      <View style={styles.container}>
        {placesList}
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
              color="blue"
            />
          </View>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Button
            onPress={this.onSavePress}
            title="Update"
            color="green"
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
