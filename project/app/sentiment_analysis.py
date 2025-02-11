from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# 감정 분석 모델 초기화 (다국어 지원)
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="nlptown/bert-base-multilingual-uncased-sentiment"
)

def get_health_tip(user_input: str) -> str:
    """
    사용자가 입력한 감정 문장을 분석하고 건강 팁을 반환하는 함수.
    """
    results = sentiment_pipeline(user_input)
    sentiment_label = results[0]['label']  # 예: "1 star", "2 stars", ...

    try:
        star_rating = int(sentiment_label[0])  # 첫 번째 문자(숫자) 가져오기
    except (ValueError, IndexError):
        return "균형 잡힌 기분입니다. 꾸준한 운동과 건강한 식습관을 유지해보세요."

    # 별점에 따른 건강 팁 반환
    if star_rating <= 2:
        return "스트레스가 높습니다. 5분 호흡 운동을 시도해보세요."
    elif star_rating == 3:
        return "균형 잡힌 기분입니다. 꾸준한 운동과 건강한 식습관을 유지해보세요."
    else:
        return "좋은 기분입니다! 이 상태를 유지하기 위해 잠시 휴식을 취하거나 산책을 해보세요."

@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    """
    React Native 앱에서 요청을 보내면 감정 분석 결과를 JSON으로 반환하는 API.
    """
    data = request.json
    user_input = data.get("text", "")
    
    health_tip = get_health_tip(user_input)
    
    return jsonify({"text": user_input, "tip": health_tip})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
