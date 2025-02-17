import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 가상의 데이터 (상세 내용을 길게 작성)
const data = [
  { id: '1', title: '2025 건강 검사 안내', date: '2025-02-20', description: '지역 보건소에서 무료 건강 검사를 진행합니다. 이 검사에는 혈압, 혈당, 콜레스테롤, 시력 검사와 같은 기본적인 검사가 포함되어 있으며, 각종 건강 상담과 함께 건강 관리 방법에 대한 안내도 받을 수 있습니다. 이 검사는 만 60세 이상 시니어를 대상으로 하며, 선착순으로 신청을 받습니다. 건강에 대한 관심이 있는 시니어 분들의 많은 참여 바랍니다.' },
  { id: '2', title: '노년기 운동 프로그램', date: '2025-03-01', description: '노인을 위한 맞춤형 운동 프로그램이 시작됩니다. 이 프로그램은 노년기 건강을 증진시키고, 근력 및 유연성을 개선하는 데 초점을 맞추고 있습니다. 참여자들은 운동을 통해 건강을 유지하고, 일상생활에서 필요한 신체 능력을 향상시킬 수 있습니다. 매주 2회씩 진행되며, 운동 강사는 전문적인 자격을 갖춘 운동 전문가입니다. 많은 참여를 부탁드립니다.' },
  { id: '3', title: '건강 캠페인 참여 안내', date: '2025-02-28', description: '공공기관에서 진행하는 건강 캠페인에 참여해 보세요. 이 캠페인은 지역 사회에서 건강을 증진시키기 위한 다양한 활동을 제공합니다. 캠페인에는 건강 식습관을 위한 세미나, 걷기 대회, 심리 상담 등이 포함되어 있으며, 참여자들에게는 건강 관리에 도움이 되는 소정의 선물도 제공됩니다. 참여는 누구나 가능하며, 자세한 사항은 웹사이트나 가까운 보건소에 문의해 주세요.' },
  { id: '4', title: '2025 치매 예방 프로그램', date: '2025-03-05', description: '치매 예방을 위한 프로그램이 시작됩니다. 치매는 노인의 삶의 질에 큰 영향을 미치는 질환 중 하나입니다. 이 프로그램은 치매의 초기 증상 예방과 인지 기능 강화를 목표로 합니다. 참가자들은 인지 훈련, 두뇌 자극 활동, 치매 예방에 도움이 되는 건강 식단 등을 배우게 됩니다. 프로그램은 12주 동안 진행되며, 전문가들이 수업을 지도합니다.' },
  { id: '5', title: '고혈압 관리 세미나', date: '2025-02-25', description: '고혈압 관리에 대한 세미나가 개최됩니다. 이 세미나는 고혈압을 예방하고, 이미 고혈압을 앓고 있는 사람들에게 혈압 관리 방법을 제공하는 것을 목표로 합니다. 세미나에서는 고혈압의 위험성, 올바른 식습관, 운동, 약물 치료 방법 등에 대해 다룰 예정입니다. 고혈압을 예방하거나 관리하고 싶은 분들에게 유익한 시간이 될 것입니다.' },
  { id: '6', title: '건강식품 무료 제공', date: '2025-03-10', description: '건강식품을 무료로 제공하는 캠페인에 참여해 보세요. 이 캠페인은 노인의 건강을 지키기 위해 필수적인 비타민과 미네랄, 항산화제를 포함한 다양한 건강식품을 제공하는 행사입니다. 참가자들은 자신의 건강 상태에 맞는 맞춤형 건강식품을 받을 수 있으며, 무료 상담을 통해 건강 상태를 점검받을 수 있습니다. 제공되는 건강식품은 모두 안전하게 인증된 제품들입니다.' },
  { id: '7', title: '노인 대상 운동 기구 기증', date: '2025-03-12', description: '노인을 위한 운동 기구를 기증하는 행사입니다. 이 행사에서는 노인의 건강을 돕기 위한 다양한 운동 기구들이 기증될 예정입니다. 기증되는 운동 기구는 집에서도 쉽게 사용할 수 있는 소형 운동 기구들로, 심혈관 운동, 근력 운동, 유연성 운동을 할 수 있도록 도와줍니다. 기증 받으신 기구들은 무료로 제공되며, 신청은 선착순으로 접수됩니다.' },
  { id: '8', title: '암 예방 캠페인', date: '2025-03-15', description: '암 예방에 관한 중요한 정보를 제공하는 캠페인입니다. 이 캠페인은 암을 예방할 수 있는 다양한 방법들을 소개하며, 암 검사와 예방접종에 대한 정보도 제공합니다. 또한, 암에 대한 인식을 높이고, 암 예방을 위한 생활 습관을 변화시킬 수 있는 기회를 제공합니다. 이 캠페인은 모든 시니어에게 열려 있으며, 각종 예방 정보와 무료 검진 서비스를 제공합니다.' },
  { id: '9', title: '지역 사회 건강 축제', date: '2025-03-20', description: '지역 사회의 건강 축제에 참여해 보세요! 이 축제는 지역 주민들이 건강을 즐겁게 유지할 수 있도록 다양한 활동을 제공하는 행사입니다. 축제에서는 무료 운동 강좌, 건강 검진, 식이 요법 워크숍 등이 열리며, 가족과 함께 참여할 수 있는 다양한 게임과 활동도 마련됩니다. 모두가 건강하게 즐길 수 있는 기회이니 많은 참여 부탁드립니다.' },
  { id: '10', title: '시니어 운동 교실', date: '2025-03-25', description: '시니어를 위한 맞춤형 운동 교실이 개설됩니다. 이 운동 교실은 시니어의 신체 능력에 맞춘 운동 프로그램을 제공합니다. 운동 강사는 시니어 운동 전문가로, 안전하고 효과적인 운동을 지도할 것입니다. 운동 교실에서는 유산소 운동, 스트레칭, 근력 운동 등을 다루며, 시니어들의 신체 기능 향상과 건강 증진을 목표로 합니다.' },
];

// 게시판 아이템 렌더링 함수
const renderItem = ({ item, navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate('Detail', { item })}>
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  </TouchableOpacity>
);

// 게시글 상세 페이지
const DetailScreen = ({ route }) => {
  const { item } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
};

const Stack = createStackNavigator();

function InfoBoard({ navigation }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={(props) => renderItem({ ...props, navigation })}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InfoBoard">
        <Stack.Screen name="InfoBoard" component={InfoBoard} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
});
