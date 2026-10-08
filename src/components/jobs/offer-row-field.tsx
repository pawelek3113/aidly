import { ReactNode } from "react";
import { Label } from "./offer-row-label";

type FieldProps = {
  children?: ReactNode;
  labelText?: string;
};

export const Field = ({ children, labelText }: FieldProps) => {
  return (
    <div className="flex flex-col">
      {labelText && <Label text={labelText} />}
      {children}
    </div>
  );
};
