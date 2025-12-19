# 🎬 RecordFlow - Screen + Camera Recording App
## AI Vibe Coder Optimized Project Specification

**Project Name:** RecordFlow  
**Platform:** Windows Only  
**Tech Stack:** Rust + Tauri + React + TypeScript  
**Estimated Duration:** 3-5 weeks (40-60 hours)  
**AI Tool:** Vibe Coder with incremental generation  

---

## 🤖 How to Use This Spec with Vibe Coder

### **Workflow**

```
STEP 1: Copy prompt from "AI PROMPT TEMPLATE" section
STEP 2: Paste into Vibe Coder
STEP 3: Vibe Coder generates code
STEP 4: Review and integrate into project
STEP 5: Test locally: npm run tauri dev
STEP 6: Move to next phase
```

### **Best Practices with Vibe Coder**

**DO:**
✅ Provide complete context about what's built  
✅ Specify exact file paths  
✅ Ask for ONE component at a time  
✅ Request code with inline comments  
✅ Ask Vibe Coder to follow existing patterns  
✅ Request error handling  
✅ Include integration points  
✅ Specify TypeScript types needed  

**DON'T:**
❌ Ask for entire phases  
❌ Forget error handling  
❌ Skip mentioning dependencies  
❌ Ask for code without file paths  
❌ Request features outside this spec  
❌ Ask for features without dependencies ready  

---

## 📋 Project Overview

**RecordFlow** is a lightweight Windows desktop application for recording screen, camera, and audio simultaneously. Users can flexibly toggle any combination of inputs and save output as MP4 files locally.

### Key Characteristics
- **Flexible Recording:** Choose screen only, camera only, both, or any combination
- **Single File Output:** All inputs composited into one MP4 file
- **Preset Quality:** 720p and 1080p options at 30fps
- **Dual Audio:** Microphone + system audio with volume controls
- **Local Storage:** Auto-organized with timestamp naming
- **Simple UI:** Minimalist, functional interface

---

## ✨ Feature Checklist

### Screen Recording
- [ ] Detect all monitors
- [ ] Select display/window
- [ ] Capture at 720p/1080p
- [ ] 30fps fixed output
- [ ] H.264 MP4 encoding

### Camera Recording
- [ ] Detect webcams
- [ ] Select camera
- [ ] Overlay on screen (4 corners)
- [ ] Adjustable size (small/medium/large)

### Audio Capture
- [ ] Microphone input + volume control
- [ ] System audio input + volume control
- [ ] Mix both sources
- [ ] Sync with video

### Recording Controls
- [ ] Start/Stop/Pause/Resume buttons
- [ ] Real-time timer (HH:MM:SS)
- [ ] Visual indicator (red dot)

### File Management
- [ ] Auto-create Documents/RecordFlow/Recordings
- [ ] Timestamp naming: recording_YYYYMMDD_HHMMSS.mp4
- [ ] Display file info after recording
- [ ] "Open in Explorer" button

### Settings
- [ ] Resolution selector (720p/1080p)
- [ ] FPS display (30 fixed)
- [ ] Bitrate display (5000 kbps)
- [ ] Save location selector
- [ ] Persist settings on close

---

## 🏗️ System Architecture

```
FRONTEND (React)
├─ DisplaySelector → Shows monitors/windows
├─ CameraSettings → Camera position/size selection
├─ AudioSettings → Mic + system audio volume sliders
├─ RecordingControls → Start/Stop/Pause/Resume
├─ RecordingTimer → Shows HH:MM:SS
└─ VideoSettings → Resolution selector

IPC (Tauri Commands)
├─ get_displays() → List monitors
├─ get_cameras() → List webcams
├─ get_audio_inputs() → List microphones
├─ get_system_audio_devices() → List speakers
├─ start_recording() → Begin recording
├─ stop_recording() → End and save
├─ pause_recording() → Pause mid-recording
└─ update_settings() → Save user preferences

BACKEND (Rust)
├─ ScreenCapturer → Frame capture from display
├─ CameraCapturer → Frame capture from camera
├─ MicrophoneCapture → Audio from microphone
├─ SystemAudioCapture → Audio from speakers
├─ AudioMixer → Mix mic + system audio
├─ FrameCompositor → Overlay camera on screen
├─ VideoEncoder → Encode frames to MP4
└─ RecordingManager → Orchestrate all above
```

---

## 📂 File Structure

