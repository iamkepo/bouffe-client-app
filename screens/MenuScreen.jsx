import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch, TextInput } from "react-native";
import { getDistance } from 'geolib';
import * as Location from 'expo-location';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { parseAction, favorieAction, panierAction, platAction, _platAction, listAction, restaurantAction } from '../Store/ActivityActions';

import PlatComponent from '../components/PlatComponent';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    parseAction,
    favorieAction, 
    panierAction,
    platAction,
    _platAction,
    listAction,
    restaurantAction,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

class MenuScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      distance: null
    };
    this.navigation = this.props.navigation;
    this.props.navigation.addListener('focus', ()=>{
    })
  }
  async componentDidMount(){
    let { status } = await Location.requestForegroundPermissionsAsync();
    let location = await Location.getCurrentPositionAsync({});
    this.setState({distance: getDistance(
      { latitude: this.props.data.objet.restaurant.adresse.lieu[0].location.coords.latitude, longitude: this.props.data.objet.restaurant.adresse.lieu[0].location.coords.longitude },
      { latitude: location.coords.latitude, longitude: location.coords.longitude }
    )})
  }


  render() {
    return (
      <><ScrollView style={styles.container}>
      <View style={{padding: 10, height:30}}>
        <Text style={{color: "#B51827"}} >Distance: {this.state.distance/1000} Km </Text>
      </View>
        {
          this.props.data.list.map((item, i)=>(
            item.restaurant.adresse.contact.numero == this.props.data.objet.restaurant.adresse.contact.numero ?
            <PlatComponent 
              key={i} 
              id={i}
              click={(item.name == this.props.data.objet.name && item.prix == this.props.data.objet.prix && item.restaurant.adresse.contact.numero == this.props.data.objet.restaurant.adresse.contact.numero)}
              item={item}
            />
            : false
          ))
        } 
        <View style={{height:100}} />
      </ScrollView>
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  item: {
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    justifyContent: 'space-between',
    borderRadius: 5
  },
  title: {
    fontSize: 20,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(MenuScreen);