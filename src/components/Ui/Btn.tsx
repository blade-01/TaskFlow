import { useMemo } from "react";
import { cn } from "../../utils";
import { PiSpinnerLight } from "react-icons/pi";

interface Props {
  label?: string;
  prependIcon?: React.ReactNode;
  appendIcon?: React.ReactNode;
  prependSize?: string;
  appendSize?: string;
  outerClass?: string;
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function Btn({
  label,
  prependIcon,
  appendIcon,
  outerClass,
  size,
  isLoading,
  disabled,
  children,
  onClick,
  type
}: Props) {
  const sizes = useMemo(() => {
    switch (size) {
      case "xs":
        return "btn btn-xs";
      case "sm":
        return "btn btn-sm";
      case "md":
        return "btn btn-md";
      case "lg":
        return "btn btn-lg";
      default:
        return "btn";
    }
  }, [size]);

  return (
    <div>
      <button
        className={cn(
          "flex items-center justify-center gap-2",
          {
            "!bg-opacity-70 !cursor-not-allowed !pointer-events-none":
              isLoading || disabled
          },
          sizes,
          outerClass
        )}
        disabled={isLoading || disabled}
        onClick={onClick}
        type={type}
      >
        {!isLoading ? (
          <div className="flex items-center gap-2">
            {prependIcon && prependIcon}
            {label && <span>{label}</span>}
            {children}
            {appendIcon && appendIcon}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="animate-spin">
              <PiSpinnerLight size={20} />
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
