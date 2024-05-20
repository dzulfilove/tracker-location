import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const Camera = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    // Simpan gambar di sini
    saveImage(imageSrc);
  };

  const saveImage = (imageSrc) => {
    // Buat blob dari base64 encoded image
    const blob = dataURItoBlob(imageSrc);

    // Buat objek URL dari blob
    const url = URL.createObjectURL(blob);

    // Buat elemen <a> untuk mengunduh gambar
    const a = document.createElement("a");
    a.href = url;
    a.download = "captured_image.jpg"; // Nama file yang ingin disimpan
    document.body.appendChild(a);
    a.click();

    // Hapus elemen <a> setelah pengunduhan selesai
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const dataURItoBlob = (dataURI) => {
    // Potong bagian base64
    const byteString = atob(dataURI.split(",")[1]);

    // Tentukan tipe MIME
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // Buat blob
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: mimeString });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          overflowX: "hidden",
          position: "relative",
          marginBottom: "1rem",
        }}
      >
        <div className=" font-DM flex flex-col  px-3 pt-4 justify-center items-center mx-auto w-full bg-white max-w-[480px] rounded-[32px]">
          <div className="flex  relative flex-col  pb-1.5 w-full aspect-[0.63] overflow-y-scroll h-[90%] border-[3px] rounded-xl border-blue-500 ">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className=" flex flex-col justify-start w-full pb-1 "
            />
            <div className="absolute flex  justify-center items-center w-full z-[9999] mt-[26rem] pb-1 ">
              <button
                className="w-[5rem] h-[5rem] rounded-full bg-blue-500 flex justify-center items-center"
                onClick={capture}
              >
                <div className="w-[3rem] h-[3rem] rounded-full border-[3px] border-white"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* {capturedImage && (
        <img
          src={capturedImage}
          alt="Captured"
          style={{ width: "100%", marginTop: "20px" }}
        />
      )} */}
    </div>
  );
};

export default Camera;
