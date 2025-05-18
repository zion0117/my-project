// ✅ Social.tsx 전체 통합 코드
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import React, { useEffect, useState } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import { CustomText as Text } from "../../components/CustomText";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { collection, addDoc, onSnapshot, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { db } from './firebaseConfig';
import { useRouter } from 'expo-router';

const Social = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [teams, setTeams] = useState<any[]>([]);
  const [newTeamTitle, setNewTeamTitle] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const auth = getAuth();
  const router = useRouter();
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.replace('/');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );



  const handleNavigateHome = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 1000);
  };

  useEffect(() => {
    const unsubscribePosts = onSnapshot(collection(db, 'posts'), (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(fetched.reverse());
    });
    const unsubscribeTeams = onSnapshot(collection(db, 'teams'), (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTeams(fetched.reverse());
    });
    return () => {
      unsubscribePosts();
      unsubscribeTeams();
    };
  }, []);

  const handlePost = async () => {
    const user = auth.currentUser;
    if (!newPost.trim() || !user) return;
    try {
      await addDoc(collection(db, 'posts'), {
        title: newPost,
        author: user.displayName || '익명',
        photoURL: user.photoURL || null,
        timestamp: Timestamp.now(),
        likes: 0,
      });
      setNewPost('');
    } catch (error) {
      Alert.alert('오류', '글을 작성할 수 없습니다.');
    }
  };

  const handleLike = async (id: string, currentLikes: number) => {
    try {
      const postRef = doc(db, 'posts', id);
      await updateDoc(postRef, { likes: currentLikes + 1 });
    } catch (error) {
      console.error('좋아요 실패:', error);
    }
  };

  const handleCreateTeam = async () => {
    const user = auth.currentUser;
    if (!newTeamTitle.trim() || !user) return;
    try {
      await addDoc(collection(db, 'teams'), {
        title: newTeamTitle,
        createdBy: user.displayName || '익명',
        members: [user.uid],
        timestamp: Timestamp.now(),
      });
      setNewTeamTitle('');
      Alert.alert('팀 생성 완료', `${newTeamTitle} 팀이 만들어졌어요!`);
    } catch (error) {
      Alert.alert('오류', '팀을 생성할 수 없습니다.');
    }
  };

  const handleJoinTeam = async (teamId: string, members: string[]) => {
    const user = auth.currentUser;
    if (!user) return;
    if (members.includes(user.uid)) return Alert.alert('이미 참여한 팀입니다.');
    try {
      const teamRef = doc(db, 'teams', teamId);
      await updateDoc(teamRef, { members: [...members, user.uid] });
      Alert.alert('팀에 참여했어요!');
    } catch (error) {
      Alert.alert('오류', '팀에 참여할 수 없습니다.');
    }
  };

  const handleLeaveTeam = async () => {
    const user = auth.currentUser;
    if (!user || !selectedTeam) return;
    const updatedMembers = selectedTeam.members.filter((id: string) => id !== user.uid);
    try {
      const teamRef = doc(db, 'teams', selectedTeam.id);
      await updateDoc(teamRef, { members: updatedMembers });
      setModalVisible(false);
      setSelectedTeam(null);
      Alert.alert('팀에서 나갔습니다.');
    } catch (error) {
      Alert.alert('오류', '팀에서 나갈 수 없습니다.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {loading && <LoadingScreen />}
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <TouchableOpacity style={styles.homeButton} onPress={handleNavigateHome}>
          <Ionicons name="arrow-back" size={20} color="#007AFF" />
          <Text style={styles.homeButtonText}>홈으로</Text>
        </TouchableOpacity>

        <Text style={styles.header}>💬 커뮤니티</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="새 팀 이름을 입력하세요"
            value={newTeamTitle}
            onChangeText={setNewTeamTitle}
          />
          <TouchableOpacity style={styles.postButton} onPress={handleCreateTeam}>
            <Ionicons name="add-circle-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.header}>🔥 모집 중인 팀</Text>
        {teams.map((item) => (
          <View style={styles.card} key={item.id}>
            <Text style={styles.teamTitle}>{item.title}</Text>
            <Text style={{ fontSize: 13, color: '#555' }}>팀장: {item.createdBy}</Text>
            <Text style={{ fontSize: 12, color: '#888' }}>인원: {item.members.length}명</Text>
            <TouchableOpacity style={styles.teamButton} onPress={() => handleJoinTeam(item.id, item.members)}>
              <Text style={styles.teamButtonText}>팀 참여하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.teamButton, { marginTop: 6, backgroundColor: '#666' }]}
              onPress={() => {
                setSelectedTeam(item);
                setModalVisible(true);
              }}
            >
              <Text style={styles.teamButtonText}>상세 보기</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="무엇이든 공유해보세요!"
            value={newPost}
            onChangeText={setNewPost}
          />
          <TouchableOpacity style={styles.postButton} onPress={handlePost}>
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {posts.map((item) => (
          <View style={styles.card} key={item.id}>
            <View style={styles.cardHeader}>
              {item.photoURL ? (
                <Image source={{ uri: item.photoURL }} style={styles.avatar} />
              ) : (
                <Ionicons name="person-circle-outline" size={24} color="#1877f2" />
              )}
              <Text style={styles.authorText}>{item.author}</Text>
            </View>
            <Text style={styles.postText}>{item.title}</Text>
            <TouchableOpacity onPress={() => handleLike(item.id, item.likes)} style={styles.likeButton}>
              <Ionicons name="heart-outline" size={18} color="#e0245e" />
              <Text style={styles.likeText}>{item.likes}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* 팀 상세 모달 */}
      {modalVisible && selectedTeam && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.teamTitle}>{selectedTeam.title}</Text>
            <Text style={{ marginBottom: 8 }}>팀장: {selectedTeam.createdBy}</Text>
            <Text style={{ fontWeight: '600', marginBottom: 4 }}>멤버 목록:</Text>
            {selectedTeam.members.map((memberId: string, index: number) => (
              <Text key={index} style={{ fontSize: 13, color: '#555' }}>
                • {memberId}
              </Text>
            ))}
            <TouchableOpacity style={[styles.teamButton, { marginTop: 16 }]} onPress={handleLeaveTeam}>
              <Text style={styles.teamButtonText}>팀 나가기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 10 }} onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#888' }}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};





//디자인


const styles = StyleSheet.create({
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  container: { flex: 1, backgroundColor: '#F0F8FF', padding: 16 },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  homeButtonText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 6,
    fontWeight: '500',
    fontFamily: 'GmarketSansMedium',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
    marginTop: 12,
    fontFamily: 'GmarketSansMedium',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'GmarketSansMedium',
  },
  postButton: {
    backgroundColor: '#1877f2',
    padding: 10,
    borderRadius: 30,
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  authorText: {
    marginLeft: 8,
    fontWeight: '600',
    color: '#444',
    fontFamily: 'GmarketSansMedium',
  },
  postText: {
    fontSize: 13,
    color: '#333',
    marginVertical: 8,
    fontFamily: 'GmarketSansMedium',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#fce8ed',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  likeText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#e0245e',
    fontWeight: '500',
    fontFamily: 'GmarketSansMedium',
  },
  teamButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  teamButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'GmarketSansMedium',
    textAlign: 'center',
  },
  teamTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'GmarketSansMedium',
    color: '#333',
  },
});

export default Social;
