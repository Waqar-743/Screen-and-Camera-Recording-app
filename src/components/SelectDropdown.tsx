import type { ChangeEvent } from "react";

type Option = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  value: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export function SelectDropdown({
  label,
  value,
  options,
  placeholder = "Select...",
  disabled,
  onChange,
}: Props) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.currentTarget.value);
  };

  return (
    <label className="rf-field">
      <div className="rf-label">{label}</div>
      <select className="rf-select" value={value} onChange={handleChange} disabled={disabled}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
