type Props = {
  elapsedSeconds: number;
  isRecording: boolean;
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

export function RecordingTimer({ elapsedSeconds, isRecording }: Props) {
  const warn = elapsedSeconds >= 5 * 60;
  const className = !isRecording
    ? "rf-timer rf-timer-idle"
    : warn
      ? "rf-timer rf-timer-warn"
      : "rf-timer rf-timer-rec";

  return <div className={className}>{formatTime(isRecording ? elapsedSeconds : 0)}</div>;
}