```
recorder-app/
├─ src-tauri/src/
│  ├─ main.rs (entry point)
│  ├─ lib.rs (exports)
│  ├─ error.rs (error types) ← PHASE 1
│  ├─ state/
│  │  ├─ mod.rs
│  │  └─ app_state.rs (state management) ← PHASE 1
│  ├─ recording/
│  │  ├─ mod.rs
│  │  ├─ manager.rs (orchestrator) ← PHASE 6
│  │  ├─ screen_capturer.rs (screen frames) ← PHASE 2
│  │  ├─ camera_capturer.rs (camera frames) ← PHASE 3
│  │  ├─ audio_capturer.rs (audio capture) ← PHASE 4
│  │  ├─ video_encoder.rs (MP4 encoding) ← PHASE 2
│  │  └─ compositor.rs (overlay camera) ← PHASE 3
│  ├─ commands/
│  │  ├─ mod.rs
│  │  ├─ recording.rs (record controls) ← PHASE 6
│  │  ├─ devices.rs (device detection) ← PHASE 2-4
│  │  ├─ settings.rs (settings save/load) ← PHASE 1
│  │  └─ files.rs (file operations) ← PHASE 6
│  └─ utils/
│     ├─ mod.rs
│     ├─ config.rs (config file I/O) ← PHASE 1
│     └─ paths.rs (path management) ← PHASE 1
├─ src/
│  ├─ components/
│  │  ├─ DisplaySelector.tsx ← PHASE 5
│  │  ├─ CameraSettings.tsx ← PHASE 5
│  │  ├─ AudioSettings.tsx ← PHASE 5
│  │  ├─ RecordingControls.tsx ← PHASE 5
│  │  ├─ RecordingTimer.tsx ← PHASE 5
│  │  ├─ VideoSettings.tsx ← PHASE 5
│  │  ├─ VolumeSlider.tsx ← PHASE 5
│  │  └─ SelectDropdown.tsx ← PHASE 5
│  ├─ pages/
│  │  └─ RecorderPage.tsx ← PHASE 5
│  ├─ hooks/
│  │  ├─ useRecording.ts ← PHASE 5
│  │  ├─ useDevices.ts ← PHASE 5
│  │  └─ useSettings.ts ← PHASE 5
│  ├─ services/
│  │  └─ tauri.service.ts ← PHASE 5
│  ├─ types/
│  │  └─ index.ts (TypeScript interfaces)
│  └─ App.tsx
└─ Cargo.toml (dependencies)
```

---

## 🚀 PHASE 1: Core Infrastructure

### ⏱️ Duration: 8 hours (Days 1-2)

### Vibe Coder Prompt 1.1: Error Handling
```
CONTEXT:
Building RecordFlow - Windows screen + camera recording app using Rust + Tauri + React.

TASK:
Generate comprehensive error handling system for recording application.

FILE PATH: src-tauri/src/error.rs

REQUIREMENTS:
1. RecorderError struct with:
   - code: String
   - message: String
   - details: Option<String>
2. Serializable with #[derive(Serialize)]
3. Implement Display and std::error::Error
4. Factory methods:
   - device_not_found(device_type)
   - already_recording()
   - not_recording()
   - invalid_settings(reason)
   - encoding_failed(reason)
   - file_error(reason)
5. Works with Tauri #[tauri::command] macros
6. Can be returned from async commands

DEPENDENCIES:
- serde with Serialize derive
- std::fmt for Display

ACCEPTANCE CRITERIA:
- Compiles without warnings
- All error variants documented
- Serializes to JSON for frontend
```

### Vibe Coder Prompt 1.2: App State Management
```
CONTEXT:
RecordFlow. Have error.rs. Building state management for recording settings.

TASK:
Generate app state management with all recording settings.

FILE PATH: src-tauri/src/state/app_state.rs
ALSO CREATE: src-tauri/src/state/mod.rs

REQUIREMENTS:
1. RecordingSettings struct with fields:
   - resolution: Resolution enum (P720, P1080)
   - fps: u32 (fixed 30)
   - bitrate: u32 (fixed 5000)
   - selected_display: u32
   - selected_window: Option<String>
   - selected_camera: Option<String>
   - camera_enabled: bool
   - camera_position: CameraPosition (TopLeft/TopRight/BottomLeft/BottomRight)
   - camera_size: CameraSize (Small/Medium/Large)
   - microphone_device: String
   - mic_enabled: bool
   - mic_volume: f32 (0.0-1.0)
   - system_audio_device: String
   - system_audio_enabled: bool
   - system_audio_volume: f32 (0.0-1.0)

2. AppState struct with Arc<Mutex<T>>:
   - settings: Arc<Mutex<RecordingSettings>>
   - is_recording: Arc<Mutex<bool>>
   - is_paused: Arc<Mutex<bool>>
   - output_file: Arc<Mutex<Option<String>>>

3. Methods:
   - pub fn new() -> Self
   - pub fn start_recording(&self, output_file: String) -> Result<(), RecorderError>
   - pub fn stop_recording(&self) -> Result<(), RecorderError>
   - pub fn pause_recording(&self) -> Result<(), RecorderError>
   - pub fn resume_recording(&self) -> Result<(), RecorderError>
   - pub fn update_settings(&self, settings: RecordingSettings)

4. Derive traits:
   - RecordingSettings: Clone, Serialize, Deserialize
   - Resolution/CameraPosition/CameraSize: Serialize, Deserialize with #[serde(rename)]
   - AppState: Clone for use in Tauri

5. Default implementation:
   - 1080p resolution
   - FPS 30, bitrate 5000
   - Camera disabled, bottom-right position, medium size
   - Mic enabled (80% volume), system audio disabled (60% volume)

DEPENDENCIES:
- parking_lot::Mutex (better than std::sync::Mutex)
- std::sync::Arc
- serde with Serialize/Deserialize

USE PATTERN:
let state = Arc::new(AppState::new());
// Pass `state.clone()` to Tauri commands

ACCEPTANCE CRITERIA:
- Thread-safe state access
- No data race issues
- Default values sensible
- Arc can be cloned for Tauri commands
```

