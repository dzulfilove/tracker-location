import React from "react";
// Import CSS modules
import { ThreeCircles } from "react-loader-spinner";
const Loading = () => {
  return (
    <>
      <div className="w-[100%] h-[100%] mt-5 flex justify-center items-center flex-col text-blue-500 bg-transparent font-medium text-sm gap-5">
        <ThreeCircles
          visible={true}
          height="60"
          width="60"
          color="#387AED"
          ariaLabel="three-circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
        <p>Mohon Tunggu Sebentar</p>
      </div>
    </>
  );
};

export default Loading;
