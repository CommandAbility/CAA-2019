/**
 * HomeScreen component
 *
 * Manages displaying the home screen and activity indicator when signing out.
 */

import React, {useState, useEffect} from 'react';
import {ActivityIndicator, Alert, View, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import NetInfo from '@react-native-community/netinfo';
import {ErrorBoundary} from 'react-error-boundary';

import {LargeButton} from '../../components';
import ErrorFallbackScreen from '../error-fallback-screen';
import {
  selectReportData,
  selectIsConfigurationLoaded,
  selectTheme,
} from '../../redux/selectors';
import {
  signOut,
  toIncidentStack,
  toEndStack,
  resetApp,
  createGroups,
  clearPersonnel,
  addPerson,
  toggleTheme,
} from '../../redux/actions';
import {START_INCIDENT, END_INCIDENT} from '../../redux/types';
import {
  getNumberOfReports,
  uploadReports,
  deleteAllReports,
} from '../../utils/report-manager';
import {staticLocations} from '../../utils/locations.js';
import {DARK} from '../../utils/themes';
import themeSelector from '../../utils/themes';
import createGlobalStyleSheet from '../../utils/global-styles';
import createStyleSheet from './styles';

const {ROSTER} = staticLocations;

const HomeScreen = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => selectTheme(state));
  const reportData = useSelector((state) => selectReportData(state));
  const isConfigurationLoaded = useSelector((state) =>
    selectIsConfigurationLoaded(state),
  );

  const [loading, setLoading] = useState(false);
  const [numberOfReports, setNumberOfReports] = useState(0);

  const reportIsActive =
    reportData[START_INCIDENT] && !reportData[END_INCIDENT];
  const reportIsComplete = reportData[END_INCIDENT];

  useEffect(() => {
    if (reportIsActive) {
      dispatch(toIncidentStack());
    }
    if (reportIsComplete) {
      dispatch(toEndStack());
    }
  }, [dispatch, reportIsActive, reportIsComplete]);

  useEffect(() => {
    const getNumberOfReportsEffect = async () => {
      const result = await getNumberOfReports();
      setNumberOfReports(result);
    };
    getNumberOfReportsEffect();
  }, []);

  const onStartIncidentPressed = () => {
    if (isConfigurationLoaded) {
      dispatch(toIncidentStack());
    } else {
      Alert.alert(
        'No configuration data found',
        "Load your organization's configuration data from the web portal to begin recording incidents.",
        [
          {
            text: 'OK',
          },
        ],
      );
    }
  };

  const onUpdateConfigurationPressed = async () => {
    const {isConnected} = await NetInfo.fetch();
    if (!isConnected) {
      Alert.alert(
        'Failed to connect to the network',
        'Please check your network connection status.',
        [
          {
            text: 'OK',
          },
        ],
      );
      return;
    }

    setLoading(true);
    try {
      const {currentUser} = auth();
      const {uid} = currentUser;
      const documentSnapshot = await firestore()
        .collection('users')
        .doc(uid)
        .get();
      const {groups, personnel} = documentSnapshot.data();

      dispatch(createGroups(groups));

      dispatch(clearPersonnel());
      personnel.forEach((person) => {
        dispatch(addPerson(person, ROSTER.locationId, false)); // false for non-temporary personnel
      });

      Alert.alert(
        'Configuration updated',
        "The latest configuration data has been loaded from your organization's account.",
        [
          {
            text: 'OK',
          },
        ],
      );
    } catch (error) {
      Alert.alert('Error', error, [
        {
          text: 'OK',
        },
      ]);
    }
    setLoading(false);
  };

  const onUploadReportsPressed = async () => {
    const {isConnected} = await NetInfo.fetch();
    if (!isConnected) {
      Alert.alert(
        'Failed to connect to the network',
        'Please check your network connection status.',
        [
          {
            text: 'OK',
          },
        ],
      );
      return;
    }

    if (!numberOfReports) {
      Alert.alert(
        'No reports on device',
        'There were no reports on the device to upload.',
        [
          {
            text: 'OK',
          },
        ],
      );
      return;
    }

    setLoading(true);
    let uploadSuccess = false;
    try {
      const {currentUser} = auth();
      const {uid} = currentUser;
      const documentSnapshot = await firestore()
        .collection('users')
        .doc(uid)
        .get();
      const {
        account: {expirationTimestamp},
      } = documentSnapshot.data();
      const expirationDate = expirationTimestamp?.toDate();

      if (!expirationDate || Date.now() > expirationDate) {
        Alert.alert(
          'Report upload disabled',
          'Please sign in to the Commandability web portal to check your account status.',
          [
            {
              text: 'OK',
            },
          ],
        );
      } else {
        await uploadReports();
        uploadSuccess = true;
        await deleteAllReports();

        Alert.alert(
          'Upload completed successfully',
          'All reports have been uploaded and removed from the device.',
          [
            {
              text: 'OK',
            },
          ],
        );
      }
    } catch (error) {
      if (uploadSuccess) {
        Alert.alert(
          'Error removing reports from device',
          'All reports were successfully uploaded, but were not successfully removed from the device. Clear app storage manually before next use.',
          [
            {
              text: 'OK',
            },
          ],
        );
      } else {
        Alert.alert('Upload failed', error, [
          {
            text: 'OK',
          },
        ]);
      }
    }
    setLoading(false);
    setNumberOfReports(0);
  };

  const onToggleThemePressed = () => {
    dispatch(toggleTheme());
  };

  const onSignOutPressed = async () => {
    if (numberOfReports) {
      Alert.alert(
        'Reports on device',
        'Please upload all reports before signing out.',
        [
          {
            text: 'OK',
          },
        ],
      );
    } else {
      Alert.alert(
        'Are you sure you want to sign out?',
        'All personnel and incident data will be removed.',
        [
          {
            text: 'Cancel',
            onPress: () => {},
          },
          {
            text: 'OK',
            onPress: async () => {
              setLoading(true);
              dispatch(resetApp());
              try {
                await dispatch(signOut());
              } catch (error) {
                Alert.alert('Error', error, [
                  {
                    text: 'OK',
                  },
                ]);
              }
            },
          },
        ],
      );
      setLoading(false);
    }
  };

  const colors = themeSelector(theme);
  const globalStyles = createGlobalStyleSheet(colors);
  const styles = createStyleSheet(colors);

  const onReset = async () => {
    setLoading(false);
    const result = await getNumberOfReports();
    setNumberOfReports(result);
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallbackScreen}
      onReset={onReset}
      resetKeys={[loading, numberOfReports]}>
      <View style={globalStyles.container}>
        <LargeButton
          text="Start incident"
          onPress={onStartIncidentPressed}
          icon="alarm-light"
          type="flex"
        />
        <View style={styles.row}>
          <LargeButton
            text="Update configuration"
            onPress={onUpdateConfigurationPressed}
            icon="update"
            type="flex"
          />
          <LargeButton
            text="Upload reports"
            onPress={onUploadReportsPressed}
            icon="upload"
            type="flex"
            priority={!!numberOfReports}>
            <Text
              style={[
                styles.reportsNumber,
                numberOfReports
                  ? styles.reportsOnDevice
                  : styles.noReportsOnDevice,
              ]}>{`${numberOfReports}`}</Text>
          </LargeButton>
        </View>
        <View style={styles.row}>
          <LargeButton
            text={theme === DARK ? 'Light' : 'Dark'}
            onPress={onToggleThemePressed}
            icon="theme-light-dark"
            type="flex"
          />
          <LargeButton
            text="Sign out"
            onPress={onSignOutPressed}
            icon="logout"
            type="flex"
          />
        </View>
        {loading ? (
          <ActivityIndicator
            style={globalStyles.activityIndicator}
            color={colors.primary}
            size={'large'}
          />
        ) : null}
      </View>
    </ErrorBoundary>
  );
};

export default HomeScreen;
