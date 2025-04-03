import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

// ✅ 시스템 다크 모드 감지 (hooks 경로 확인!)
import { useColorScheme } from 'react-native';

// ✅ 스플래시 화면 유지 (앱 실행 후 로딩 완료까지)
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme(); // 다크 모드 감지
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // ✅ 폰트 로드 후 스플래시 화면 숨김
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // ✅ 폰트가 로드될 때까지 앱을 렌더링하지 않음
  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 메인 탭 네비게이션 */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* 자동으로 추가될 페이지 라우팅 */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* 404 페이지 */}
        <Stack.Screen name="+not-found" options={{ title: "페이지를 찾을 수 없습니다" }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
