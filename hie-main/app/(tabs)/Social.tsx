import React, { useEffect, useState } from 'react';
import { CustomText as Text } from "../../components/CustomText";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { collection, addDoc, onSnapshot, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { db } from './firebaseConfig';
import { useRouter } from 'expo-router';

const Social = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetched.reverse());
    });

    return () => unsubscribe();
  }, []);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    const user = auth.currentUser;
    if (!user) return Alert.alert('로그인이 필요합니다.');

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
      console.error('글쓰기 실패:', error);
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

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* 홈으로 돌아가기 버튼 */}
      <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/home')}>
        <Ionicons name="arrow-back" size={20} color="#007AFF" />
        <Text style={styles.homeButtonText}>홈으로</Text>
      </TouchableOpacity>

      <Text style={styles.header}>💬 커뮤니티</Text>

      {/* 팀 활동 모집 섹션 */}
      <View style={styles.teamCard}>
        <Ionicons name="megaphone-outline" size={20} color="#1E90FF" style={{ marginRight: 8 }} />
        <Text style={styles.teamTitle}>함께 운동할 사람을 찾고 있나요?</Text>
        <Text style={styles.teamSubtitle}>지금 바로 팀 활동을 모집해보세요!</Text>
        <TouchableOpacity style={styles.teamButton} onPress={() => Alert.alert('준비 중입니다')}>
          <Text style={styles.teamButtonText}>팀 만들기</Text>
        </TouchableOpacity>
      </View>

      {/* 글 작성 입력창 */}
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

      {/* 게시글 목록 */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
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
        )}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  container: { flex: 1, backgroundColor: '#F0F8FF', padding: 16 }, // 연한 파란색 배경
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'GmarketSansMedium',
  },
  teamCard: {
    backgroundColor: '#E0F0FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  teamTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 4,
    fontFamily: 'GmarketSansMedium',
    color: '#333',
  },
  teamSubtitle: {
    fontSize: 13,
    color: '#555',
    marginBottom: 10,
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
});

export default Social;