### Vibe Coder Prompt 1.3: Config Manager
```
CONTEXT:
RecordFlow. Have error.rs and state/app_state.rs. Building config persistence.

TASK:
Generate config file manager for loading/saving user settings.

FILE PATH: src-tauri/src/utils/config.rs
ALSO CREATE: src-tauri/src/utils/mod.rs

REQUIREMENTS:
1. AppConfig struct with:
   - last_settings: RecordingSettings
   - default_save_location: String
   - window_size: (u32, u32)
   - theme: String ("light" or "dark")
   - Serialize/Deserialize

2. Functions:
   - pub fn load_config() -> Result<AppConfig, RecorderError>
   - pub fn save_config(config: &AppConfig) -> Result<(), RecorderError>
   - pub fn get_config_path() -> Result<PathBuf, RecorderError>
   - pub fn get_default_recordings_path() -> Result<PathBuf, RecorderError>

3. Behavior:
   - Save to %APPDATA%\RecordFlow\config.json
   - Create directory if doesn't exist
   - Handle missing config (return defaults)
   - Handle corrupted JSON (error message)

4. Default values:
   - Save location: Documents\RecordFlow\Recordings
   - Window size: 600x700
   - Theme: "light"

DEPENDENCIES:
- std::path::PathBuf
- std::fs for file operations
- serde_json
- dirs crate (for APPDATA)

ACCEPTANCE CRITERIA:
- Config persists between restarts
- Handles missing/corrupted files gracefully
- Creates directories automatically
- Returns user-friendly errors
```

---

## 🎬 PHASE 2: Screen Capture

### ⏱️ Duration: 16 hours (Days 3-5)

### Vibe Coder Prompt 2.1: Display Detection
```
CONTEXT:
RecordFlow. Have infrastructure. Starting screen capture.

TASK:
Generate display enumeration to list available monitors.

FILE PATH: src-tauri/src/commands/devices.rs
ALSO UPDATE: src-tauri/src/recording/screen_capturer.rs (add structures)

REQUIREMENTS:
1. DisplayInfo struct:
   - index: u32
   - name: String (e.g., "Display 1 (Primary)")
   - width: u32
   - height: u32
   - x: i32, y: i32 (position on virtual desktop)
   - is_primary: bool
   - Serialize/Deserialize for JSON

2. WindowInfo struct (optional advanced):
   - window_id: u64
   - title: String
   - Serialize/Deserialize

3. Tauri command:
   - pub async fn get_displays() -> Result<Vec<DisplayInfo>, RecorderError>

4. Implementation:
   - Use windows-capture crate (already in Cargo.toml)
   - Detect all connected monitors
   - Return accurate resolution and position
   - Handle no displays found (error)

DEPENDENCIES:
- windows-capture = "1.5"
- windows crate for Win32 APIs

INTEGRATION:
- Called from React DisplaySelector component
- Returns data for dropdown menu
- Should serialize to JSON automatically

ACCEPTANCE CRITERIA:
- Lists all connected monitors accurately
- Returns correct resolution
- Can be called from Tauri command
- Serializes to JSON for frontend
```

### Vibe Coder Prompt 2.2: Screen Frame Capture
```
CONTEXT:
RecordFlow. Have display detection. Implementing frame capture.

TASK:
Generate screen frame capture from selected display.

FILE PATH: src-tauri/src/recording/screen_capturer.rs

REQUIREMENTS:
1. Frame struct:
   - data: Vec<u8> (BGRA pixel data)
   - width: u32
   - height: u32
   - timestamp: u64 (milliseconds)
   - frame_number: u64

2. ScreenCapturer struct:
   - Methods:
     - pub fn new(display_index: u32, width: u32, height: u32) -> Result<Self, RecorderError>
     - pub fn capture_frame(&mut self) -> Result<Frame, RecorderError>
     - pub fn stop(&mut self)

3. Behavior:
   - Capture from selected display at target resolution
   - Scale to 1280x720 (720p) or 1920x1080 (1080p)
   - Return BGRA format (4 bytes per pixel)
   - Maintain timestamp for sync
   - Handle resolution scaling properly

4. Error handling:
   - Display not found
   - Capture API initialization failed
   - Frame capture timeout

CONSTRAINTS:
- Windows only (use windows-capture)
- BGRA format for efficient MP4 encoding
- 30fps target (33ms per frame)

USAGE:
let mut capturer = ScreenCapturer::new(0, 1920, 1080)?;
loop {
    let frame = capturer.capture_frame()?;
    // Process frame...
}

ACCEPTANCE CRITERIA:
- Captures at correct resolution
- BGRA format valid
- Timestamps increasing
- No memory leaks
- Handles errors gracefully
```

### Vibe Coder Prompt 2.3: Video Encoder to MP4
```
CONTEXT:
RecordFlow. Have screen capture. Now encoding to MP4.

TASK:
Generate video encoder using H.264 and MP4 container.

FILE PATH: src-tauri/src/recording/video_encoder.rs

REQUIREMENTS:
1. VideoEncoder struct:
   - Methods:
     - pub fn new(output_path: &str, width: u32, height: u32) 
       -> Result<Self, RecorderError>
     - pub fn encode_frame(&mut self, frame_data: &[u8]) 
       -> Result<(), RecorderError>
     - pub fn finalize(&mut self) -> Result<(), RecorderError>

2. Configuration:
   - Codec: H.264
   - Bitrate: 5000 kbps
   - FPS: 30
   - Container: MP4
   - Pixel format: BGRA (input), YUV420 (encoder)

3. Behavior:
   - Initialize encoder on new()
   - Convert BGRA to YUV420 for encoding
   - Write encoded frames to MP4 file
   - Finalize creates valid MP4 file on close
   - Handle disk full errors
   - Handle permission denied errors

4. Error handling:
   - File path invalid
   - Output file can't be created
   - Encoder initialization failed
   - Frame encoding failed

CONSTRAINTS:
- Windows only
- H.264 for compatibility
- MP4 container format
- Real-time encoding (no buffering entire video)

OUTPUT:
- Valid MP4 file playable in VLC, Windows Media Player, etc.
- Correct resolution and framerate
- ~5000 kbps bitrate (adjustable)

ACCEPTANCE CRITERIA:
- Generates valid MP4 files
- Video plays in standard players
- Correct resolution/framerate
- File size matches bitrate
- Proper error messages
```

