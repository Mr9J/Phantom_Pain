import { useUserContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import type { Like } from "@/types/index";
import { Link } from "react-router-dom";



function Like() {
  const { user } = useUserContext();
  const [data, setData] = useState<Like[] | null>(null);
  const URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetchData();
  }, [URL, user]);

  const fetchData = async () => {
    const userid = user.id;
    try {
      const response = await fetch(`${URL}/Like/${userid}`);
      // const response = await fetch(`${URL}/Like/57`);
      const data = await response.json();
      console.log(data);
      console.log(userid);
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  //可以考慮是否把列表獨立出來
  
  // if (!data) {
  //   return <div>目前沒有關注的專案</div>;
  // }
  
  const deleteItem = async (prjId: number) => {
    try {
      const response = await fetch(`${URL}/Like/${prjId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("刪除出現錯誤");
      }
      //重新刷新like清單
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <body className="intent-mouse">
        <div className="container px-4 lg:px-0 mt-4 mb-6">
          <h2 className="flex text-2xl">追蹤計畫</h2>
        </div>
        <div className="container pb-16" >
          <div className="flex lg:-mx-4">
            {data? data.map((item: Like, index: number) => (
              <div key={index} className="px-4 py-4 w-full xs:w-1/2 lg:w-1/4">
              
                <Link 
                  className="block rounded mb-4 bg-zinc-100 aspect-ratio-project-cover "
                  to={`/project/${item.likePrjId}`}
                  style={{ backgroundImage: `url(${item.likePrjThumb})`,
                  backgroundSize:'cover'}}
                  
                >
                  &nbsp;
                </Link>
                {/* <img src={item.likePrjThumb} alt="Project Thumbnail" /> */}
                <Link  className="truncate block font-bold text-black mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" 
                        to={`/project/${item.likePrjId}`}>
                  {" "}
                  {item.likePrjName}
                </Link>
                {/* <h1>{item.likePrjName}</h1> */}
                <div className="flex justify-center">
                  <button onClick={() => deleteItem(item.likeDetailId)}>
                    取消追蹤
                  </button>
                </div>
                {/* <form className="edit_indemand" id="edit_indemand_18116" style={{cursor: "pointer"}} onSubmit={(event) => {event.preventDefault();deleteItem(item.LikePrjId);}}>
          <input type="submit" name="commit" value="取消追蹤" className="button button-s w-full text-center text-neutral-600" />
          </form> */}
              </div>
            )): (
              <div>目前沒有關注的專案</div>
            )}
          </div>
        </div>
        <div className="border-t bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" style={{position: 'fixed', bottom: '0', width: '100%' ,height:'25vh'}}>
          <footer className="max-w-xs md:max-w-5xl py-10 mx-auto flex flex-wrap px-3 justify-between">
            <section className="w-full md:w-auto pb-10 md:pb-0">
              <img
                className="h-10 w-auto"
                
                src="src/assets/_shared_img/logo.png"
              />
            </section>
            <section>
              <h2 className="text-sm font-semibold mb-4 ">幫助</h2>
              <h3 className="text-sm mb-3">
                <a className="text-gray-600 hover:text-zec-blue" href="/faq">
                  常見問題
                </a>
              </h3>
              <h3 className="text-sm mb-3">
                <a
                  className="text-gray-600 hover:text-zec-blue"
                  href="/docs/terms_of_service"
                >
                  使用條款
                </a>
              </h3>
              <h3 className="text-sm mb-3">
                <a
                  className="text-gray-600 hover:text-zec-blue"
                  href="/docs/privacy"
                >
                  隱私權政策
                </a>
              </h3>
            </section>
            <section>
              <h2 className="text-sm font-semibold mb-4">關於</h2>
              <h3 className="text-sm mb-3">
                <a className="text-gray-600 hover:text-zec-blue" href="/about">
                  關於我們
                </a>
              </h3>
              <h3 className="text-sm mb-3">
                <a className="text-gray-600 hover:text-zec-blue" href="/brand">
                  商標資源
                </a>
              </h3>
              <h3 className="text-sm mb-3">
                <a
                  className="text-gray-600 hover:text-zec-blue"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://kkfarm.zeczec.com"
                >
                  KKFARM 音樂創生
                </a>
              </h3>
            </section>
          </footer>
        </div>
  
      </body>
    </>
  );
}

export default Like;
