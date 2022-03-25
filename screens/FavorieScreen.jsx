import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, RefreshControl, BackHandler } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getDistance } from 'geolib';
import * as Location from 'expo-location';
import { AntDesign, Octicons, Ionicons } from 'react-native-vector-icons';
import TouchableScale from 'react-native-touchable-scale';
import io from "socket.io-client";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { favorieAction, panierAction, parseAction, listAction } from '../Store/ActivityActions';

import DoublePressComponent from '../components/DoublePressComponent';
import CONST from '../Store/const';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    favorieAction, 
    panierAction, 
    parseAction,
    listAction,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};
const screen = Dimensions.get("screen");
class FavorieScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      trie_d: false,
      trie_p: false,
      refreshing: false
    };
    this.socket = io(CONST.socket_url);
    this.tab = [],
    this.navigation = this.props.navigation;
  }

  backAction = () => {
    BackHandler.exitApp()
    return true;
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  
  async componentDidMount(){
    this.onRefresh();
    
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }
  onRefresh = () => {
    this.setState({ trie_d: false, trie_p: false });
     this.setState({refreshing: true});
  
    wait(2000).then(() =>{
      var favorie = [];
      this.props.data.list.forEach(x => {
        if (x.favorie) {
          favorie = favorie.concat(x)
        }
      });
      this.socket.emit('List', favorie.length);
      this.socket.on('List', (list) => {
        if (favorie.length > 0) {
          list.forEach(y => {
            favorie.forEach(z =>{
              if (y.name == z.name && y.prix == z.prix && y.restaurant.adresse.contact.numero == z.restaurant.adresse.contact.numero) {
                y.favorie = true
              }
            })
          })
          favorie = [];
        }
        this.getLocation(list);
      })
      this.setState({refreshing: false}) ;
    });
  }
  async getLocation(list){
    let { status } = await Location.requestForegroundPermissionsAsync();
    let location = await Location.getCurrentPositionAsync({});
    list.forEach(y => {
      y.distance = getDistance(
        { latitude: y.restaurant.adresse.lieu[0].location.coords.latitude, longitude: y.restaurant.adresse.lieu[0].location.coords.longitude },
        { latitude: location.coords.latitude, longitude: location.coords.longitude }
      );
    });
    this.props.listAction(list);
  }

  trie_distance(a){
    if (a) {
      this.props.listAction(this.props.data.list.sort(function(a, b){return a.distance - b.distance }));
    } else {
      this.props.listAction(this.props.data.list.sort(function(a, b){return b.distance - a.distance }));
    }
  }

  trie_prix(a){
    if (a) {
      this.props.listAction(this.props.data.list.sort(function(a, b){return a.prix - b.prix }));
    } else {
      this.props.listAction(this.props.data.list.sort(function(a, b){return b.prix - a.prix }));
    }
  }

  detail(i, item){
    this.props.parseAction({i: i, item: item});
    this.navigation.navigate('Restaurant');
  }
  
  render(){    
    return (
      <ScrollView
        contentContainerStyle={{}}
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
      >
        <View style={{width: "100%",height: 50,flexDirection: "row",alignItems: "center",justifyContent: "space-around"}}>

          <View style={{width: "25%",height: "100%",flexDirection: "row",alignItems: "center",justifyContent: "space-between"}}>
            <Ionicons name='filter' size={25} style={{color: "#000",}}/>
            <Text style={{ fontWeight: "bold" }} >Filtré par: </Text>
          </View>

          <TouchableOpacity 
            onPress={()=> (this.trie_prix(this.state.trie_p ? true : false), this.setState({trie_p: !this.state.trie_p, trie_d: false }))} 
            style={{width: "20%",height: "80%",flexDirection: "row",alignItems: "center",justifyContent: "space-evenly",backgroundColor: "#FFF",borderRadius: 5,}}
          >
            <Text style={{ color: "#000" }} >prix</Text> 
            <AntDesign name={this.state.trie_p ? 'up' : 'down'} size={20} style={{color: "#000",}}/>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={()=> (this.trie_distance(this.state.trie_d ? true : false), this.setState({trie_d: !this.state.trie_d, trie_p: false}))} 
            style={{width: "25%",height: "80%",flexDirection: "row",alignItems: "center",justifyContent: "space-evenly",backgroundColor: "#FFF",borderRadius: 5,}}
          >
            <Text style={{ color: "#000" }} >distance</Text> 
            <AntDesign name={this.state.trie_d ? 'up' : 'down'} size={20} style={{color: "#000",}}/>
          </TouchableOpacity>

        </View>
        <View style={styles.container}>
          {
            this.props.data.list.map((item, i)=>(
              item.favorie ?
              <DoublePressComponent
                key={i} 
                style={styles.plat}
                singleTap={()=> this.detail(i, item)} 
                doubleTap={()=> this.props.favorieAction(item)} 
                longTap={()=> false}
                delay={300}
              >
                <View 
                  style={{
                    width: "100%",
                    height: "100%",
                    flexWrap: "nowrap",
                    alignItems: "center",
                    borderRadius: 5,
                  }}
                >
                  <Image 
                    source={{ uri: item.photo }} 
                    style={{ 
                      width: "100%", 
                      height: "60%", 
                      resizeMode: "cover", 
                      borderTopRightRadius: 5, 
                      borderTopLeftRadius: 5, 
                    }}
                  />
                  <View style={{width: "100%",height: "10%", alignItems: "center", justifyContent: "space-between", flexDirection: "row", marginTop: "5%"}}>
                    <TouchableScale
                      style={{width: 50,height: "100%",alignItems: "center",justifyContent: "center"}}
                      onPress={()=> this.props.favorieAction(item)}
                    >
                      <AntDesign name='heart' size={25} style={{color: item.favorie ? "#B51827" : "#BBB",}}/>
                    </TouchableScale>

                    <TouchableScale 
                      style={{width: 50,height: "100%",alignItems: "center",justifyContent: "center"}}
                      onPress={()=> this.props.panierAction(item)}
                    >
                      <Octicons name='diff-added' size={25} style={{color: "#FDC800",}}/>
                    </TouchableScale>
                  </View>
                  <View style={{width: "90%", height: "30%", justifyContent: "space-around", paddingVertical: "2%"}}>

                    <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>

                      <Text style={{ color: "#000", fontSize: 16, fontWeight: "bold" }}>
                        {item.name}
                      </Text>
                      <Text style={{ color: "#ECE31A", fontSize: 18, }}> {item.prix} F </Text>
                    </View>
                    
                    <Text style={{ color: "#BBB", fontSize: 15 }}>De: 
                      <Text style={{ color: "#000" }}> {item.restaurant.name}</Text>
                    </Text>
                    <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>
                      <Text style={{ fontSize: 15, color: "#BBB" }}> Avec  
                        <Text style={{ color: "#ECE31A" }}> {item.restaurant.menu_length >=10 ? null : 0 }{item.restaurant.menu_length} </Text>autres plats
                        
                        { item.distance != undefined ? <> à <Text style={{ color: "#ECE31A" }}> {item.distance/1000} Km </Text> de vous </> :false }
                         
                      </Text>
                    </View>
                  </View>
                </View>
              </DoublePressComponent>
              : false
            ))
          }
          <StatusBar style="auto" />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%", 
    minHeight: screen.height,
    //backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: "flex-start",
    paddingTop: 0,
    paddingBottom: 100
  },
  plat: { 
    width: "90%",
    backgroundColor: '#FFF',
    height: 300,
    paddingBottom: 15,
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
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(FavorieScreen);