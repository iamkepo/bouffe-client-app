import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { parseAction, platAction } from '../Store/ActivityActions';

import DoublePressComponent from './DoublePressComponent';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    parseAction,
    platAction,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

class PhotoComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      full: false,
      permission: null,
      take: false
    };
  }
  async componentDidMount() {
  }
 
  render(){
    return(
      <DoublePressComponent
        longTap={()=> false}
        doubleTap={()=> this.props.data.objet.photo != "" ? this.setState({full: !this.state.full }) : false}
        delay={300}
        singleTap={()=> this.props.data.user.type == "Restaurant" && this.props.data.objet.photo == "" ? this.setState({take: true, full: true }) : false}
        style={{width: '100%', height:this.state.full ? '100%' : '30%', backgroundColor: '#000000', alignItems: "center", justifyContent: "center", paddingVertical: 10}}
      >
        {
          this.props.data.objet.photo != ""  && !this.state.take?
          <Image
              source={{ uri: this.props.data.objet.photo }} 
              style={{
                marginTop: 50,
                resizeMode: this.state.full ? "contain" : "cover",
                width: '100%',
                height: this.state.full ? '60%' : '100%',
                alignItems: "center", 
                justifyContent: "center",
              }}
          />
          :
          false
          
       }
          
      </DoublePressComponent>
    );
  }
};
// function App(props) {
//   let camera = React.createRef(null)
//   const [hasPermission, setHasPermission] = React.useState(null);

//   React.useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   if (hasPermission === null) {
//     return <View />;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }
  
// }
export default connect(mapStateToProps, mapDispatchToProps)(PhotoComponent);