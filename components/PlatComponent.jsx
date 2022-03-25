import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch, TextInput } from "react-native";
import { AntDesign, Octicons, MaterialIcons } from 'react-native-vector-icons';
import TouchableScale from 'react-native-touchable-scale';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { parseAction, favorieAction, panierAction, platAction, _platAction } from '../Store/ActivityActions';

import DoublePressComponent from './DoublePressComponent';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    parseAction,
    favorieAction, 
    panierAction,
    platAction,
    _platAction,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

function PlatComponent (props){
  return(
    <DoublePressComponent 
      style={[styles.item, {borderColor : props.click ? "#FDC800" : "#FFF",}]
      }
      doubleTap={()=> props.favorieAction(props.item)} 
      longTap={()=>false} 
      singleTap={() => props.parseAction({i: props.id, item: props.item}) } 
      delay={300}
    >
      
      <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>
        <Text style={{ width: "80%",color : '#000', fontSize: 15, fontWeight: (props.click) ? "bold": "normal" }}>
          {props.item.name}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#ECE31A", }}>{props.item.prix} F </Text>
      </View>
      <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>
        <TouchableScale
          style={{
            width: 50,
            height: 50,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
          onPress={()=> props.favorieAction(props.item)}
        >
          <AntDesign
            name='heart'
            size={25}
            style={{
              color: props.item.favorie ? "#B51827" : "#BBB",
            }}
          />
        </TouchableScale>
        <TouchableScale
          style={{
            width: 50,
            height: 50,
            alignItems: "flex-end",
            justifyContent: "center"
          }}
          onPress={()=> props.panierAction(props.item)}
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
    </DoublePressComponent>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  item: {
    paddingHorizontal: 15,
    paddingTop: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    justifyContent: 'space-between',
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: "#FFF",
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOffset: {
      height: 10,
      width: 10
    },
    shadowOpacity: 0.5,
    elevation : 10,  
  },
  title: {
    fontSize: 20,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(PlatComponent);