from __future__ import annotations

import json
import random
from dataclasses import dataclass
from pathlib import Path


@dataclass
class EdoWord:
    edo: str
    english: str
    category: str
    example: str


class EdoLanguageModel:
    def __init__(self, data_path: Path) -> None:
        self.data_path = data_path
        self.words = self._load_words()
        self.english_to_edo = {item.english.lower(): item.edo for item in self.words}
        self.edo_to_english = {item.edo.lower(): item.english for item in self.words}

    def _load_words(self) -> list[EdoWord]:
        with self.data_path.open("r", encoding="utf-8") as file:
            raw_items = json.load(file)
        return [EdoWord(**item) for item in raw_items]

    def train_summary(self) -> dict[str, int | str]:
        categories = {item.category for item in self.words}
        return {
            "model": "edo-vocab-baseline-v1",
            "vocab_size": len(self.words),
            "categories": len(categories),
        }

    def translate(self, phrase: str, direction: str) -> str:
        tokens = phrase.lower().split()
        if direction == "en_to_edo":
            translated = [self.english_to_edo.get(token, f"[{token}]") for token in tokens]
        else:
            translated = [self.edo_to_english.get(token, f"[{token}]") for token in tokens]
        return " ".join(translated)

    def vocabulary(self, category: str | None = None, limit: int = 10) -> list[dict[str, str]]:
        pool = self.words
        if category:
            pool = [item for item in pool if item.category == category]
        items = pool[: max(1, limit)]
        return [
            {
                "edo": item.edo,
                "english": item.english,
                "category": item.category,
                "example": item.example,
            }
            for item in items
        ]

    def quiz_question(self) -> dict[str, str | list[str]]:
        answer = random.choice(self.words)
        distractors = [word.english for word in self.words if word.english != answer.english]
        random.shuffle(distractors)
        options = [answer.english, *distractors[:3]]
        random.shuffle(options)
        return {
            "prompt": f"What is the meaning of '{answer.edo}'?",
            "answer": answer.english,
            "options": options,
        }
