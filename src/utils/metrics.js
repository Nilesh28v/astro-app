import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Scales directly based on width
const scale = (size) => (width / guidelineBaseWidth) * size;

// Scales directly based on height
const verticalScale = (size) => (height / guidelineBaseHeight) * size;

// A moderated scale (size + (scaled size - size) * factor)
// Useful for fonts where you don't want them to balloon too huge on iPads
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export const metrics = {
    screenWidth: width < height ? width : height,
    screenHeight: width < height ? height : width,
    navBarHeight: Platform.OS === 'ios' ? 64 : 54,
    borderRadius: 8,
    scale,
    verticalScale,
    moderateScale,
};
