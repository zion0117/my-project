from transformers import pipeline

# 감정 분석 모델 로드
def load_sentiment_model():
    return pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")

# 감정 분석 함수
def analyze_sentiment(model, user_input):
    result = model(user_input)[0]
    sentiment = result['label']
    return sentiment

# 감정에 따른 건강 팁 추천
def get_health_tip(sentiment):
    tips = {
        '1 star': "스트레스가 높습니다. 5분 호흡 운동을 시도해보세요.",
        '2 stars': "기분이 조금 처져 있군요. 가벼운 산책을 추천합니다.",
        '3 stars': "보통 기분이시네요. 충분한 수면을 취하세요.",
        '4 stars': "좋은 기분입니다! 운동을 꾸준히 유지하세요.",
        '5 stars': "행복한 하루군요! 긍정적인 에너지를 나눠보세요."
    }
    return tips.get(sentiment, "건강한 생활 습관을 유지하세요.")

# 사용자 인터페이스
def main():
    print("감정 기반 건강 팁 추천 시스템")
    model = load_sentiment_model()

    while True:
        user_input = input("현재 기분을 입력하세요 (종료하려면 'exit' 입력): ")
        if user_input.lower() == 'exit':
            print("프로그램을 종료합니다.")
            break

        sentiment = analyze_sentiment(model, user_input)
        health_tip = get_health_tip(sentiment)
        
        print(f"분석된 감정: {sentiment}")
        print(f"추천 건강 팁: {health_tip}")
        print("-" * 50)

if __name__ == "__main__":
    main()