---

## 📹 PHASE 3: Camera Integration

### ⏱️ Duration: 16 hours (Days 6-8)

### Vibe Coder Prompt 3.1: Camera Detection
```
CONTEXT:
RecordFlow. Screen capture working. Adding camera support.

TASK:
Generate camera enumeration to list available webcams.

FILE PATH: src-tauri/src/commands/devices.rs (add to this file)
UPDATE: src-tauri/src/recording/camera_capturer.rs (add structures)

REQUIREMENTS:
1. CameraInfo struct:
   - index: u32
   - name: String (e.g., "Built-in Webcam")
   - width: u32, height: u32 (native resolution)
   - Serialize/Deserialize

2. Tauri command:
   - pub async fn get_cameras() -> Result<Vec<CameraInfo>, RecorderError>

3. Implementation:
   - Use nokhwa crate (already in Cargo.toml)
   - Detect all connected cameras
   - Get native resolution
   - Return device names

4. Error handling:
   - No cameras found (return empty vec or error)
   - Camera enumeration failed

DEPENDENCIES:
- nokhwa = "0.50"

INTEGRATION:
- Called from React CameraSettings component
- Returns for camera dropdown

ACCEPTANCE CRITERIA:
- Lists all connected cameras
- Returns accurate names and resolutions
- Serializes to JSON
```

### Vibe Coder Prompt 3.2: Camera Frame Capture
```
CONTEXT:
RecordFlow. Have camera detection. Capturing camera frames.

TASK:
Generate camera frame capture from selected webcam.

FILE PATH: src-tauri/src/recording/camera_capturer.rs

REQUIREMENTS:
1. CameraCapturer struct:
   - pub fn new(camera_index: u32) -> Result<Self, RecorderError>
   - pub fn capture_frame(&mut self) -> Result<Frame, RecorderError>
   - pub fn stop(&mut self)

2. Behavior:
   - Open camera on new()
   - Capture frames at native camera resolution
   - Return BGRA format
   - Handle camera disconnect mid-capture
   - Generate timestamps

3. Frame struct (reuse from screen_capturer):
   - data: Vec<u8> (BGRA)
   - width: u32
   - height: u32
   - timestamp: u64
   - frame_number: u64

4. Error handling:
   - Camera not found
   - Camera in use by another app
   - Permission denied
   - Camera disconnect

DEPENDENCIES:
- nokhwa with "input-native" feature
- Frame struct from screen_capturer

USAGE:
let mut camera = CameraCapturer::new(0)?;
let frame = camera.capture_frame()?;

ACCEPTANCE CRITERIA:
- Captures from selected camera
- Returns valid BGRA frames
- Handles disconnection gracefully
- Timestamps correct
```

### Vibe Coder Prompt 3.3: Frame Compositor
```
CONTEXT:
RecordFlow. Have screen + camera capture. Compositing overlay.

TASK:
Generate frame compositor to overlay camera on screen.

FILE PATH: src-tauri/src/recording/compositor.rs

REQUIREMENTS:
1. FrameCompositor struct:
   - pub fn composite(
       screen_frame: &Frame,
       camera_frame: &Frame,
       position: CameraPosition,
       size: CameraSize
     ) -> Result<Vec<u8>, RecorderError>

2. CameraPosition enum values:
   - TopLeft
   - TopRight
   - BottomLeft
   - BottomRight

3. CameraSize percentages:
   - Small: 15% of screen width
   - Medium: 25% of screen width
   - Large: 35% of screen width

4. Behavior:
   - Scale camera frame to target size
   - Position at specified corner
   - Composite onto screen frame
   - Handle different aspect ratios
   - Return BGRA pixel data ready for encoding

5. Algorithm:
   - Calculate camera size in pixels based on screen width
   - Resize camera frame to fit size
   - Calculate position offset based on corner
   - Blend camera over screen (simple overlay, no transparency)
   - Return composited BGRA data

CONSTRAINTS:
- Maintain video quality
- Efficient pixel manipulation
- Handle various camera aspect ratios

USAGE:
let composited = FrameCompositor::composite(
    &screen_frame,
    &camera_frame,
    CameraPosition::BottomRight,
    CameraSize::Medium
)?;
// composited is Vec<u8> BGRA ready for encoding

ACCEPTANCE CRITERIA:
- Camera appears in correct position
- Size scaling works correctly
- No visual artifacts
- Performance acceptable
```

---

## 🔊 PHASE 4: Audio Capture

### ⏱️ Duration: 16 hours (Days 9-11)

### Vibe Coder Prompt 4.1: Microphone & System Audio Detection
```
CONTEXT:
RecordFlow. Video capture working. Adding audio.

TASK:
Generate audio device detection for microphones and system audio.

FILE PATH: src-tauri/src/commands/devices.rs (add to this file)

REQUIREMENTS:
1. AudioDeviceInfo struct:
   - index: u32
   - name: String
   - channels: u16
   - sample_rate: u32
   - is_input: bool
   - Serialize/Deserialize

2. Tauri commands:
   - pub async fn get_audio_inputs() -> Result<Vec<AudioDeviceInfo>, RecorderError>
   - pub async fn get_system_audio_devices() -> Result<Vec<AudioDeviceInfo>, RecorderError>

3. Implementation:
   - Use CPAL crate (already in Cargo.toml)
   - Get all input devices (microphones)
   - Get system audio device (speakers/loopback)
   - Return device names and info

4. Error handling:
   - No devices found
   - Audio API not available

DEPENDENCIES:
- cpal = "0.13"
- cpal::traits::{DeviceTrait, HostTrait}

INTEGRATION:
- Called from React AudioSettings component
- Returns for device dropdowns

ACCEPTANCE CRITERIA:
- Lists microphones
- Lists system audio
- Handles no devices gracefully
- Returns accurate device info
```

