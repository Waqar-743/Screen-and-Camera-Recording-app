import type { Resolution } from "../types";

type Props = {
  selectedResolution: Resolution;
  onResolutionChange: (resolution: Resolution) => void;
};

const dims: Record<Resolution, string> = {
  "720p": "1280x720",
  "1080p": "1920x1080",
};

export function VideoSettings({ selectedResolution, onResolutionChange }: Props) {
  return (
    <section className="rf-card">
      <div className="rf-card-title">Video</div>

      <div className="rf-row">
        <button
          className={selectedResolution === "720p" ? "rf-chip rf-chip-on" : "rf-chip"}
          onClick={() => onResolutionChange("720p")}
          type="button"
        >
          720p
        </button>
        <button
          className={selectedResolution === "1080p" ? "rf-chip rf-chip-on" : "rf-chip"}
          onClick={() => onResolutionChange("1080p")}
          type="button"
        >
          1080p
        </button>
      </div>

      <div className="rf-kv">
        <div className="rf-k">Resolution</div>
        <div className="rf-v">{dims[selectedResolution]}</div>
      </div>
      <div className="rf-kv">
        <div className="rf-k">FPS</div>
        <div className="rf-v">30</div>
      </div>
      <div className="rf-kv">
        <div className="rf-k">Bitrate</div>
        <div className="rf-v">5000 kbps</div>
      </div>
      <div className="rf-kv">
        <div className="rf-k">Format</div>
        <div className="rf-v">MP4 - H.264</div>
      </div>
    </section>
  );
}
