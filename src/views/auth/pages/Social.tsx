import LoaderSvg from "@/components/shared/LoaderSvg";

const Social = () => {
  const isPostLoading = true;
  const post = null;

  return (
    <div className="flex flex-1">
      <div
        className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5
      md:px-8 lg:p-14 custom-scrollbar"
      >
        <div className="max-w-screen-sm flex flex-col items-center w-full gap-6 md:gap-9">
          <h2 className="text-[24px] font-bold leading-[140%] tracking-tighte md:text-[30px] text-left w-full">
            Social Feed
          </h2>
          {isPostLoading && !post ? <LoaderSvg /> : <ul></ul>}
        </div>
      </div>
    </div>
  );
};

export default Social;
