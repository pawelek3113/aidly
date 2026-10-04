import { cn } from "@/lib/utils";
import { ReactNode, Ref } from "react";

type DetailTileProps = {
  id?: string;
  className?: string;
  label?: string;
  icon?: ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onBlur?: () => void;
  ref?: Ref<HTMLButtonElement>;
};

export const DetailTile = ({
  icon,
  className,
  label,
  checked,
  onCheckedChange,
  id,
  onBlur,
  ref,
}: DetailTileProps) => {
  return (
    <button
      id={id}
      ref={ref}
      onBlur={onBlur}
      className={cn(
        "border-chocolate-border flex size-40! cursor-pointer flex-col justify-between gap-2 rounded-4xl border-4 px-3 py-2 text-start",
        checked && "bg-primary",
        className
      )}
      aria-checked={checked}
      role="checkbox"
      onClick={(e) => {
        e.preventDefault();
        onCheckedChange?.(!checked);
      }}
    >
      {icon && <div className="size-16">{icon}</div>}
      {label && <p>{label}</p>}
    </button>
  );
};
