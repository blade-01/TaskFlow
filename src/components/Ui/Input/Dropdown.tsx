import { Dropdown } from "primereact/dropdown";
import { cn } from "../../../utils";
import {
  FieldValues,
  Path,
  UseFormRegister,
  RegisterOptions
} from "react-hook-form";

interface InputTextProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  register?: UseFormRegister<TFormValues>;
  label?: string;
  placeholder?: string;
  labelClass?: string;
  error?: string;
  requiredMark?: boolean;
  outerClass?: string;
  prependIcon?: React.ReactNode;
  appendIcon?: React.ReactNode;
  options?: object[];
  value?: object | string | null;
  optionLabel?: string;
  optionValue?: string;
  filter?: boolean;
  showClear?: boolean;
  onChange?: (e: { value: string }) => void;
  validation?: RegisterOptions<TFormValues, Path<TFormValues>>;
}

export default function UiInputDropdown<TFormValues extends FieldValues>({
  name,
  label,
  placeholder,
  labelClass,
  error,
  requiredMark = false,
  register,
  outerClass,
  prependIcon,
  appendIcon,
  options = [],
  value,
  onChange,
  optionLabel,
  optionValue,
  filter,
  showClear,
  validation,
  ...rest
}: InputTextProps<TFormValues>) {
  return (
    <div className={cn("input-group", { error }, outerClass)}>
      {label && (
        <label htmlFor={name} className={cn(labelClass)}>
          {label}
          {requiredMark && <span className="required-mark"> *</span>}
        </label>
      )}
      <div className="relative">
        {prependIcon && (
          <button className="absolute left-0 top-0 h-full w-10 flex items-center justify-center">
            {prependIcon}
          </button>
        )}
        <Dropdown
          id={name}
          type="text"
          className={cn("input-style !flex", {
            "pl-10": prependIcon,
            "pr-10": appendIcon
          })}
          pt={{
            item: { className: "p-2 capitalize" },
            clearIcon: { className: "-mt-2 mr-2" }
          }}
          placeholder={placeholder}
          {...(register
            ? register(
                name,
                validation ??
                  (requiredMark
                    ? { required: `${label} is required` }
                    : undefined)
              )
            : {})}
          {...rest}
          options={options}
          optionLabel={optionLabel}
          optionValue={optionValue}
          value={value}
          onChange={onChange}
          filter={filter}
          showClear={showClear}
        />
        {appendIcon && (
          <button className="absolute right-0 top-0 h-full w-10 flex items-center justify-center">
            {appendIcon}
          </button>
        )}
      </div>
      {error && <small className="error-message">{error}</small>}
    </div>
  );
}
