import loader from "../../assets/_shared_img/loader.svg";

const LoaderSvg = () => {
  return (
    <div className="flex-center w-full">
      <img src={loader} alt="loader" className="w-6 h-6" />
    </div>
  );
};

export default LoaderSvg;
