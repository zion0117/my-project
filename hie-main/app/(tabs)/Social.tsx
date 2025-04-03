import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import { collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

interface Post {
  id: string;
  content: string;
  timestamp: any;
}

export default function Social() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');

  // ✅ Firestore에서 실시간으로 글 가져오기
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
      const fetchedPosts: Post[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        content: doc.data().content,
        timestamp: doc.data().timestamp,
      }));
      // 최신순 정렬
      const sorted = fetchedPosts.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
      setPosts(sorted);
    });

    return () => unsubscribe();
  }, []);

  // ✅ 새 글 Firestore에 추가
  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;

    try {
      await addDoc(collection(db, 'posts'), {
        content: newPost,
        timestamp: serverTimestamp(),
      });
      setNewPost('');
    } catch (error) {
      console.error('글 작성 실패:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📝 커뮤니티</Text>

      {/* ✅ 글쓰기 입력창 */}
      <TextInput
        style={styles.input}
        placeholder="글을 작성해보세요..."
        value={newPost}
        onChangeText={setNewPost}
      />
      <Button title="등록" onPress={handlePostSubmit} />

      {/* ✅ 글 목록 */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text style={styles.postContent}>{item.content}</Text>
            <Text style={styles.timestamp}>
              {item.timestamp?.toDate().toLocaleString() || '작성 중...'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  postContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  postContent: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
