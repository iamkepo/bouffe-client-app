import React from 'react';
import {ScrollView, Dimensions, SafeAreaView,Text,View,StyleSheet,TextInput,} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { userAction, addAction } from '../Store/ActivityActions';

import ButtonComponent from './ButtonComponent';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    userAction,
    addAction,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

const screen = Dimensions.get("screen");


function AddPlatComponent(props) {
  const [name, setName] = React.useState('');
  const [prix, setPrix] = React.useState(0);

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView style={styles.formScroll}>
      <View style={styles.subContainer}>

          <Text style={styles.formTitle}>
              Créer un plat
          </Text>

          <View style={[styles.inputContainer, {marginTop: 25}]}>
            <Text style={styles.inputLabel}>Nom</Text>
            <TextInput
              style={styles.input}
              autoFocus={true}
              autoCompleteType="name"
              keyboardType="default"
              onChangeText={(n) =>{
                setName(n)
              }}
            ></TextInput>
          </View>

          <View style={[styles.inputContainer]}>
            <Text style={styles.inputLabel}>Prix</Text>
            <TextInput
              style={styles.input}
              autoCompleteType="cc-number"
              keyboardType="decimal-pad"
              onChangeText={(p) =>{
                setPrix(p)
              }}
            ></TextInput>
          </View>

          <View style={{marginBottom: 20,}}></View>
        <View style={styles.formButtonContainer}>
          <View style={{flex: 1, marginRight: 10,}}>
            <ButtonComponent
              ButtonText="Annuler"
              TextColor="#353D40"
              TextSize={12}
              TextBold="normal"
              Background="#DADADA"
              Height={55}
              justifyContent="center"
              onPress={()=>{
                  props.closeForm();
              }}
            />
          </View>

          <View style={{flex: 1, marginLeft: 10,}}>
            <ButtonComponent
              disabled={!(name && prix)}
              ButtonText="Créer"
              TextColor="#fff"
              TextSize={12}
              TextBold="normal"
              Background="#FFD700"
              Height={55}
              justifyContent="center"
              onPress={()=>{
                var plat ={
                  name: name,
                  prix: prix,
                  photo: "",
                  restaurant_name: "",
                  restaurant_photo: "",
                  restaurant_adresse: {
                    lieu: {
                      name: "",
                      longitude: null,
                      latitude: null
                    },
                    contact: {
                      numero: "",
                      email: "",
                      web: []
                    }
                  },
                  etat: false,
                }
                props.addAction(plat);
                //console.log(props.data.list.length);
                props.closeForm();
              }}
            />
          </View>
        </View>

      </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: "100%",
    height: "100%",
    backgroundColor: "#00000022",
    paddingHorizontal: "5%",
    paddingVertical: "5%",
    zIndex: 2,
  },

  subContainer: {
    flex: 1,
    height: screen.height/2.3,
    marginVertical: 50,
    width: "100%",
    backgroundColor: "#ffff",
    shadowColor: '#00000011',
    shadowRadius: 0,
    shadowOffset: {
        height: 0,
    },
    elevation : 10,
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  formHeaderCross: {
    alignItems: "flex-end",
    paddingHorizontal: 20,
  },

  formScroll: {
    marginTop: 0,
  },

  formTitle: {
      fontSize: 23,
      color: "#353D40",
  },

  inputContainer: {
    paddingHorizontal: 0,
    marginTop: 20
  },

  inputLabel: {
    marginBottom: 5,
    color: "#15132E",
  },

  input: {
    backgroundColor: "#ffff",
    padding: 15,
    paddingTop: 12,
    paddingBottom: 12,
    color: "#000",
    borderColor: "#DADADA",
    borderWidth: 1,
    borderRadius: 4,
  },

  formButtonContainer: {
    flexDirection: "row",
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    paddingTop: 20,
    paddingBottom: 20,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AddPlatComponent);