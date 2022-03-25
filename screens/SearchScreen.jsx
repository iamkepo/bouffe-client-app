import React, { useState, useEffect } from 'react';
import {BackHandler,StyleSheet,ScrollView,View,Text,KeyboardAvoidingView,Dimensions,TouchableOpacity,TextInput, Image} from 'react-native';
import { AntDesign, Octicons } from 'react-native-vector-icons';
import { getDistance } from 'geolib';
import * as Location from 'expo-location';
import TouchableScale from 'react-native-touchable-scale';
import io from "socket.io-client";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { listAction, parseAction, panierAction, setState, } from '../Store/ActivityActions';

import PanierButtonComponent from '../components/PanierButtonComponent';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    listAction,
    panierAction,
    parseAction,
    setState,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

const screen = Dimensions.get("screen");

class SearchScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      show: true,
      query: "",
      list: []
    };
    this.navigation = this.props.navigation;
    this.props.navigation.addListener('focus', ()=>{

    })
  }
  backAction = () => {
    this.navigation.goBack();
    return true;
  };

  componentWillUnmount() {
   this.backHandler.remove();
  }
  componentDidMount() {
    
   this.backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    this.backAction
   );
  }
  async updateSearch(text) {
    this.setState({list: []});
    this.setState({query: text});
    if (text != "" ){
      let stock = [];
      this.props.data.list.forEach(item => {
        if (item.name.search(text) != -1) {
          stock = stock.concat(item);
        }
      });
      let { status } = await Location.requestForegroundPermissionsAsync();
      let location = await Location.getCurrentPositionAsync({});
      for (let i = 0; i < stock.length; i++) {
        stock[i].distance = getDistance(
          { latitude: stock[i].restaurant.adresse.lieu[0].location.coords.latitude, longitude: stock[i].restaurant.adresse.lieu[0].location.coords.longitude },
          { latitude: location.coords.latitude, longitude: location.coords.longitude }
        );
      }
      this.setState({list: stock.sort(function(a, b){return a.distance - b.distance })});
      
    }
  }

  render(){
    return (
      <KeyboardAvoidingView behavior={'height'} style={styles.container}>
        <View style={styles.searchContainer}>
          <TouchableOpacity 
            onPress={()=> this.props.navigation.goBack()}
            style={styles.vwSearch}
          >
            <AntDesign
              name='arrowleft'
              size={20}
              style={{
                color: "#000",
              }}
            />
          </TouchableOpacity>

          <TextInput
            autoFocus={true}
            value={this.state.query}
            placeholder="Search"
            style={styles.textInput}
            onChangeText={(text) => this.updateSearch(text)}
          />
          {
            this.state.query ?
              <TouchableOpacity
                onPress={() => this.setState({query: ""})}
                style={styles.vwClear}
              >
                <AntDesign
                  name='close'
                  size={20}
                  style={{
                    color: "#000",
                  }}
                />
              </TouchableOpacity>
            : false
          }

        </View>
        <ScrollView>
        {
          this.state.list.map((item, i)=>(
            <TouchableOpacity
              key={i} 
              style={styles.plat}
              onPress={()=> {
                this.props.parseAction({i: i, item: item}); 
                this.props.navigation.navigate('Restaurant')
              }}
            >
              <View 
                style={{
                  width: "100%",
                  height: "100%",
                  flexWrap: "nowrap",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 5,
                }}
              >
                <Image 
                  source={{ uri: item.photo }} 
                  style={{ width: "35%", height: "100%", resizeMode: "cover", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}
                />
                <View style={{width: "65%", height: "100%", justifyContent: "space-around", padding: "2%"}}>
                  <View style={{width: "80%", justifyContent: "space-between", flexDirection: "row"}}>
                    <Text style={{ color: "#000", fontSize: 12, }}>
                      {item.name}
                      <Text style={{ color: "#ECE31A" }}> {item.prix} F </Text>
                    </Text>
                    <TouchableScale
                      style={{
                        position: "absolute",
                        top: -10,
                        right: -45,
                        zIndex: 2,
                        width: 50,
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      onPress={()=> this.props.panierAction(item)}
                    >
                      <Octicons
                        name='diff-added'
                        size={25}
                        style={{
                          color: "#FDC800",
                        }}
                      />
                    </TouchableScale>
                  </View>
                  
                  <Text style={{ color: "#BBB", fontSize: 12 }}>De: 
                    <Text style={{ color: "#000" }}> {item.restaurant.name}</Text>
                  </Text>
                  <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>
                    <Text style={{ fontSize: 11, color: "#BBB" }}> Avec  
                      <Text style={{ color: "#ECE31A" }}> {item.restaurant.menu_length >=10 ? null : 0 }{item.restaurant.menu_length} </Text>autres plats
                      { item.distance != undefined ? <> à <Text style={{ color: "#ECE31A" }}> {item.distance/1000} Km </Text> de vous </> :false }
                    </Text>
                  </View>
                  
                </View>
              </View>
            </TouchableOpacity>
          ))
        }
        <View style={{height:150}} />
        </ScrollView>
        <PanierButtonComponent navigation={this.props.navigation} /> 
      </KeyboardAvoidingView >
    );
  }
}
const styles = StyleSheet.create({
  vwClear: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
  },

  vwSearch: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer:
  {
    backgroundColor: '#EEE',
    width: '90%',
    height: 50,
    flexDirection: 'row',
    borderRadius: 5,
    marginBottom: 20

  },
  container: {
    backgroundColor: '#FFF',
    width: '100%',
    height: screen.height,
    alignItems: 'center',
    paddingTop: 50
  },
  plat: { 
    width: "94%",
    backgroundColor: '#FFF',
    height: 100,
    marginBottom: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOffset: {
      height: 10,
      width: 10
    },
    shadowOpacity: 0.5,
    elevation : 10,
    alignSelf: "center"
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
