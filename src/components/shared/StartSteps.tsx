import styles from "@/styles";

const StartSteps = ({ number, text }: { number: string; text: string }) => {
  return (
    <div className={`${styles.flexCenter} flex-row`}>
      <div
        className={`${styles.flexCenter} w-[70px] h-[70px] rounded-[24px] bg-[#323F5D] my-2`}
      >
        <p className="font-bold text-[20px] text-white">{number}</p>
      </div>
      <p className="flex-1 ml-[30px] font-normal text-[18px] dark:text-[#B0B0B0] text-black leading-[32.4px]">
        {text}
      </p>
    </div>
  );
};

export default StartSteps;
