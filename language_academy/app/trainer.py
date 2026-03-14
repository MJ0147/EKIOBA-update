from pathlib import Path

from .edo_model import EdoLanguageModel


def train_model() -> dict[str, int | str]:
    data_path = Path(__file__).resolve().parent / "data" / "edo_vocab.json"
    model = EdoLanguageModel(data_path)
    return model.train_summary()
