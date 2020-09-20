/**
 * ListItem Component
 *
 * Manages displaying a person in a group and sets a person as selected in redux and in local state on press.
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import {
  getLocationUpdateTime,
  personIsSelected,
  getTheme,
} from '../../redux/selectors';
import { togglePerson } from '../../redux/actions';
import themeSelector from '../../modules/themes';
import createStyleSheet from './styles';

const MS_IN_MINUTE = 60000;

class ListItem extends PureComponent {
  constructor() {
    super();
    this._onPress = this._onPress.bind(this); // use bind to avoid duplicating methods on demanding components

    this.state = {
      time: 0,
    };
  }

  componentDidMount() {
    const { locationUpdateTime } = this.props;
    // set first timer manually to reduce interval when remounting component after crash
    this.timeoutID = setTimeout(
      () => {
        this.setState(() => ({
          time: Date.now() - locationUpdateTime,
        }));
        // set recurring timers at constant intervals
        this.intervalID = setInterval(
          () =>
            this.setState(() => ({
              time: Date.now() - locationUpdateTime,
            })),
          MS_IN_MINUTE
        );
      },
      // calculate remaining ms in last count before a new interval should be started
      MS_IN_MINUTE - ((Date.now() - locationUpdateTime) % MS_IN_MINUTE)
    );
  }

  componentWillUnmount() {
    // clear timers to prevent memory leaks
    clearInterval(this.timeoutID);
    clearInterval(this.intervalID);
  }

  _onPress() {
    const { item, locationId, togglePerson } = this.props;
    togglePerson(item, locationId);
  }

  render() {
    const {
      item: { firstName, lastName, badge, shift, organization },
      personIsSelected,
      theme,
    } = this.props;
    const time = Math.floor(this.state.time / MS_IN_MINUTE);

    const colors = themeSelector(theme);
    const styles = createStyleSheet(colors);

    return (
      <TouchableOpacity
        onPress={this._onPress}
        style={[personIsSelected && styles.selected, styles.container]}
      >
        <View style={styles.content}>
          <View style={styles.mainLine}>
            <Text style={styles.name}>{`${firstName} ${lastName}`}</Text>
            <Text
              style={
                time >= 20 ? [styles.time, styles.timeWarning] : styles.time
              }
            >{`${time}`}</Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.label}>{`${badge ? badge + ' ' : ''}`}</Text>
            <Text style={styles.label}>{`${shift ? shift : ''}`}</Text>
            <Text style={styles.label}>{`${
              organization ? organization : ''
            }`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

// props validation
ListItem.propTypes = {
  locationUpdateTime: PropTypes.number,
  item: PropTypes.object, // the current person
  locationId: PropTypes.string, // the parent groupName
  togglePerson: PropTypes.func,
  personIsSelected: PropTypes.bool,
  theme: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  const { item } = ownProps;
  return {
    locationUpdateTime: getLocationUpdateTime(state, item),
    personIsSelected: personIsSelected(state, item),
    theme: getTheme(state),
  };
};

export default connect(
  mapStateToProps,
  { togglePerson }
)(ListItem);
