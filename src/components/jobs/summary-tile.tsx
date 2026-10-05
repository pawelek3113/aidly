import { cn } from "@/lib/utils";
import { BrandHeading } from "../brand/brand-heading";

type SummaryTileProps = {
  value: number;
  text: string;
};
export const SummaryTile = ({ value, text }: SummaryTileProps) => {
  return (
    <div
      className={cn(
        "border-chocolate-border flex size-40 flex-col justify-between gap-4 rounded-4xl border-4 px-4 py-3 pt-6 sm:size-42 md:size-44 lg:size-52",
        "to-primary via-brand-secondary bg-linear-to-r from-transparent bg-size-[10000%_100%] bg-left transition-all duration-500 ease-in-out hover:scale-105 hover:bg-right"
      )}
    >
      <BrandHeading
        text={value.toString()}
        size="gigantic"
        className="text-brand-secondary"
      />
      <p className="font-bold">{text}</p>
    </div>
  );
};
