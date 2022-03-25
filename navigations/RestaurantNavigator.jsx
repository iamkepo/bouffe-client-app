import React from 'react';
import { View, BackHandler, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import NetInfo from '@react-native-community/netinfo';
import io from "socket.io-client";

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from 'react-native-vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { parseAction } from '../Store/ActivityActions';

import InfosScreen from '../screens/InfosScreen';
import MenuScreen from '../screens/MenuScreen';
import ProfilScreen from '../screens/ProfilScreen';

import PhotoComponent from '../components/PhotoComponent';
import PanierButtonComponent from '../components/PanierButtonComponent';
import AddPlatComponent from '../components/AddPlatComponent';

const Tab = createMaterialTopTabNavigator();

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    parseAction,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

class RestaurantNavigator extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      show: true,
      chatMessage: "",
      chatMessages: []
    };
    this.navigation = this.props.navigation;
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

  render(){
    return (
      <View style={{width: '100%', height:'100%' }}>
        <PhotoComponent />
        <Tab.Navigator
          tabBarPosition="bottom"
          tabBarOptions={{
            activeTintColor: "#000",
            inactiveTintColor: "#BBB",
            scrollEnabled: false,
            indicatorStyle: {
                backgroundColor: "#FDC800",
                height: 57,
            },
            labelStyle: {
                fontSize: 16,
                fontWeight: "bold",
                textTransform: 'none',
            },
            tabStyle: {
                display: "flex",
                alignItems: "center",
                height: 55,
                backgroundColor: "#FFF",
                flex: 1,
            },
            style: {
                backgroundColor: 'transparent',
                display: 'flex',
                height: "auto",
            },
            upperCaseLabel: false,
          }}
        >
          <Tab.Screen name="Menu" component={MenuScreen} />
          <Tab.Screen name="Infos" component={InfosScreen} />
        </Tab.Navigator>
        <StatusBar style="light" />
        <PanierButtonComponent navigation={this.navigation} /> 
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantNavigator);