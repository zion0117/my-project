# 김미니 시니어 헬스 커뮤니티 프로젝트

이 프로젝트는 시니어를 위한 헬스 커뮤니티 플랫폼으로, 사용자가 운동 기록을 관리하고 건강 정보를 제공하며, 서로 소통할 수 있는 기능을 제공합니다. 다양한 기술을 활용하여 건강한 삶을 유지할 수 있도록 지원합니다.
demo 영상 : https://drive.google.com/file/d/1-VenCzWuL7itRpZof914zgl9UlQ43Xv-/view?usp=sharing

---

## Features List

### 1. MediaPipe 기반 운동 자세 교정
- **부위별 운동 추천**: 사용자가 운동하고 싶은 신체 부위를 선택하면 그에 맞는 운동(예: 플랭크, 스쿼트)을 추천합니다.
- **사용자 자세 추적**: 스마트폰 카메라로 사용자의 자세를 촬영하고, Google의 MediaPipe 기술을 통해 33개의 주요 관절을 실시간으로 인식합니다.
- **피드백 제공**: 사용자의 자세가 올바르면 유지 시간을 점수로 환산하여 보여주고, 자세가 흐트러지면 "엉덩이를 더 낮춰보세요!"와 같이 구체적인 피드백을 제공하여 부상을 예방하고 운동 효과를 높입니다.
- **운동 결과 데이터 저장**: 운동 결과(평균 점수, 반복 횟수, 시간)는 날짜별로 저장되어 종합 피드백과 함께 제공됩니다.

### 2. 소셜 네트워킹
- **팀 챌린지**: 사용자는 직접 운동 팀을 만들거나 다른 사람이 만든 팀에 참여하여 공동의 목표(예: 아침 러닝 크루)를 함께 달성할 수 있습니다. 이를 통해 운동에 대한 내재적 동기를 부여하고 사회적 유대감을 형성합니다.
- **커뮤니티 게시판**: 자유롭게 게시글을 작성하고 '좋아요'를 누르며 다른 사용자들과 소통할 수 있는 공간을 제공합니다.

### 3. 부가 기능
- **운동 챗봇**: "허리가 아파" 와 같이 건강 관련 질문을 입력하면, 추천 운동법이나 통증 완화에 도움이 되는 영양 정보를 자동으로 안내합니다.
- **로케이션 기반 활동 추천**: Google Maps API와 연동하여 사용자 주변의 운동 시설이나 공원 등을 추천합니다.
- **건강 뉴스**: Naver 뉴스 API를 통해 '건강' 카테고리의 최신 뉴스를 스크랩하여 보여줍니다.
- **약 복용 알림**: 사용자가 설정한 시간에 약 복용 알림을 보내고, 복용 여부를 기록 및 관리할 수 있습니다.
  
---

## 다른 헬스앱들과의 차별성
1. **시니어 맞춤형 기술 및 UI/UX**: 젊은 층 대상의 복잡한 앱들과 달리, 큰 글씨와 직관적인 인터페이스를 적용하여 시니어의 사용 편의성을 높였습니다. 또한, 단순 걸음 수 경쟁이 아닌 MediaPipe 기반의 정확한 자세 교정이라는 기술적 차별점을 가집니다.
2. **사회적 교류를 통한 동기 부여**: 대부분의 헬스 앱이 개인의 신체 데이터 관리에 집중하는 반면, 본 서비스는 팀 챌린지와 커뮤니티 기능을 통해 사회적 교류라는 내재적 동기를 자극하여 운동 습관의 지속성을 높입니다.
3. **위치 및 공공 데이터 활용**: 사용자의 위치를 기반으로 주변 운동 시설을 추천하고, 향후 정부/지자체의 건강 프로그램 정보와 연동하여 시니어에게 실질적으로 유용한 정보를 제공할 수 있습니다.

---

## How to install 

### 1. 프로젝트 클론

```bash
git clone https://github.com/zion0117/my-project.git
cd C:\Users\user\my-project\hie-main
```

### 2. 의존성 설치(package.json 파일에 명시된 모든 라이브러리 한 번에 설치가능)

```bash
npm install
```
## 주요 의존성 목록

| 패키지명                                    | 설명                                    |
|---------------------------------------------|-----------------------------------------|
| react, react-native                        | 리액트 네이티브 앱의 핵심 프레임워크    |
| expo                                       | Expo 플랫폼 및 모듈                     |
| expo-router                                | 화면 라우팅 및 내비게이션               |
| @expo/vector-icons                         | 아이콘                                  |
| @react-navigation/native, bottom-tabs      | 내비게이션/탭 구조                      |
| firebase                                   | 실시간 DB, 인증 등 백엔드 서비스        |
| @mediapipe/pose, @tensorflow-models/pose-detection | 실시간 자세 인식(운동 자세 교정) |
| react-native-webview                       | 앱 내 웹뷰(AR/운동 자세 교정 화면)      |
| expo-notifications                         | 푸시 알림                               |
| expo-location                              | 위치 기반 서비스(Google Maps 등)        |
| @react-native-community/datetimepicker      | 날짜/시간 선택 UI                       |
| axios                                      | 외부 API 통신                           |
| lottie-react-native                        | 애니메이션                              |
| openai                                     | 챗봇 등 AI API 연동                     |
| react-native-maps                          | 지도/위치 기반 기능                     |
| react-native-chart-kit, react-native-svg    | 데이터 시각화(그래프 등)                |
| expo-camera, expo-image-picker, expo-image-manipulator | 카메라/이미지 처리           |


### 3. 개발 서버 실행

```bash
npx expo start
```

> Android/iOS 시뮬레이터 또는 실제 디바이스에서 테스트 가능


---
## 간편 빌드 및 실행 방법

1. **Expo Go 앱 설치**
   - 구글 플레이스토어(또는 앱스토어)에서 **"Expo Go"** 어플리케이션을 검색하여 설치합니다.

2. **로컬 디바이스와 PC 연결**
   - 스마트폰과 PC가 **동일한 Wi-Fi 네트워크**에 연결되어 있어야 합니다.
   - (USB 연결은 필요하지 않지만, 개발자 옵션/USB 디버깅을 켜면 더 안정적입니다.)

3. **개발 서버 실행**
   - 터미널에서 프로젝트 폴더(my-project 아래의 hie-main로 이동 후 아래 명령어 실행:
     ```
     npx expo start
     ```
   - QR코드가 터미널 또는 웹 브라우저에 표시됩니다.

4. **Expo Go 앱으로 실행**
   - 스마트폰에서 Expo Go 앱을 실행한 뒤,  
     `npx expo start` 명령어로 표시된 **QR코드**를 스캔합니다.
   - 앱이 스마트폰에서 바로 실행됩니다.

> 별도의 빌드 과정 없이, 코드를 수정하면 스마트폰에서 바로 실시간으로 반영됩니다.
>  
> **Tip:**  
> - Android/iOS 모두 지원  
> - Expo Go 앱은 Play스토어/앱스토어에서 무료로 다운로드 가능

---
##  How to build

EAS 빌드
> 이 앱은 Custom Workflow를 사용합니다. 로컬 또는 서버에서 EAS 빌드 가능.

### 1. EAS-CLI 설치 및 로그인 (최초 1회)

```bash
npm install -g eas-cli
eas login
```

### 2-1. Android APK 빌드 (개발용)

```bash
eas build --profile development --platform android
```

### 2-2. AAB 빌드 (Play 스토어 제출용)

```bash
eas build --profile production --platform android
```
빌드가 완료되면 Expo 계정 페이지 또는 터미널에 출력되는 링크를 통해 .apk 파일을 다운로드할 수 있습니다.


---
##  테스트된 환경

| 항목 | 버전 |
|------|------|
| Node | 18.x |
| Expo SDK | 52 |
| Android Studio | Electric Eel 이상 |
| Firebase | Realtime Database + Auth |
| Expo CLI | 최신 안정 버전 (`npx expo --version`) |

---
## 테스트 계정
모든 구글계정으로 로그인 후 실행가능

---
## Description of Data
- 이 프로젝트는 Firebase Firestore를 실시간 데이터베이스로 사용합니다.
- 별도의 샘플 데이터 파일(.csv, .json 등)은 필요하지 않습니다.
- 앱 설치 및 실행 후, 회원가입과 기능 사용(운동, 게시글 작성 등)을 통해 사용자 데이터가 DB에 자동으로 생성 및 저장됩니다.

---

## Description of used open source and package

- @mediapipe/pose: 실시간 자세 인식을 위한 핵심 라이브러리
- react-native-webview: 앱 내에서 외부 웹 콘텐츠(자세 교정 화면)를 표시하기 위해 사용
- @react-native-community/datetimepicker: 약 복용 시간 설정 UI
- expo-notifications: 약 복용 등 푸시 알림 기능
- expo-location: 위치 기반 서비스 (Google Maps API 연동)
- firebase: 백엔드 서비스(DB, 인증 등) 연동
- axios: 외부 API(Naver News 등)와 통신
  
---


