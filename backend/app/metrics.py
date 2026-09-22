import time
from typing import Optional


class Timer:
    """Accurate latency timer using time.perf_counter()."""

    def __init__(self):
        self._start_time: Optional[float] = None
        self._elapsed_ms: Optional[float] = None

    def start(self) -> "Timer":
        self._start_time = time.perf_counter()
        self._elapsed_ms = None
        return self

    def stop(self) -> float:
        if self._start_time is None:
            raise RuntimeError("Timer was not started.")
        self._elapsed_ms = (time.perf_counter() - self._start_time) * 1000.0
        return self._elapsed_ms

    @property
    def elapsed_ms(self) -> Optional[float]:
        return round(self._elapsed_ms, 2) if self._elapsed_ms is not None else None
