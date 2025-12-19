# RecordFlow (Windows) — Screen + Camera Recorder

RecordFlow is a lightweight Windows desktop app (Tauri + React + Rust) for recording your screen with an optional camera overlay and microphone audio, saved as an `mp4`.

## Download (Windows)

Download the latest Windows installer from GitHub Releases:

- Windows (recommended): [Download RecordFlow-setup.exe](https://github.com/Waqar-743/Screen-and-Camera-Recording-app/releases/latest/download/RecordFlow-setup.exe)
- Windows (MSI): [Download RecordFlow.msi](https://github.com/Waqar-743/Screen-and-Camera-Recording-app/releases/latest/download/RecordFlow.msi)

Note: these are **direct download** links and will work once you publish a GitHub Release and upload the installers with the exact filenames above (this repo currently has no Releases).

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
