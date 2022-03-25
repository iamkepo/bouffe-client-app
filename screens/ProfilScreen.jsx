import React from 'react';
import { StyleSheet, Text, View, BackHandler, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AntDesign, MaterialIcons } from "react-native-vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { userAction, profilAction, parseAction, platAction, restaurantAction } from '../Store/ActivityActions';


import CommandeComponent from '../components/CommandeComponent';

const Tab = createMaterialTopTabNavigator();

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    userAction,
    profilAction,
    parseAction,
    platAction,
    restaurantAction,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};
class ProfilScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      show: true,
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
    //this.props.userAction({index: "photo", value: ""}); 
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }
  async pickImage() {
    let p = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    //console.log(p);
    let resto = {
      ...this.props.data.objet,
      restaurant_photo: p.uri
    }
    this.props.userAction({index: "photo", value: p.uri}); 
    this.props.parseAction({ i: this.props.data.i, item: resto});
    //this.props.restaurantAction(resto);
  };
  render(){
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            alignSelf: "center", 
            justifyContent: "space-between"
          }}
        >
        {
          this.props.data.user.photo != "" && this.props.data.user.photo != undefined ?
            <TouchableOpacity onPress={()=>this.pickImage()}>
              <Image 
                source={{ uri: this.props.data.user.photo }} 
                style={{ 
                  width: 100, 
                  height: 100, 
                  borderRadius: 100,
                  resizeMode: "cover",
                }}
              /> 
            </TouchableOpacity>
          :
            <View
              style={{ 
                width: 100, 
                height: 100, 
                backgroundColor: "#FFF",
                borderRadius: 100
              }}
            >
              <TouchableOpacity
                style={{
                  width: "100%", 
                  height: "100%", 
                  alignItems: "center", 
                  justifyContent:"center"
                }}
                onPress={()=>this.pickImage()}
              >
                <AntDesign
                  name='user'
                  size={100}
                  style={{
                    color: "#000",
                  }}
                />
              </TouchableOpacity>
            </View>
          }

          <View style={styles.infoContainer}>
            <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Nom: {this.props.data.user.name}</Text>
            <Text style={[styles.text, { fontWeight: "normal", fontSize: 16 }]}>Numéro: {this.props.data.user.numero}</Text>
            <Text style={[styles.text, { fontWeight: "normal", fontSize: 18 }]}>Solde: <Text style={{color: "#228B22"}} >{this.props.data.user.solde} F</Text></Text>
          </View>
        </View>
            
        <Tab.Navigator
          tabBarPosition="bottom"
          tabBarOptions={{
            activeTintColor: "#000",
            inactiveTintColor: "#BBB",
            scrollEnabled: false,
            indicatorStyle: {
                backgroundColor: "#FFD700",
                height: 57,
            },
            labelStyle: {
                fontSize: 13,
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
          <Tab.Screen name="All" component={CommandeComponent} navigation={this.navigation}/>
          <Tab.Screen name="Incomming" component={CommandeComponent} navigation={this.navigation}/>
          <Tab.Screen name="Complete" component={CommandeComponent} navigation={this.navigation}/>
          <Tab.Screen name="Incomplete" component={CommandeComponent} navigation={this.navigation}/>
        </Tab.Navigator>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        paddingTop: 50,
    },
    text: {
        color: "#52575D"
    },
    infoContainer: {
      width: "60%",
      height: 80, 
      justifyContent: "space-between",
      marginTop: 20
    },
    activityIndicator: {
        padding: 4,
        height: 12,
        width: 12,
        borderRadius: 6,
        marginTop: 3,
        marginRight: 20
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(ProfilScreen);