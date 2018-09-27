import {StyleSheet, Dimensions} from "react-native";

let height= Dimensions.get('window').height;
let width= Dimensions.get('window').width;

export default StyleSheet.create({

    MainContainer :{

        flex:1,
        margin: 10,
    },

    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    TableContainer: { flex: 1, paddingTop: 10, backgroundColor: '#fff', marginTop:15 },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },

    elementsContainer: {
        margin: 20
    },

    TextInputStyleClass: {

        textAlign: 'center',
        marginBottom: 7,
        height: 40,
        borderWidth: 1,
// Set border Hex Color Code Here.
        borderColor: '#2196F3',

        // Set border Radius.
        borderRadius: 5 ,

    },

    TextComponentStyle: {
        fontSize: 17,
        color: "#000",
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 4
    },

    WorkOrderTextStyle: {
        fontSize: 16,
        color: "#43889c",
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 8
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
        marginTop: 100,
        width: 100,
        height: 100,
        resizeMode: 'contain'
    },
    inputStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 15
    },
    error: {
        color: 'red',
        paddingTop: 10
    },

    maybeRenderUploading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    maybeRenderContainer: {
        borderRadius: 3,
        elevation: 2,
        marginTop: 40,
        shadowColor: 'rgba(0,0,0,1)',
        shadowOpacity: 0.2,
        shadowOffset: {
            height: 4,
            width: 4,
        },
        shadowRadius: 5,
        width: 250,
    },
    maybeRenderImageContainer: {
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,

    },
    maybeRenderImage: {
        height: 250,
        width:  400,
    },
    maybeRenderImageText: {

        flex:1,
        marginTop: 20


    },
    SubmitButtonStyle: {
        marginTop:10,
        padding:10,
        backgroundColor:'#00BCD4',
        borderRadius:10,
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    SubmitButtonStyle1: {
        marginTop:10,
        padding:10,
        backgroundColor:'#00BCD4',
        borderRadius:10,
        // flex:1,
        // flexDirection:'row',
        // alignItems:'center',
        // justifyContent:'center'
    },

    content:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },

    TextStyle:{
        color:'#fff',
        textAlign:'center',
        fontSize:15
    },
    textInsert:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderColor: 'gray',
        borderWidth: 1,
        padding:5,
        margin:5,
        borderRadius:5
    },
    modalContent: {
        backgroundColor: 'white',
        paddingTop: 35,
        padding: 20,
        // height: height,
        justifyContent: 'flex-start',
        alignItems: 'stretch',

    },
    bottomModal: {
        // justifyContent: 'flex-end',
        margin: 0,
        // flex:0 ,
        // bottom: 0,
        // position: 'absolute',
        // width: '100%'
    }
});