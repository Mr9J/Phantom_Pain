function ProjectToolBar() {
  return (
    <>
      <div className="bg-gray-200 flex justify-center dark:bg-slate-500">
        <div className="px-4 overflow-auto whitespace-nowrap flex flex-nowrap items-center space-x-8 my-1 tracking-widest lg:w-7/12">
          <a
            className="inline-block py-2 hover:border-zec-blue lg:border-b-2 border-transparent border-zec-blue font-bold"
            href="/projects/prolight"
          >
            專案內容
          </a>
          <a
            className="inline-block py-2 hover:border-zec-blue lg:border-b-2  border-transparent"
            href="/projects/prolight/faqs"
          >
            常見問答
            <span className="text-xs font-bold ml-1 text-neutral-400">10</span>
          </a>
          <a
            className="inline-block py-2 hover:border-zec-blue lg:border-b-2  border-transparent"
            href="/projects/prolight/comments"
          >
            留言
            <span className="text-xs font-bold ml-1 text-neutral-400">0</span>
          </a>
        </div>
        <div className="px-4 py-3 text-center w-full flex  lg:static bottom-0 z-50 lg:w-3/12 fixed">
          {/* 收藏小紅心 */}
          <a
            className="p-2 inline-block flex-initial mr-2 transition-transform hover:scale-105 focus:scale-105 active:scale-90 text-zec-blue border-2 border-current rounded tooltip tooltip-l"
            data-method="post"
            data-click-event="follow_project"
            aria-label="追蹤後會收到公開的專案更新和計畫結束提醒。"
            href="/projects/prolight/follow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              viewBox="0 96 960 960"
              width="48"
              className="w-6 h-6 fill-current"
            >
              <path d="m479.435 948.718-48.609-43.978q-106.231-97.889-175.847-168.98-69.616-71.091-110.93-127.066-41.314-55.975-57.53-101.96-16.215-45.986-16.215-93.289 0-94.915 63.544-158.528 63.544-63.613 157.087-63.613 55.885 0 103.877 25.304t84.623 74.543q43.13-51.739 88.77-75.793 45.639-24.054 99.859-24.054 94.379 0 158.006 63.574 63.626 63.574 63.626 158.43 0 47.409-16.215 93.127-16.216 45.718-57.53 101.694-41.314 55.975-111.138 127.412-69.823 71.437-176.204 169.199l-49.174 43.978Zm-.283-100.936q100.045-92.612 164.566-157.708t102.206-113.998q37.685-48.902 52.369-87.12 14.685-38.218 14.685-75.34 0-63.355-40.649-104.475-40.649-41.119-103.649-41.119-50.349 0-92.851 31.783-42.503 31.782-70.503 88.717h-52.217q-26.859-56.5-70.188-88.5t-92.204-32q-62.394 0-102.762 40.599t-40.368 105.353q0 38.151 15.184 76.807 15.183 38.655 52.835 88.06 37.653 49.405 101.556 113.989 63.903 64.583 161.99 154.952Zm1.413-290.412Z"></path>
            </svg>
          </a>
          {/* 贊助按鈕 */}
          <a
            className="js-back-project-now tracking-widest flex-1 border-blue-100 align-middle bg-blue-300 inline-block w-full text-base transition-transform hover:scale-105 focus:scale-105 active:scale-90 rounded font-bold py-2 "
            data-click-event="list_options"
            href="/projects/prolight/orders/back_project"
          >
            贊助專案
          </a>
        </div>
      </div>
    </>
  );
}

export default ProjectToolBar;
