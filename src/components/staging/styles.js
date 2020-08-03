import { StyleSheet } from 'react-native';

import colors from '../../modules/colors';
import { scaleFont } from '../../modules/fonts';

export default StyleSheet.create({
  overlay: {
    backgroundColor: `rgb(12, 12, 12)`,
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 1,
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    width: '100%',
    backgroundColor: colors.background.dark.highlight
  },
  headerContent: {
    fontSize: scaleFont(6),
    color: colors.text.light,
  },
});