### Vibe Coder Prompt 4.2: Microphone Audio Capture
```
CONTEXT:
RecordFlow. Have audio device detection. Capturing microphone audio.

TASK:
Generate microphone audio capture.

FILE PATH: src-tauri/src/recording/audio_capturer.rs

REQUIREMENTS:
1. AudioFrame struct:
   - data: Vec<f32> (audio samples -1.0 to 1.0)
   - sample_rate: u32 (48000 Hz)
   - channels: u16 (1 or 2)
   - timestamp: u64

2. MicrophoneCapture struct:
   - pub fn new(device_index: u32) -> Result<Self, RecorderError>
   - pub fn start_capture(&mut self) -> Result<(), RecorderError>
   - pub fn get_audio_frame(&mut self) -> Result<AudioFrame, RecorderError>
   - pub fn stop(&mut self)

3. Behavior:
   - Open selected microphone device
   - Capture audio at 48kHz, 16-bit or 32-bit
   - Return as f32 samples (-1.0 to 1.0 range)
   - Generate timestamps
   - Handle mono or stereo

4. Frame size:
   - Each frame ~10-20ms of audio
   - At 48kHz, 16-bit, stereo = ~1920 samples per 10ms

DEPENDENCIES:
- cpal with default features
- AudioFrame struct defined in this module

USAGE:
let mut mic = MicrophoneCapture::new(0)?;
mic.start_capture()?;
let frame = mic.get_audio_frame()?;

ACCEPTANCE CRITERIA:
- Captures audio from selected device
- Proper sample rate and channels
- Handles errors gracefully
- Timestamps correct
```

### Vibe Coder Prompt 4.3: Audio Mixer
```
CONTEXT:
RecordFlow. Have microphone + (will have) system audio. Creating mixer.

TASK:
Generate audio mixer to combine mic and system audio with volume control.

FILE PATH: src-tauri/src/recording/audio_capturer.rs (add to this file)

REQUIREMENTS:
1. AudioMixer struct:
   - pub fn new() -> Self
   - pub fn set_mic_volume(&mut self, volume: f32) // 0.0-1.0
   - pub fn set_system_audio_volume(&mut self, volume: f32) // 0.0-1.0
   - pub fn mix(
       &self,
       mic_frame: &AudioFrame,
       system_frame: &AudioFrame
     ) -> Result<AudioFrame, RecorderError>

2. Mixing algorithm:
   - Apply volume to each source
   - Sum samples: output = (mic_sample * mic_vol) + (sys_sample * sys_vol)
   - Clamp to [-1.0, 1.0] to prevent clipping
   - Return single AudioFrame with mixed audio

3. Behavior:
   - Both sources must be at same sample rate (48kHz)
   - Output will be stereo (2 channels)
   - Handle mismatched frame sizes
   - Interpolate if needed

4. Volume control:
   - 0.0 = silent
   - 1.0 = full volume
   - Linear scaling

USAGE:
let mut mixer = AudioMixer::new();
mixer.set_mic_volume(0.8);
mixer.set_system_audio_volume(0.6);
let mixed = mixer.mix(&mic_frame, &system_frame)?;

ACCEPTANCE CRITERIA:
- Both audio sources in output
- Volume controls work
- No clipping/distortion
- Timestamps preserved
```

---

## 🎨 PHASE 5: Frontend UI

### ⏱️ Duration: 20 hours (Days 12-15)

### Vibe Coder Prompt 5.1: Display Selector Component
```
CONTEXT:
RecordFlow React frontend. Building UI components.

TASK:
Generate DisplaySelector React component for display selection.

FILE PATH: src/components/DisplaySelector.tsx

REQUIREMENTS:
1. Component displays:
   - Label: "Display/Window Selection"
   - Dropdown: "Select Display" with list of monitors
   - Format: "Display 1 (Primary) - 1920x1080"
   - Toggle: ☐ Record Screen
   - Checkbox works independently

2. Features:
   - Load displays on component mount using get_displays() Tauri command
   - Show loading state while fetching
   - Handle error (no displays found)
   - Display resolution info for each monitor
   - Emit selection to parent via onDisplayChange prop

3. Props:
   - onDisplayChange: (displayIndex: u32) => void
   - selectedDisplay: u32
   - screenEnabled: boolean
   - onScreenToggle: (enabled: boolean) => void

4. State:
   - displays: DisplayInfo[]
   - loading: boolean
   - error: string | null
   - selected: u32

5. Styling:
   - Professional Windows-like appearance
   - Clear labels and spacing
   - Proper dropdown styling

DEPENDENCIES:
- React hooks (useState, useEffect)
- Tauri invoke
- DisplayInfo interface from types

TYPES (src/types/index.ts):
interface DisplayInfo {
  index: u32;
  name: string;
  width: u32;
  height: u32;
  x: i32;
  y: i32;
  is_primary: boolean;
}

ACCEPTANCE CRITERIA:
- Loads displays on mount
- User can select display
- Toggle works
- Errors displayed
- No console errors
```

