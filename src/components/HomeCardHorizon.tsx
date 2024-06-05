// import React from 'react'

export default function HomeCardHorizon({ title,image,id,totalAmount,supporter }: { title: string ,image:string,id:number,totalAmount:number,supporter:number}) {
  return (
    <a
      className="col-span-4 flex md:col-span-2 rounded shadow border"
      href={`/project/${id}`}
    >
      <img
        width="1600"
        height="900"
        className="h-24 lg:h-36 rounded xs:rounded-none xs:rounded-s w-auto object-cover aspect-video"
        src={image}
      />
      <div className="flex flex-col flex-1 px-3 lg:p-4 justify-between">
        <h3 className="font-bold text-sm xs:text-base mb-2 line-clamp-2">
          {title}
        </h3>
        <div className="flex justify-between font-bold items-center">
          <h5 className="text-sm md:text-base xs:w-auto mb-1 text-pretty">
            NT$ {totalAmount.toLocaleString()}
          </h5>
          <h5 className="text-xs text-right bg-gray-500 rounded px-1 mb-1 leading-relaxed">
           <span className="text-xs">{supporter.toLocaleString()}人支持</span>
          </h5>
        </div>
      </div>
    </a>
  );
}
