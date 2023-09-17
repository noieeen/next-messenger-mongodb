"use client";

import { BounceLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="h-full w-full bg-white opacity-50 fixed left-0 top-0 flex justify-center items-center">
      <BounceLoader size={40} color="#0ea5e9" />
    </div>
  );
};

export default Loading;
