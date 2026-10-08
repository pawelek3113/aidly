import { ReactNode } from "react";

type LabelProps = {
  children?: ReactNode;
  text?: string;
};
export const Label = ({ children, text }: LabelProps) => {
  return (
    <h2 className="text-muted-foreground text-sm font-extrabold tracking-tighter uppercase">
      {text ? text : children}
    </h2>
  );
};
