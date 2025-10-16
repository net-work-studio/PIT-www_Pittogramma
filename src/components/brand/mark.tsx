import type * as React from "react";

const Mark = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    height={17}
    viewBox="0 0 15 17"
    width={15}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Pittogramma Mark</title>
    <path
      className="fill-black dark:fill-white"
      d="M8.938 1.895H5.1V7.56h3.84zM14.692 17h-1.915V1.895h-1.924V17H8.938V9.439H5.1q-1.977 0-3.389-1.39-1.402-1.4-1.402-3.32 0-1.95 1.411-3.339Q3.14 0 5.1 0h9.593z"
    />
  </svg>
);
export default Mark;