### Vibe Coder Prompt 5.2: Camera Settings Component
```
CONTEXT:
RecordFlow React. Have DisplaySelector. Building CameraSettings.

TASK:
Generate CameraSettings component for camera controls.

FILE PATH: src/components/CameraSettings.tsx

REQUIREMENTS:
1. Display sections:
   - Dropdown: "Select Camera" → lists available cameras
   - Dropdown: "Camera Position" → TopLeft/TopRight/BottomLeft/BottomRight
   - Dropdown: "Camera Size" → Small/Medium/Large
   - Toggle: ☐ Record Camera
   - Visual preview of position choice

2. Features:
   - Load cameras on mount (get_cameras command)
   - Show camera resolution
   - Position selector with visual indicator
   - Size selector
   - Disabled when toggle is off
   - Format: "Built-in Webcam (1280x720)"

3. Props:
   - onCameraChange: (index: u32) => void
   - onPositionChange: (position: string) => void
   - onSizeChange: (size: string) => void
   - cameraEnabled: boolean
   - onToggle: (enabled: boolean) => void
   - selectedCamera: u32
   - selectedPosition: string
   - selectedSize: string

4. Visual indicator:
   - Show small rectangle in target corner
   - Animated or colored
   - Shows scaled size

TYPES (add to src/types/index.ts):
interface CameraInfo {
  index: u32;
  name: string;
  width: u32;
  height: u32;
}

ACCEPTANCE CRITERIA:
- Camera list loads
- User can select all options
- Visual preview works
- Toggle disables controls
```

### Vibe Coder Prompt 5.3: Audio Settings Component
```
CONTEXT:
RecordFlow React. Have display/camera selectors. Building AudioSettings.

TASK:
Generate AudioSettings component with volume sliders.

FILE PATH: src/components/AudioSettings.tsx
ALSO CREATE: src/components/VolumeSlider.tsx (reusable slider)

REQUIREMENTS:
1. Microphone section:
   - Dropdown: "Select Microphone" (get_audio_inputs command)
   - VolumeSlider: 0-100%
   - Display volume percentage
   - Toggle: ☐ Record Microphone

2. System Audio section:
   - Dropdown: "Select System Audio" (get_system_audio_devices command)
   - VolumeSlider: 0-100%
   - Display volume percentage
   - Toggle: ☐ Record System Audio

3. VolumeSlider component:
   - Range input 0-100
   - Show percentage text
   - Smooth updates
   - Disabled state styling

4. Props (AudioSettings):
   - onMicChange: (index: u32) => void
   - onMicVolume: (volume: f32) => void // 0.0-1.0
   - onSystemAudioChange: (index: u32) => void
   - onSystemAudioVolume: (volume: f32) => void
   - micEnabled/systemAudioEnabled: boolean
   - onMicToggle/onSystemAudioToggle: (enabled: boolean) => void

5. Props (VolumeSlider):
   - value: number (0-100)
   - onChange: (value: number) => void
   - label?: string
   - disabled?: boolean

TYPES (add to src/types/index.ts):
interface AudioDeviceInfo {
  index: u32;
  name: string;
  channels: u16;
  sample_rate: u32;
  is_input: boolean;
}

ACCEPTANCE CRITERIA:
- Device dropdowns work
- Sliders responsive
- Volume percentage displayed
- Toggles enable/disable controls
- Both sections independent
```

### Vibe Coder Prompt 5.4: Recording Controls Component
```
CONTEXT:
RecordFlow React. Have all input selectors. Building recording controls.

TASK:
Generate RecordingControls component with Start/Stop/Pause buttons.

FILE PATH: src/components/RecordingControls.tsx

REQUIREMENTS:
1. Display elements:
   - Pulsing red dot (when recording)
   - Status text: "Recording..." or "Ready"
   - Large green START button
   - Blue PAUSE button (appears during recording)
   - Red STOP button (appears during recording)
   - Blue RESUME button (appears when paused)

2. Button states:
   - Ready: START enabled, others disabled
   - Recording: PAUSE/STOP enabled, START disabled
   - Paused: RESUME/STOP enabled, PAUSE disabled

3. Props:
   - isRecording: boolean
   - isPaused: boolean
   - onStart: () => Promise<void>
   - onStop: () => Promise<void>
   - onPause: () => Promise<void>
   - onResume: () => Promise<void>
   - loading: boolean
   - error: string | null

4. Features:
   - Disable buttons during transitions (loading state)
   - Show error messages
   - Pulsing animation on red dot when recording
   - Large, easy-to-click buttons

5. Styling:
   - START: Green (#0078d4)
   - PAUSE: Blue
   - STOP: Red (#ff0000)
   - RESUME: Green
   - Buttons large (100px+ height)
   - Pulsing red dot animation

ANIMATIONS:
- Red dot pulses opacity: 0.3 → 1.0 → 0.3 (500ms cycle)
- Button hover effects

ACCEPTANCE CRITERIA:
- Correct button states
- Pulsing animation visible
- Transitions smooth
- Error messages display
```

