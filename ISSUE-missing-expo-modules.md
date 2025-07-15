# Missing expo-media-library Module

## Issue Description

Unable to resolve module expo-media-library from `/Users/BumpinAce/DEV/festivv/src/screens/CameraScreen.tsx`:

```
expo-media-library could not be found within the project or in these directories:
  node_modules
   7 | import CameraComponent from '../components/CameraComponent';
   8 | import { COLORS, SPACING, BORDER_RADIUS } from '../constants';
>  9 | import * as MediaLibrary from 'expo-media-library';
     |                                ^
  10 |
  11 | export default function CameraScreen() {
  12 |   const navigation = useNavigation();
```

## Resolution

Need to install the missing packages with:

```bash
expo install expo-media-library
expo install expo-file-system
expo install expo-image-picker
```

These packages are required for the camera functionality, photo viewer, and profile image upload features to work properly.

## Additional Information

Similar issues might occur with other Expo packages if they're not installed. Please refer to the README.md for a complete list of required packages. 