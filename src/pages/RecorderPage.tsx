import { useEffect, useMemo, useState } from "react";
import { AudioSettings } from "../components/AudioSettings";
import { CameraSettings } from "../components/CameraSettings";
import { DisplaySelector } from "../components/DisplaySelector";
import { RecordingControls } from "../components/RecordingControls";
import { RecordingTimer } from "../components/RecordingTimer";
import { VideoSettings } from "../components/VideoSettings";
import { useRecording } from "../hooks/useRecording";
import { useSettings } from "../hooks/useSettings";
import { useTimerHistory } from "../hooks/useTimerHistory";
import { tauriService } from "../services/tauri.service";
import type { CameraPosition, CameraSize, RecordingInfo, Resolution } from "../types";

export function RecorderPage() {
  const { settings, loading: settingsLoading, error: settingsError, updateSettings } = useSettings();
  const recording = useRecording();
  const history = useTimerHistory();
  const [lastInfo, setLastInfo] = useState<RecordingInfo | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (!recording.status.is_recording && recording.status.output_file) {
      void (async () => {
        try {
          setFileError(null);
          const info = await tauriService.getLastRecordingInfo();
          setLastInfo(info);
        } catch (e) {
          setFileError(String(e));
        }
      })();

      void history.refresh();
    }
  }, [history.refresh, recording.status.is_recording, recording.status.output_file]);

  const canStart = useMemo(() => {
    if (!settings) return false;
    return settings.screen_enabled || settings.camera_enabled || settings.mic_enabled || settings.system_audio_enabled;
  }, [settings]);

  if (settingsLoading) {
    return (
      <main className="rf-app">
        <div className="rf-header">
          <div className="rf-title">RecordFlow</div>
          <div className="rf-subtitle">Loading…</div>
        </div>
      </main>
    );
  }

  if (settingsError && !settings) {
    return (
      <main className="rf-app">
        <div className="rf-header">
          <div className="rf-title">RecordFlow</div>
          <div className="rf-subtitle">Error</div>
        </div>
        <div className="rf-error" style={{ padding: "2rem", color: "red" }}>
          <p>Failed to load settings. Is the Tauri backend running?</p>
          <pre>{settingsError}</pre>
        </div>
      </main>
    );
  }

  if (!settings) return null;

  const onResolutionChange = async (r: Resolution) => {
    await updateSettings({ resolution: r, fps: 30, bitrate: 5000 });
  };

  const onScreenToggle = async (enabled: boolean) => {
    await updateSettings({ screen_enabled: enabled });
  };

  const onDisplayChange = async (idx: number) => {
    await updateSettings({ selected_display: idx });
  };

  const onCameraToggle = async (enabled: boolean) => {
    await updateSettings({ camera_enabled: enabled });
  };

  const onCameraChange = async (idx: string) => {
    await updateSettings({ selected_camera: idx });
  };

  const onPositionChange = async (pos: CameraPosition) => {
    await updateSettings({ camera_position: pos });
  };

  const onSizeChange = async (size: CameraSize) => {
    await updateSettings({ camera_size: size });
  };

  const onMicToggle = async (enabled: boolean) => {
    await updateSettings({ mic_enabled: enabled });
  };

  const onMicChange = async (name: string) => {
    await updateSettings({ microphone_device: name });
  };

  const onMicVolume = async (v: number) => {
    await updateSettings({ mic_volume: v });
  };

  const onSystemToggle = async (enabled: boolean) => {
    await updateSettings({ system_audio_enabled: enabled });
  };

  const onSystemChange = async (name: string) => {
    await updateSettings({ system_audio_device: name });
  };

  const onSystemVolume = async (v: number) => {
    await updateSettings({ system_audio_volume: v });
  };

  const start = async () => {
    if (!canStart) return;
    await recording.start();
  };

  return (
    <main className="rf-app">
      <div className="rf-header">
        <div className="rf-title">RecordFlow</div>
        <div className="rf-subtitle">Screen + Camera recording (Windows)</div>
      </div>

      {settingsError ? <div className="rf-error">{settingsError}</div> : null}

      <div className="rf-layout">
        <div className="rf-left">
          <VideoSettings
            selectedResolution={settings.resolution}
            onResolutionChange={onResolutionChange}
          />
          <DisplaySelector
            selectedDisplay={settings.selected_display}
            onDisplayChange={onDisplayChange}
            screenEnabled={settings.screen_enabled}
            onScreenToggle={onScreenToggle}
          />
          <CameraSettings
            cameraEnabled={settings.camera_enabled}
            onToggle={onCameraToggle}
            selectedCamera={settings.selected_camera ?? ""}
            onCameraChange={onCameraChange}
            selectedPosition={settings.camera_position}
            onPositionChange={onPositionChange}
            selectedSize={settings.camera_size}
            onSizeChange={onSizeChange}
          />
          <AudioSettings
            micEnabled={settings.mic_enabled}
            onMicToggle={onMicToggle}
            selectedMic={settings.microphone_device}
            onMicChange={onMicChange}
            micVolume={settings.mic_volume}
            onMicVolume={onMicVolume}
            systemAudioEnabled={settings.system_audio_enabled}
            onSystemAudioToggle={onSystemToggle}
            selectedSystemAudio={settings.system_audio_device}
            onSystemAudioChange={onSystemChange}
            systemAudioVolume={settings.system_audio_volume}
            onSystemAudioVolume={onSystemVolume}
          />
        </div>

        <div className="rf-right">
          <section className="rf-card">
            <div className="rf-card-title">Timer</div>
            <RecordingTimer
              elapsedSeconds={recording.status.elapsed_seconds}
              isRecording={recording.status.is_recording}
            />
          </section>

          <RecordingControls
            isRecording={recording.status.is_recording}
            isPaused={recording.status.is_paused}
            onStart={start}
            onStop={recording.stop}
            onPause={recording.pause}
            onResume={recording.resume}
            loading={recording.loading}
            error={!canStart ? "Enable at least one input (screen/camera/audio)" : recording.error}
          />

          <section className="rf-card">
            <div className="rf-card-title">Last Recording</div>
            {lastInfo ? (
              <>
                <div className="rf-kv">
                  <div className="rf-k">File</div>
                  <div className="rf-v">{lastInfo.file_name}</div>
                </div>
                <div className="rf-kv">
                  <div className="rf-k">Size</div>
                  <div className="rf-v">{Math.round((lastInfo.file_size / (1024 * 1024)) * 10) / 10} MB</div>
                </div>
                <div className="rf-kv">
                  <div className="rf-k">Created</div>
                  <div className="rf-v">{lastInfo.created_at}</div>
                </div>

                <div className="rf-row">
                  <button
                    className="rf-btn rf-btn-secondary"
                    type="button"
                    onClick={() => void tauriService.openRecordingInExplorer(lastInfo.file_path)}
                  >
                    Open in Explorer
                  </button>
                  <button
                    className="rf-btn rf-btn-secondary"
                    type="button"
                    onClick={() => void tauriService.openRecordingsFolder()}
                  >
                    Open Folder
                  </button>
                </div>
              </>
            ) : (
              <div className="rf-hint">No recording yet.</div>
            )}

            {fileError ? <div className="rf-error">{fileError}</div> : null}
          </section>

          <section className="rf-card">
            <div className="rf-card-title">History</div>
            {history.sessions.length ? (
              <div className="rf-col" style={{ gap: ".5rem" }}>
                {history.sessions.slice(0, 10).map((s) => (
                  <div key={s.id} className="rf-kv">
                    <div className="rf-k">
                      {s.status} · {Math.round(s.duration_seconds)}s
                    </div>
                    <div className="rf-v" title={s.output_file ?? undefined}>
                      {s.started_at}
                    </div>
                    <button
                      className="rf-btn rf-btn-secondary"
                      type="button"
                      disabled={history.loading}
                      onClick={() => void history.remove(s.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="rf-row">
                  <button
                    className="rf-btn rf-btn-secondary"
                    type="button"
                    disabled={history.loading}
                    onClick={() => void history.clear()}
                  >
                    Clear history
                  </button>
                </div>
              </div>
            ) : (
              <div className="rf-hint">No sessions yet.</div>
            )}

            {history.error ? <div className="rf-error">{history.error}</div> : null}
          </section>
        </div>
      </div>
    </main>
  );
}
