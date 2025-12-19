type Props = {
  value: number; // 0-100
  onChange: (value: number) => void;
  label?: string;
  disabled?: boolean;
};

export function VolumeSlider({ value, onChange, label, disabled }: Props) {
  return (
    <div className="rf-volume">
      {label ? <div className="rf-label">{label}</div> : null}
      <div className="rf-volume-row">
        <input
          className="rf-range"
          type="range"
          min={0}
          max={100}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.currentTarget.value))}
        />
        <div className="rf-volume-value">{value}%</div>
      </div>
    </div>
  );
}
