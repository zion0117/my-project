import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme, Text } from 'react-native';
import 'react-native-reanimated';

// ✅ 스플래시 화면 유지
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // ✅ GmarketSans 폰트 로드
  const [fontsLoaded] = useFonts({
    GmarketSansMedium: require('../assets/fonts/GmarketSansTTFMedium.ttf'),
    GmarketSansBold: require('../assets/fonts/GmarketSansTTFBold.ttf'),
    GmarketSansLight: require('../assets/fonts/GmarketSansTTFLight.ttf'),
  });

  // ✅ 폰트 로드 후 스플래시 화면 숨김
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: "페이지를 찾을 수 없습니다" }} />
      </Stack>

      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
