import React, { useEffect, useState } from "react";
import { View,  FlatList, Image, ActivityIndicator, StyleSheet, Alert } from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { CustomText as Text } from "../../components/CustomText";

const NEWS_API_KEY = Constants.expoConfig?.extra?.newsApiKey || "";

interface Article {
  title: string;
  description: string;
  urlToImage: string;
  url: string;
}

export default function HealthNews() {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("뉴스 API KEY:", NEWS_API_KEY); // ✅ API 키 확인
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      if (!NEWS_API_KEY) {
        throw new Error("API 키가 없습니다. expo.extra.newsApiKey를 확인하세요.");
      }

      const response = await axios.get<{ articles: Article[] }>(
        `https://newsapi.org/v2/top-headlines?category=health&sources=bbc-news,cnn&apiKey=${NEWS_API_KEY}`
      );

      console.log("뉴스 응답 데이터:", response.data); // ✅ 응답 데이터 확인

      if (!response.data.articles || response.data.articles.length === 0) {
        throw new Error("불러온 뉴스가 없습니다.");
      }

      setNews(response.data.articles);
      console.log("불러온 뉴스 개수:", response.data.articles.length); // ✅ 뉴스 개수 확인
    } catch (error) {
      console.error("뉴스 로드 실패:", error);
      Alert.alert("오류 발생", "뉴스를 불러오지 못했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📰 건강 뉴스</Text>

      {news.length === 0 ? (
        <Text style={styles.errorText}>❌ 현재 표시할 뉴스가 없습니다.</Text>
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => (
            <View style={styles.newsItem}>
              {item.urlToImage && <Image source={{ uri: item.urlToImage }} style={styles.newsImage} />}
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsDescription}>{item.description}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  newsItem: { marginBottom: 16, padding: 10, backgroundColor: "#f5f5f5", borderRadius: 8 },
  newsTitle: { fontSize: 16, fontWeight: "bold" },
  newsDescription: { fontSize: 14, color: "#555" },
  newsImage: { width: "100%", height: 200, borderRadius: 8, marginBottom: 10 },
  errorText: { textAlign: "center", fontSize: 16, color: "red", marginTop: 20 },
});

