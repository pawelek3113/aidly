import { SpinnerIcon } from "@phosphor-icons/react";

export const LoadingIcon = () => {
  return (
    <SpinnerIcon
      aria-hidden="true"
      weight="bold"
      className="size-5 animate-spin"
    />
  );
};
