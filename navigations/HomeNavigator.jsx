import React from 'react';
import { View, BackHandler } from 'react-native';
import * as Notifications from 'expo-notifications';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setState, listAction } from '../Store/ActivityActions';

import FavorieScreen from '../screens/FavorieScreen';
import HomeScreen from '../screens/HomeScreen';

import HomeHeaderComponent from '../components/HomeHeaderComponent';
import PanierButtonComponent from '../components/PanierButtonComponent';

const Tab = createMaterialTopTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setState,
    listAction
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

class HomeNavigator extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      refreshing: false
    };
    this.navigation = this.props.navigation;
  }
  backAction = () => {
    BackHandler.exitApp();
    return true;
  };

  componentWillUnmount() {
   this.backHandler.remove();
  }
  async componentDidMount() {
    
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }
  render(){
    return (
      <View style={{width: '100%', height:'100%' }}>
        <HomeHeaderComponent navigation={this.navigation} />
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
          <Tab.Screen name="Home" component={HomeScreen} navigation={this.navigation} />
          <Tab.Screen name="Favorie" component={FavorieScreen} navigation={this.navigation}  />
        </Tab.Navigator>
        <PanierButtonComponent navigation={this.navigation} />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeNavigator);