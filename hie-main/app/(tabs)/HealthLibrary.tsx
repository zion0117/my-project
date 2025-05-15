// components/NaverHealthNews.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
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
  const [scrappedLinks, setScrappedLinks] = useState<string[]>([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get("https://openapi.naver.com/v1/search/news.json", {
        params: {
          query: "건강",
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

  const toggleScrap = (link: string) => {
    setScrappedLinks((prev) =>
      prev.includes(link) ? prev.filter((l) => l !== link) : [...prev, link]
    );
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, "");
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
          <View style={styles.newsItem}>
            <TouchableOpacity onPress={() => openLink(item.link)}>
              <Text style={styles.newsTitle}>{stripHtml(item.title)}</Text>
              <Text style={styles.newsDate}>
                🗓 {new Date(item.pubDate).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleScrap(item.link)}>
              <Ionicons
                name={scrappedLinks.includes(item.link) ? "bookmark" : "bookmark-outline"}
                size={24}
                color={scrappedLinks.includes(item.link) ? "#1C7ED6" : "#aaa"}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1C7ED6",
    fontFamily: "GmarketSansMedium",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  newsItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    fontFamily: "GmarketSansMedium",
  },
  newsDate: {
    fontSize: 13,
    color: "#777",
    marginTop: 6,
    fontFamily: "GmarketSansMedium",
  },
});