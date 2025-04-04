import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { collection, addDoc, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from './firebaseConfig'; // ✅ 너의 Firebase 설정 파일 경로 맞게 수정

const Social = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const auth = getAuth();

  // ✅ Firestore 실시간 글 불러오기
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

  // ✅ 글쓰기 기능
  const handlePost = async () => {
    if (!newPost.trim()) return;
    const user = auth.currentUser;
    if (!user) return Alert.alert('로그인 필요');

    try {
      await addDoc(collection(db, 'posts'), {
        title: newPost,
        content: '',
        author: user.uid,
        timestamp: new Date(),
        likes: 0,
      });
      setNewPost('');
    } catch (error) {
      console.error('글쓰기 실패:', error);
      Alert.alert('오류', '글을 작성할 수 없습니다.');
    }
  };

  // ✅ 좋아요 기능
  const handleLike = async (id: string, currentLikes: number) => {
    try {
      const postRef = doc(db, 'posts', id);
      await updateDoc(postRef, { likes: currentLikes + 1 });
    } catch (error) {
      console.error('좋아요 실패:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🗨️ 커뮤니티</Text>

      {/* 글 작성 입력창 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="글을 작성하세요"
          value={newPost}
          onChangeText={setNewPost}
        />
        <TouchableOpacity onPress={handlePost} style={styles.postButton}>
          <Text style={styles.postButtonText}>작성</Text>
        </TouchableOpacity>
      </View>

      {/* 글 리스트 */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.postText}>{item.title}</Text>
            <TouchableOpacity onPress={() => handleLike(item.id, item.likes)}>
              <Text style={styles.like}>❤️ {item.likes}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  inputContainer: { flexDirection: 'row', marginBottom: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
  },
  postButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginLeft: 8,
    borderRadius: 6,
  },
  postButtonText: { color: '#fff', fontWeight: 'bold' },
  post: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  postText: { fontSize: 16 },
  like: { marginTop: 8, color: '#e0245e' },
});

export default Social;
