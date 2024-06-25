import styles from "@/styles";

type NewFeaturesProps = {
  imgSource: string;
  title: string;
  subtitle: string;
};

const NewFeatures = ({ imgSource, title, subtitle }: NewFeaturesProps) => {
  return (
    <div className="flex-1 flex flex-col sm:max-w-[250px] min-w-[210px]">
      <div
        className={`${styles.flexCenter} w-[70px] h-[70px] rounded-[24px] bg-[#323F5D]`}
      >
        {/* <img
          src={imgSource}
          alt="icon"
          className="w-1/2 h-1/2 object-contain"
        /> */}
        <p className="text-white">{imgSource}</p>
      </div>
      <h1 className="mt-[26px] font-bold text-[24px] leading-[30.24px] text-black dark:text-white">
        {title}
      </h1>
      <p className="flex-1 mt-[16px] font-normal text-[18px] text-black dark:text-[#B0B0B0] leading-[32.4px]">
        {subtitle}
      </p>
    </div>
  );
};

export default NewFeatures;
