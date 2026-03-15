# Running Your Android App Bundle (.aab)

An `.aab` file (Android App Bundle) is a publishing format for the Google Play Store. Unlike an `.apk`, you **cannot** install it directly on your phone.

To run or test it, you have two main options:

## Option 1: Use `bundletool` (Local Testing)
This is the official way to test a production build on your device before uploading to the store.

1. **Install bundletool**:
   ```bash
   brew install bundletool
   ```
2. **Generate APKs from the AAB**:
   ```bash
   bundletool build-apks --bundle=your-app.aab --output=your-app.apks --mode=universal
   ```
3. **Install on device**:
   ```bash
   bundletool install-apks --apks=your-app.apks
   ```

## Option 2: Build an APK instead (Recommended for easy testing)
If you just want to test the app on a physical device or emulator without using the Play Store, you should build an `.apk` file. Your `eas.json` is already configured for this in the `preview` profile.

**Run this command:**
```bash
eas build --platform android --profile preview
```
*   This will produce a `.apk` file.
*   Once finished, you can download it and open it directly on any Android device.

## Option 3: Upload to Google Play Console
If you are ready for release, upload the `.aab` to the **Internal Testing** track in the Google Play Console. This allows you and your testers to install it directly from the Play Store.
