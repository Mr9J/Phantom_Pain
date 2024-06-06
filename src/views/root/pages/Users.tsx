import React from "react";

const Users = () => {
  return (
    <section className="overflow-hidden p-6">
      <div className="w-full h-screen grid grid-cols-5 grid-rows-4 gap-6 border-4">
        <div className=" bg-red col-start-1 col-end-2 row-start-1 row-end-3">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-5xl">頭像</h2>
            <h3 className="text-4xl">基本資料</h3>
          </div>
        </div>
        <div className="bg-blue-500 col-start-1 col-end-4 row-start-3 row-end-5">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-5xl">品牌資訊</h2>
          </div>
        </div>
        <div className="bg-green-500 col-start-2 col-end-6">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-5xl">頭像</h2>
            <h3 className="text-4xl">基本資料</h3>
          </div>
        </div>
        <div className="bg-orange-500 col-start-2 col-end-4">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-5xl">頭像</h2>
            <h3 className="text-4xl">基本資料</h3>
          </div>
        </div>
        <div className=" bg-slate-600 col-start-4 col-end-6 row-start-2 row-end-5">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-5xl">頭像</h2>
            <h3 className="text-4xl">基本資料</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Users;
