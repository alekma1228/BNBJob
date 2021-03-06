import React, {
    StyleSheet,
} from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },

    scrollViewStyle: {
        flexGrow: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
    },

    buttonTopRight: {
        fontFamily: 'AvenirNextLTPro-Regular',
        fontSize: 16,
        marginTop: 10,
        marginRight: 20,
    },
    
    backImgView: {
        width: 35,
        height: 35,
        marginLeft: 20,
        marginTop: 40,
    },

    backImgButton: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    
    title: {
        fontFamily: 'AvenirNextLTPro-Bold',
        fontSize: 30,
        lineHeight: 50,
        color: '#000000',
    },

    searchBarContainer: {
        marginTop: 30,

        justifyContent: 'center',
        alignItems: 'center',
    },

    fieldContainer: {
        margin: 20,
    },

    searchCandidate: {
        backgroundColor: '#ffffff',
    },

    subtitle: {
        fontFamily: 'AvenirNextLTPro-Regular',
        fontSize: 16,
        lineHeight: 24,
        color: '#888888',
    },

    textRight: {
        textAlign: 'right',
    },

    colorRed: {
        color: '#ff5b8c',
    },

    alignRight: {
        alignItems: 'flex-end',
        margin: 20,
    },
    
    blueText: {
        color: '#00ccd2',
    },

    gap50 : {
    height:50,
    },

    gap100 : {
    height:100,
    },
    
    nextButton: {
        margin: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: 120,
        height: 40,
        fontFamily: 'AvenirNextLTPro-Regular',
        fontSize: 17,
    },

    whiteText: {
        color: '#ffffff',
    },

    searchContainerStyle: {
        backgroundColor: 'transparent',
        borderWidth: 1, //no effect
        borderRadius: 40,
        borderColor: '#888888',
        shadowColor: 'white', //no effect
    },

    searchInputStyle: {
        marginTop: 7,
        backgroundColor: 'white',
    },

    noborder: {
        backgroundColor: 'white',
        borderWidth: 0, //no effect
        borderColor: 'transparent',
    },

    searchbar: {
        width: "100%",
        backgroundColor: 'red', //no effect
        borderWidth:0, //no effect
        shadowColor: 'white', //no effect
    },
    
});