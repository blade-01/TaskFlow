import { InputText } from "primereact/inputtext";
import { cn } from "../../../utils";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface InputTextProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  register: UseFormRegister<TFormValues>;
  label?: string;
  placeholder?: string;
  labelClass?: string;
  error?: string;
  requiredMark?: boolean;
  outerClass?: string;
  prependIcon?: React.ReactNode;
  appendIcon?: React.ReactNode;
}

export default function UiInputText<TFormValues extends FieldValues>({
  name,
  label,
  placeholder,
  labelClass,
  error,
  requiredMark = false,
  register,
  outerClass,
  prependIcon,
  appendIcon
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
        <button
          type="button"
          className="absolute left-0 top-0 h-full w-10 flex items-center justify-center"
        >
          {prependIcon && prependIcon}
        </button>
        <InputText
          id={name}
          type="text"
          className={cn("input-style", {
            "pl-10": prependIcon,
            "pr-10": appendIcon
          })}
          placeholder={placeholder}
          {...register(name, {
            required: `${label} is required`
          })}
        />
        <button
          type="button"
          className="absolute right-0 top-0 h-full w-10 flex items-center justify-center"
        >
          {appendIcon && appendIcon}
        </button>
      </div>
      {error && <small className="error-message">{error}</small>}
    </div>
  );
}
