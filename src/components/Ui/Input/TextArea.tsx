import { InputTextarea } from "primereact/inputtextarea";
import { cn } from "../../../utils";
import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions
} from "react-hook-form";

interface InputTextProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  control: Control<TFormValues>;
  label?: string;
  placeholder?: string;
  labelClass?: string;
  error?: string;
  requiredMark?: boolean;
  outerClass?: string;
  prependIcon?: React.ReactNode;
  appendIcon?: React.ReactNode;
  rules?: RegisterOptions<TFormValues, Path<TFormValues>>;
  rows?: number;
  cols?: number;
}

export default function UiInputText<TFormValues extends FieldValues>({
  name,
  label,
  placeholder,
  labelClass,
  error,
  requiredMark = false,
  control,
  outerClass,
  prependIcon,
  appendIcon,
  rules,
  rows,
  cols
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
        <Controller
          name={name}
          control={control}
          rules={{
            ...(requiredMark ? { required: `${label} is required` } : {}),
            ...rules
          }}
          render={({ field }) => (
            <InputTextarea
              {...field}
              id={name}
              className={cn("input-style", {
                "pl-10": prependIcon,
                "pr-10": appendIcon
              })}
              placeholder={placeholder}
              rows={rows}
              cols={cols}
            />
          )}
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
