type Props = {
  isRecording: boolean;
  isPaused: boolean;
  onStart: () => Promise<void>;
  onStop: () => Promise<void>;
  onPause: () => Promise<void>;
  onResume: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

export function RecordingControls({
  isRecording,
  isPaused,
  onStart,
  onStop,
  onPause,
  onResume,
  loading,
  error,
}: Props) {
  const statusText = isRecording ? (isPaused ? "Paused" : "Recording...") : "Ready";

  const startDisabled = loading || isRecording;
  const stopDisabled = loading || !isRecording;
  const pauseDisabled = loading || !isRecording || isPaused;
  const resumeDisabled = loading || !isRecording || !isPaused;

  return (
    <section className="rf-card">
      <div className="rf-controls-header">
        <div className={isRecording ? "rf-dot rf-dot-on" : "rf-dot"} />
        <div className="rf-status">{statusText}</div>
      </div>

      <div className="rf-controls-grid">
        <button className="rf-btn rf-btn-start" disabled={startDisabled} onClick={() => void onStart()}>
          START
        </button>

        {isRecording && !isPaused ? (
          <button
            className="rf-btn rf-btn-pause"
            disabled={pauseDisabled}
            onClick={() => void onPause()}
          >
            PAUSE
          </button>
        ) : null}

        {isRecording && isPaused ? (
          <button
            className="rf-btn rf-btn-resume"
            disabled={resumeDisabled}
            onClick={() => void onResume()}
          >
            RESUME
          </button>
        ) : null}

        <button className="rf-btn rf-btn-stop" disabled={stopDisabled} onClick={() => void onStop()}>
          STOP
        </button>
      </div>

      {error ? <div className="rf-error">{error}</div> : null}
    </section>
  );
}
