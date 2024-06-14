function StartProject() {
  return (
    <>
      <div className="mx-auto mb-16 flex container flex-col mt-7">
        <img
          width="1600"
          height="900"
          className="object-cover rounded w-full aspect-[4/3] md:aspect-video"
          src="https://localhost:7150/resources/startpage.webp"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <div className="p-2 md:p-5 rounded bg-secondary shadow text-primary">
            <h2 className="text-2xl md:text-3xl font-semibold p-5 md:py-8 md:px-16 rounded text-center border-2 border-current">
              讓美好的事物發生
              <span className="text-lg mt-2 block">全台最大的群眾集資平台</span>
            </h2>
          </div>
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold my-16 inline-block after:h-1 after:block after:bg-secondary after:rounded after:mt-1">
          關於嘖嘖
        </h2>
        <div className="flex text-xl font-semibold">
          <section className="mb-16 w-full sm:w-1/2 md:w-1/4">
            <h3 className="mb-4">集資累積金額</h3>
            <h4 className="text-4xl text-center text-zec-green">100 億 +</h4>
          </section>
          <section className="mb-16 w-full sm:w-1/2 md:w-1/4">
            <h3 className="mb-4">總成功計畫數</h3>
            <h4 className="text-4xl text-center text-zec-green">5,600 +</h4>
          </section>
          <section className="mb-16 w-full sm:w-1/2 md:w-1/4">
            <h3 className="mb-4">會員數</h3>
            <h4 className="text-4xl text-center text-zec-green">290 萬 +</h4>
          </section>
          <section className="mb-16 w-full sm:w-1/2 md:w-1/4">
            <h3 className="mb-4">月均瀏覽</h3>
            <h4 className="text-4xl text-center text-zec-green">950 萬 +</h4>
          </section>
        </div>
      </div>
    </>
  );
}

export default StartProject;
