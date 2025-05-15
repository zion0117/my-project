// components/NaverHealthNews.tsx
import React, { useEffect, useState } from "react";
import { View, FlatList, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Linking, Alert } from "react-native";
import axios from "axios";
import Constants from "expo-constants";

const NAVER_CLIENT_ID = "4aVFZccvVJgF7qCpiiDv";
const NAVER_CLIENT_SECRET = "NUyJwSYKB9";

interface Article {
  title: string;
  link: string;
  pubDate: string;
}

export default function NaverHealthNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get("https://openapi.naver.com/v1/search/news.json", {
        params: {
          query: "건강", // 검색 키워드
          display: 10,
          sort: "date",
        },
        headers: {
          "X-Naver-Client-Id": NAVER_CLIENT_ID,
          "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
        },
      });

      setArticles(response.data.items);
    } catch (error) {
      console.error("뉴스 로드 오류:", error);
      Alert.alert("뉴스 로드 실패", "네이버 뉴스 API 요청 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📰 네이버 건강 뉴스</Text>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.link}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openLink(item.link)} style={styles.newsItem}>
            <Text style={styles.newsTitle}>{stripHtml(item.title)}</Text>
            <Text style={styles.newsDate}>{new Date(item.pubDate).toLocaleDateString()}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>?/gm, "");
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  newsItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  newsTitle: { fontSize: 16, fontWeight: "500" },
  newsDate: { fontSize: 12, color: "#888" },
});
