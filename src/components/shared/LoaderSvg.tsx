import loader from "../../assets/_shared_img/loader.svg";

const LoaderSvg = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <img
        src={loader}
        alt="loader"
        width={24}
        height={24}
        className="animate-spin"
      />
    </div>
  );
};

export default LoaderSvg;
