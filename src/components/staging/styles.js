import {StyleSheet} from 'react-native';

export default (colors) =>
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
      borderRadius: 4,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background.three,
      margin: 8,
      borderRadius: 4,
    },
    header: {
      alignItems: 'center',
      margin: 4,
    },
    headerContent: {
      fontSize: 14,
      color: colors.text.main,
    },
  });