### Vibe Coder Prompt 5.5: Recording Timer Component
```
CONTEXT:
RecordFlow React. Have recording controls. Building timer display.

TASK:
Generate RecordingTimer component showing elapsed time.

FILE PATH: src/components/RecordingTimer.tsx

REQUIREMENTS:
1. Display format: HH:MM:SS
   - "00:00:00" when not recording
   - Updates every second when recording
   - Large, bold font
   - Easy to read

2. Features:
   - Update timer every 1 second
   - Format with zero-padding (e.g., "00:05:23")
   - Color changes based on state:
     - Gray when not recording
     - White when recording
     - Yellow warning if > 5 minutes

3. Props:
   - elapsedSeconds: number
   - isRecording: boolean

4. Helper function:
   - formatTime(seconds: number): string
     - Return HH:MM:SS format

5. Styling:
   - Font size: 40-48px
   - Bold weight: 600+
   - Family: monospace (for even spacing)
   - Proper contrast

USAGE:
<RecordingTimer elapsedSeconds={65} isRecording={true} />
// Display: "00:01:05"

ACCEPTANCE CRITERIA:
- Time format correct
- Updates smooth (no jumps)
- Colors appropriate
- Readable at a glance
```

### Vibe Coder Prompt 5.6: Video Settings Display
```
CONTEXT:
RecordFlow React. Have timer. Building video settings display.

TASK:
Generate VideoSettings component for resolution selection.

FILE PATH: src/components/VideoSettings.tsx

REQUIREMENTS:
1. Display elements:
   - Buttons: [720p] [1080p] (toggle buttons)
   - Text: "FPS: 30" (informational)
   - Text: "Bitrate: 5000 kbps" (informational)
   - Text: "Format: MP4 - H.264" (informational)
   - Resolution preview: "1280x720" or "1920x1080"

2. Features:
   - User selects 720p or 1080p
   - Other settings read-only
   - Show pixel dimensions for selected resolution
   - Active button highlighted

3. Props:
   - selectedResolution: "720p" | "1080p"
   - onResolutionChange: (resolution: string) => void

4. Resolution mapping:
   - 720p: 1280x720
   - 1080p: 1920x1080

5. Styling:
   - Toggle buttons with highlight on selected
   - Informational text smaller/grayed
   - Clean, organized layout

ACCEPTANCE CRITERIA:
- Resolution selection works
- Buttons toggle correctly
- Preview text accurate
```

---

## 🔧 PHASE 6: Recording Manager & Integration

### ⏱️ Duration: 12 hours (Days 16-18)

### Vibe Coder Prompt 6.1: Recording Manager Orchestrator
```
CONTEXT:
RecordFlow. All components built. Creating RecordingManager orchestrator.

TASK:
Generate RecordingManager to coordinate all capture and encoding.

FILE PATH: src-tauri/src/recording/manager.rs

REQUIREMENTS:
1. RecordingManager struct:
   - Manages ScreenCapturer, CameraCapturer, AudioCapturers, VideoEncoder
   - Uses Arc<AppState> for settings
   - Coordinates async capture and encoding

2. Methods:
   - pub async fn new(state: Arc<AppState>) -> Result<Self, RecorderError>
   - pub async fn start_recording(&self, output_path: String) 
     -> Result<String, RecorderError>
   - pub async fn stop_recording(&self) 
     -> Result<String, RecorderError>
   - pub async fn pause_recording(&self) 
     -> Result<String, RecorderError>
   - pub async fn resume_recording(&self) 
     -> Result<String, RecorderError>

3. Internal loop (run_recording_loop):
   - Capture screen frame (30fps target)
   - Capture camera frame if enabled
   - Composite frames if both enabled
   - Capture audio (if enabled)
   - Mix audio (if both enabled)
   - Encode frame + audio to MP4
   - Handle pause state (skip frames but don't close file)
   - Continue until stop signal

4. Timing:
   - 30fps = 33.33ms per frame
   - Capture and encode must complete within frame time
   - Audio aligned with video timestamps

5. Error handling:
   - Device disconnect mid-recording
   - Disk full (partial file cleanup)
   - Encoding failures (log + try recovery)
   - File permissions
   - Resume state corruption

CONSTRAINTS:
- Async/await with tokio
- All operations under Arc<Mutex<>> for thread safety
- Real-time performance (no buffering full video)

USAGE:
let manager = RecordingManager::new(state.clone()).await?;
manager.start_recording("output.mp4".to_string()).await?;
// Recording in background
manager.pause_recording().await?;
manager.resume_recording().await?;
manager.stop_recording().await?;

ACCEPTANCE CRITERIA:
- Records end-to-end without crashes
- All inputs synchronized
- Pause/resume works correctly
- Handles errors gracefully
- Performance acceptable (no major frame drops)
```

### Vibe Coder Prompt 6.2: Tauri Recording Commands
```
CONTEXT:
RecordFlow. Have RecordingManager. Creating Tauri command interface.

TASK:
Generate Tauri commands for recording control and status.

FILE PATH: src-tauri/src/commands/recording.rs

REQUIREMENTS:
1. RecordingStatus struct:
   - is_recording: bool
   - is_paused: bool
   - output_file: Option<String>
   - elapsed_seconds: u64
   - Serialize/Deserialize

2. Tauri commands:
   - pub async fn start_recording(
       state: State<'_, Arc<RecordingManager>>
     ) -> Result<String, RecorderError>
   
   - pub async fn stop_recording(
       state: State<'_, Arc<RecordingManager>>
     ) -> Result<RecordingStatus, RecorderError>
   
   - pub async fn pause_recording(
       state: State<'_, Arc<RecordingManager>>
     ) -> Result<String, RecorderError>
   
   - pub async fn resume_recording(
       state: State<'_, Arc<RecordingManager>>
     ) -> Result<String, RecorderError>
   
   - pub async fn get_recording_status(
       state: State<'_, Arc<RecordingManager>>
     ) -> Result<RecordingStatus, RecorderError>

3. Each command:
   - Takes State parameter to access manager
   - Returns Result<T, RecorderError>
   - Has doc comments explaining behavior
   - Serializable for frontend JSON

4. Output file path:
   - Generated as: recording_YYYYMMDD_HHMMSS.mp4
   - Saved to: Documents/RecordFlow/Recordings/
   - Created in start_recording command

REGISTRATION:
In src-tauri/src/main.rs, add to .invoke_handler():
.invoke_handler(tauri::generate_handler![
    start_recording,
    stop_recording,
    pause_recording,
    resume_recording,
    get_recording_status,
])

ACCEPTANCE CRITERIA:
- Commands callable from React frontend
- Return types serialize to JSON
- Error messages user-friendly
- Status updates correct
```

