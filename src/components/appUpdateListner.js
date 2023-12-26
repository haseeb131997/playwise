import React from "react";
import { checkVersion } from "react-native-check-version";
import { Alert, Linking, Platform } from "react-native";
import Constants from 'expo-constants';
import { nativeApplicationVersion } from "expo-application";

export const AppUpdateListner = async () => {
    const appVersion = await checkVersion({
        bundleId:'gg.playwise.mobile',
        currentVersion: Constants.manifest.version,
    });
    if (appVersion.needsUpdate) {
        Alert.alert('New update available', 'Please update to latest version !',[
            // {
            //     text: "Cancel", onPress: null, style:'cancel'
            // },
            {
                text: "Update", onPress: () => {
                    Linking.openURL(Platform.OS=='android'? 'https://play.google.com/store/apps/details?id=gg.playwise.mobile':'https://apps.apple.com/us/app/playwise/id6443646627')
                },
                style:'default'
            }

        ],{ cancelable: false })
    }
}
// import React from "react";
// import { checkVersion } from "react-native-check-version";
// import { Alert, Linking, Platform, AppState } from "react-native";
// import Constants from 'expo-constants';
// import { nativeApplicationVersion } from "expo-application";

// export const AppUpdateListener = async () => {
//   const appVersion = await checkVersion({
//     bundleId: 'gg.playwise.mobile',
//     currentVersion: Constants.manifest.version,
//   });
  
//   if (appVersion.needsUpdate) {
//     Alert.alert(
//       'New update available',
//       'Please update to the latest version!',
//       [
//         {
//           text: "Update",
//           onPress: () => {
//             Linking.openURL(Platform.OS === 'android' ? 'https://play.google.com/store/apps/details?id=gg.playwise.mobile' : 'https://apps.apple.com/us/app/playwise/id6443646627');
//           },
//           style: 'default',
//         },
//       ],
//       { cancelable: false }
//     );
    
//     // Force close the app
//     AppState.addEventListener('change', (state) => {
//       if (state === 'active') {
//         AppState.removeEventListener('change');
//         setTimeout(() => {
//           Alert.alert(
//             'Update Required',
//             'Please update the app to continue using it.',
//             [
//               {
//                 text: 'OK',
//                 onPress: () => {
//                   if (Platform.OS === 'android') {
//                     Linking.openURL('https://play.google.com/store/apps/details?id=gg.playwise.mobile');
//                   } else {
//                     Linking.openURL('https://apps.apple.com/us/app/playwise/id6443646627');
//                   }
//                 },
//               },
//             ],
//             { cancelable: false }
//           );
//         }, 1000);
//       }
//     });
//   }
// };


// import React, { useEffect } from "react";
// import { checkVersion } from "react-native-check-version";
// import { Alert, Linking, Platform } from "react-native";
// import Constants from 'expo-constants';
// import { nativeApplicationVersion } from "expo-application";

// export const AppUpdateListener = async () => {
//   const appVersion = await checkVersion({
//     bundleId: 'gg.playwise.mobile',
//     currentVersion: Constants.manifest.version,
//   });

//   if (appVersion.needsUpdate) {
//     Alert.alert(
//       'New update available',
//       'Please update to the latest version!',
//       [
//         {
//           text: "Update",
//           onPress: () => {
//             Linking.openURL(
//               Platform.OS === 'android'
//                 ? 'https://play.google.com/store/apps/details?id=gg.playwise.mobile'
//                 : 'https://apps.apple.com/us/app/playwise/id6443646627'
//             );
//           },
//           style: 'default',
//         },
//       ],
//       { cancelable: false }
//     );
//   }
// };
