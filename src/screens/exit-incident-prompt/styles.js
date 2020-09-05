import { StyleSheet } from 'react-native';

import { scaleFont } from '../../modules/fonts';

export default colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: colors.background.one,
      padding: 24,
    },
    prompt: {
      margin: 24,
    },
    promptText: {
      fontSize: scaleFont(8),
      color: colors.text.main,
    },
    label: {
      color: colors.primary,
      marginLeft: 24,
    },
    email: {
      color: colors.primary,
    },
    emailInput: {
      height: 48,
      color: colors.text.main,
      backgroundColor: colors.background.two,
      margin: 24,
    },
    opacity: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background.two,
      padding: 48,
      margin: 24,
    },
    opacityText: {
      fontSize: 42,
      color: colors.text.main,
    },
    icon: {
      fontSize: 42,
      color: colors.primary,
      marginRight: 30,
    },
  });
