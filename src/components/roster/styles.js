import { StyleSheet } from 'react-native';

import { scaleFont } from '../../modules/fonts';

export default colors =>
  StyleSheet.create({
    overlay: {
      backgroundColor: colors.overlay,
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
      width: '100%',
      height: '100%',
      opacity: 0.2,
    },
    queryInput: {
      height: 40,
      color: colors.text.main,
      borderColor: colors.primary,
      borderBottomWidth: 1,
      marginBottom: 16,
      marginTop: 8,
      marginHorizontal: 8,
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      color: colors.text.main,
      backgroundColor: colors.background.two,
    },
    header: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
    },
    headerContent: {
      fontSize: scaleFont(6),
      color: colors.text.main,
    },
  });
