/**
 * OptionBar Component
 *
 * This component handles the OptionBar above the incident screen, including:
 *  - the incident timer
 *  - the edit group, remove group, and end incident buttons
 */

import React, { Component } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

import Timer from '../timer';
import styles from './styles';

class OptionBar extends Component {
  _onEndPressed = () => {
    this.props.navigation.navigate('EndScreen');
  };

  _onAddGroupPressed = () => {
    this.props.addGroupHandler();
  };

  _onRemoveGroupPressed = () => {
    this.props.removeGroupHandler();
  };

  _onEditGroupPressed = () => {
    this.props.editGroupHandler();
  };

  render() {
    const {
      initialEpoch,
      addGroupMode,
      removeGroupMode,
      editGroupMode,
    } = this.props;

    return (
      <View style={styles.OptionBar}>
        <Timer initialEpoch={initialEpoch} />
        <View style={styles.pageOption}>
          <TouchableOpacity
            onPress={this._onAddGroupPressed}
            disabled={editGroupMode || removeGroupMode}
          >
            <Text
              style={[
                styles.pageOptionContent,
                addGroupMode
                  ? styles.selected
                  : (editGroupMode || removeGroupMode) && styles.deselected,
              ]}
            >
              {' '}
              Add Group{' '}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.pageOption}>
          <TouchableOpacity
            onPress={this._onRemoveGroupPressed}
            disabled={editGroupMode || addGroupMode}
          >
            <Text
              style={[
                styles.pageOptionContent,
                removeGroupMode
                  ? styles.selected
                  : (editGroupMode || addGroupMode) && styles.deselected,
              ]}
            >
              {' '}
              Remove Group{' '}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.pageOption}>
          <TouchableOpacity
            onPress={this._onEditGroupPressed}
            disabled={removeGroupMode || addGroupMode}
          >
            <Text
              style={[
                styles.pageOptionContent,
                editGroupMode
                  ? styles.selected
                  : (removeGroupMode || addGroupMode) && styles.deselected,
              ]}
            >
              {' '}
              Edit Group{' '}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.pageOption}>
          <TouchableOpacity onPress={this._onEndPressed}>
            <Text style={styles.pageOptionContent}> End </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

// props validation
OptionBar.propTypes = {
  navigation: PropTypes.object,
  initialTime: PropTypes.number,
  report: PropTypes.object,
  toggle: PropTypes.bool,
  initialEpoch: PropTypes.number,
  addGroupHandler: PropTypes.func,
  removeGroupHandler: PropTypes.func,
  editGroupHandler: PropTypes.func,
  addGroupMode: PropTypes.bool,
  removeGroupMode: PropTypes.bool,
  editGroupMode: PropTypes.bool,
};

export default withNavigation(OptionBar);