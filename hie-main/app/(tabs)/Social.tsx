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
} from 'react-native';
import { collection, addDoc, onSnapshot, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { db } from './firebaseConfig';
import { useRouter } from 'expo-router'; // ✅ 추가

const Social = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const auth = getAuth();
  const router = useRouter(); // ✅ 홈 이동용 라우터

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
        author: user.email || '익명',
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
      {/* ✅ 홈으로 돌아가기 버튼 */}
      <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/home')}>
        <Ionicons name="arrow-back" size={20} color="#007AFF" />
        <Text style={styles.homeButtonText}>홈으로</Text>
      </TouchableOpacity>

      <Text style={styles.header}>💬 커뮤니티</Text>

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

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-circle-outline" size={24} color="#1877f2" />
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
  container: { flex: 1, backgroundColor: '#F8F9FB', padding: 16 },
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
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
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
  },
  postText: {
    fontSize: 13,
    color: '#333',
    marginVertical: 8,
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
  },
});

export default Social;