### Vibe Coder Prompt 6.3: File Management After Recording
```
CONTEXT:
RecordFlow. Recording works. Generating post-recording file management.

TASK:
Generate file info retrieval and file management commands.

FILE PATH: src-tauri/src/commands/files.rs

REQUIREMENTS:
1. RecordingInfo struct:
   - file_path: String
   - file_name: String (just filename)
   - file_size: u64 (bytes)
   - duration: u64 (seconds)
   - created_at: String (timestamp ISO8601)
   - Serialize/Deserialize

2. Tauri commands:
   - pub async fn get_last_recording_info() 
     -> Result<RecordingInfo, RecorderError>
   
   - pub async fn open_recording_in_explorer(path: String)
     -> Result<(), RecorderError>
   
   - pub async fn delete_recording(path: String)
     -> Result<(), RecorderError>
   
   - pub async fn open_recordings_folder()
     -> Result<(), RecorderError>

3. Implementation:
   - Get file metadata (size, modified time)
   - Calculate duration from MP4 file
   - Format size as human-readable (MB, GB)
   - Format duration as MM:SS
   - Use shell commands to open folders/files

4. Helper functions:
   - format_file_size(bytes: u64) -> String // "48.7 MB"
   - format_duration(seconds: u64) -> String // "2m 15s"
   - get_default_save_location() -> PathBuf

5. Error handling:
   - File not found
   - Permission denied
   - Explorer/file manager not available

DEPENDENCIES:
- std::fs for metadata
- shell commands for "open in explorer"
- Tauri's shell-open feature (in Cargo.toml)

REGISTRATION:
Add to .invoke_handler() in main.rs

ACCEPTANCE CRITERIA:
- File info retrieved accurately
- Open in explorer works
- File deletion works with confirmation
- Size and duration formatted nicely
```

---

## 📝 Type Definitions

### File: src/types/index.ts

```typescript
// Display
export interface DisplayInfo {
  index: number;
  name: string;
  width: number;
  height: number;
  x: number;
  y: number;
  is_primary: boolean;
}

// Camera
export interface CameraInfo {
  index: number;
  name: string;
  width: number;
  height: number;
}

// Audio
export interface AudioDeviceInfo {
  index: number;
  name: string;
  channels: number;
  sample_rate: number;
  is_input: boolean;
}

// Recording
export interface RecordingStatus {
  is_recording: boolean;
  is_paused: boolean;
  output_file: string | null;
  elapsed_seconds: number;
}

export interface RecordingInfo {
  file_path: string;
  file_name: string;
  file_size: number;
  duration: number;
  created_at: string;
}

// Settings
export type Resolution = "720p" | "1080p";
export type CameraPosition = "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight";
export type CameraSize = "Small" | "Medium" | "Large";

export interface RecordingSettings {
  resolution: Resolution;
  fps: number;
  bitrate: number;
  selected_display: number;
  selected_window: string | null;
  selected_camera: string | null;
  camera_enabled: boolean;
  camera_position: CameraPosition;
  camera_size: CameraSize;
  microphone_device: string;
  mic_enabled: boolean;
  mic_volume: number;
  system_audio_device: string;
  system_audio_enabled: boolean;
  system_audio_volume: number;
}
```

---

## ⚠️ Error Handling Strategy

### Error Categories
1. **Device Errors** - display/camera/microphone not found
2. **Encoding Errors** - MP4 encoding failed
3. **File System Errors** - permission denied, disk full
4. **State Errors** - already recording, not recording
5. **Performance Errors** - frame drops, audio sync lost

### User-Friendly Messages
- ❌ "HRESULT 0x80004002" → ✅ "Camera not found. Check if connected."
- ❌ "Permission denied" → ✅ "Can't write to folder. Choose different location."
- ❌ "Encoder failed" → ✅ "Recording failed. Try again with lower quality."

---

## 🎯 Success Criteria

### Functional
- ✅ Records screen at 720p/1080p
- ✅ Records camera with overlay
- ✅ Records microphone + system audio
- ✅ All synced in single MP4
- ✅ Pause/resume works
- ✅ Files saved with timestamp
- ✅ Settings persist

### Non-Functional
- ✅ No major frame drops at 1080p
- ✅ Audio stays synced
- ✅ Memory < 500MB
- ✅ Responsive UI
- ✅ Graceful error handling

---

## 📚 Resources

- [windows-capture GitHub](https://github.com/NiiightmareXD/windows-capture)
- [Tauri v2 Documentation](https://v2.tauri.app/)
- [nokhwa Camera Library](https://github.com/l1npengtao/nokhwa)
- [CPAL Audio Library](https://github.com/RustAudio/cpal)

---

## 🚀 Ready to Build!

Start with Phase 1, move sequentially through phases. Use one Vibe Coder prompt at a time. Review, integrate, test before moving to next. Good luck! 💪
