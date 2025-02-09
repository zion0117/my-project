# sentiment_analysis.py

from transformers import pipeline

# 1. Hugging Face의 감정 분석 파이프라인 초기화
#    다국어 지원 모델을 사용하여 한국어 입력에도 대응합니다.
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="nlptown/bert-base-multilingual-uncased-sentiment"
)

def get_health_tip(user_input: str) -> str:
    """
    사용자가 입력한 기분 문장을 분석하여 적절한 건강 팁을 반환합니다.

    Args:
        user_input (str): 사용자가 입력한 기분 혹은 감정 관련 문장.
    
    Returns:
        str: 감정 분석 결과에 따른 추천 건강 팁.
    """
    # 2. 입력 문장에 대해 감정 분석 수행
    results = sentiment_pipeline(user_input)
    # results 예시: [{'label': '1 star', 'score': 0.75}]
    sentiment_label = results[0]['label']  # 예: "1 star", "2 stars", ...
    
    # 3. 별점(숫자)를 추출하여 정수로 변환
    try:
        star_rating = int(sentiment_label[0])
    except (ValueError, IndexError):
        # 예상치 못한 포맷의 경우 중립적인 건강 팁 반환
        return "균형 잡힌 기분입니다. 꾸준한 운동과 건강한 식습관을 유지해보세요."
    
    # 4. 별점에 따라 건강 팁 추천 결정
    if star_rating <= 2:
        # 1~2성: 부정적인 감정 (예: 스트레스)
        return "스트레스가 높습니다. 5분 호흡 운동을 시도해보세요."
    elif star_rating == 3:
        # 3성: 중립적 감정
        return "균형 잡힌 기분입니다. 꾸준한 운동과 건강한 식습관을 유지해보세요."
    else:
        # 4~5성: 긍정적인 감정
        return "좋은 기분입니다! 이 상태를 유지하기 위해 잠시 휴식을 취하거나 산책을 해보세요."

# 5. 모듈 단독 실행 시 테스트 실행
if __name__ == "__main__":
    # 예시 입력들
    test_inputs = [
        "스트레스가 너무 많아요.",
        "오늘 기분이 정말 좋아요!",
        "평범한 하루를 보내고 있어요."
    ]
    
    for text in test_inputs:
        tip = get_health_tip(text)
        print(f"입력: {text}\n추천 건강 팁: {tip}\n")
