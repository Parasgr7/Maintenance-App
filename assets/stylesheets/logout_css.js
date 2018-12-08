import {StyleSheet, Dimensions} from "react-native";

let height= Dimensions.get('window').height;
let width= Dimensions.get('window').width;

export default StyleSheet.create({

    MainContainer :{

        justifyContent: 'center',
        flex:1,
        margin: 10,
    },

    TextInputStyleClass: {

        textAlign: 'center',
        marginBottom: 7,
        height: 40,
        borderWidth: 1,
        borderColor: '#2196F3',
        borderRadius: 5 ,

    },

    TextComponentStyle: {
        fontSize: 20,
        color: "#000",
        textAlign: 'center',
        marginBottom: 15
    },

    backgroundImage: {
        flex: 1,
        width: width,
        height: height
    },
    logoImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImagedesign: {
        marginTop: 80,
        width: 300,
        resizeMode: 'contain'
    },
    inputStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 15
    },
    WorkOrderTextStyle2: {
        fontSize: 20,
        color: "white",
        textAlign: 'center',
        marginTop: 14,
    },
    WorkOrderTextStyle: {
        fontSize: 16,
        color: "Black",
        textAlign: 'center',
        marginTop: 14,
    },
    WorkOrderTextStyle1: {
        fontSize: 18,
        color: "white",
        textAlign: 'center',
        margin: 10,
    },
    error: {
        color: 'red',
        paddingTop: 10
    },
    SubmitButtonStyle: {
 
        marginTop:40,
        paddingTop:15,
        paddingBottom:15,
        marginLeft:30,
        marginRight:30,
        backgroundColor:'#00BCD4',
        borderRadius:10,
      },
     
      TextStyle:{
          color:'#fff',
          textAlign:'center',
          fontSize:20
      }

});