import React from "react";
// Import CSS modules
import { ThreeCircles } from "react-loader-spinner";
const LoadingComp = () => {
  return (
    <>
      <div className="w-[100%] h-[100%] mt-5 flex justify-center items-center flex-col text-white bg-transparent font-medium text-sm gap-5">
        <ThreeCircles
          visible={true}
          height="60"
          width="60"
          color="#fff"
          ariaLabel="three-circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
        <p>Mohon Tunggu Sebentar</p>
      </div>
    </>
  );
};

export default LoadingComp;
