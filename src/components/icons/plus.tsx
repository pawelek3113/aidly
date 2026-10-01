import { SVGProps } from "react";

export const PlusIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="256"
      height="256"
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M128 8C141.807 8 153 19.1929 153 33V70C153 88.2254 167.775 103 186 103H223C236.807 103 248 114.193 248 128C248 141.807 236.807 153 223 153H186C167.775 153 153 167.775 153 186V223C153 236.807 141.807 248 128 248C114.193 248 103 236.807 103 223V186C103 167.775 88.2254 153 70 153H33C19.1929 153 8 141.807 8 128C8 114.193 19.1929 103 33 103H70C88.2254 103 103 88.2254 103 70V33C103 19.1929 114.193 8 128 8Z"
        fill="currentColor"
      />
    </svg>
  );
};
