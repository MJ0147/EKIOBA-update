from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_train_returns_summary() -> None:
    response = client.post("/train")
    assert response.status_code == 200
    payload = response.json()
    assert payload["model"] == "edo-vocab-baseline-v1"
    assert payload["vocab_size"] >= 5


def test_quiz_question_has_options() -> None:
    response = client.get("/quiz/question")
    assert response.status_code == 200
    payload = response.json()
    assert "prompt" in payload
    assert len(payload["options"]) == 4


def test_translate_en_to_edo() -> None:
    response = client.post("/translate", json={"text": "hello", "direction": "en_to_edo"})
    assert response.status_code == 200
    assert "translated_text" in response.json()
