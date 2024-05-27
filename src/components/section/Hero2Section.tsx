import hero2bg from "@/assets/hero2_img/herobg.jpg";

const Hero2Section = () => {
  return (
    <section className="flex h-screen">
      <div className="flex flex-1 justify-center items-center flex-col py-10"></div>
      <img
        src={hero2bg}
        alt="hero2bg"
        className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
      />
    </section>
  );
};

export default Hero2Section;
