# RecordFlow (Windows) — Screen + Camera Recorder

RecordFlow is a lightweight Windows desktop app (Tauri + React + Rust) for recording your screen with an optional camera overlay and microphone audio, saved as an `mp4`.

## Download (Windows)

Download the latest Windows installer from GitHub Releases:

- Windows (recommended): [Download tauri-02_0.1.0_x64-setup.exe](https://github.com/Waqar-743/Screen-and-Camera-Recording-app/releases/latest/download/tauri-02_0.1.0_x64-setup.exe)
- Windows (MSI): [Download tauri-02_0.1.0_x64_en-US.msi](https://github.com/Waqar-743/Screen-and-Camera-Recording-app/releases/latest/download/tauri-02_0.1.0_x64_en-US.msi)

Note: these are **direct download** links and will work once you upload the installers to the GitHub Release as assets.

## Features

- Screen recording (720p/1080p)
- Optional camera overlay (position + size)
- Microphone recording with volume control
- Pause / resume / stop
- Saves to `Documents/RecordFlow/Recordings` as `recording_YYYYMMDD_HHMMSS.mp4`

## Development

```bash
npm install
npm run tauri dev
```
