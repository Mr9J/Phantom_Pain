import { useUserContext } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import type { Like, ProjectCardDTO } from "@/types/index";
import { Link } from "react-router-dom";
import HobbyList from "./HobbyList";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import ProjectCardVertical from "./ProjectCardVertical";

function Like() {
  const { user } = useUserContext();
  const [data, setData] = useState<Like[]>([]);
  const URL = import.meta.env.VITE_API_URL;
  const userid = user.id;

  //呼叫Hobby使用
  const [isHobbyListOpen, setIsHobbyListOpen] = useState(true);
  const [projectCards, setProjectCards] = useState([]);

  const closeHobbyList = () => {
    setIsHobbyListOpen(false);
  };
  useEffect(() => {
    const fetchHobbyStatus = async () => {
      try {
        const response = await axios.get(`${URL}/Hobby/${userid}`);
        setIsHobbyListOpen(response.data === false);
      } catch (error) {
        console.error("獲取興趣列表狀態時發生錯誤:", error);
      }
    };

    fetchHobbyStatus();
  }, [URL, userid]);

  //到此 下面return還有

  ////簡單來說React為了避免你的方法引用參數被改變 會建議你寫在內部 但是其他地方需要使用 同時又有使用useState無法放在最上方 所以需要使用useCallback確保
  // fetchData 函數現在被定義為 useCallback 鉤子，這樣可以保證它的身份在渲染之間是穩定的
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${URL}/Like/${userid}`);
      const data = await response.json();
      // console.log(data);
      // console.log(userid);
      setData(data);
    } catch (error) {
      console.log(error);
    }
  }, [URL, userid]); // 將 URL, user.id 和 setData 加入依賴數組

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchProjectCards = async () => {
      try {
        const response = await axios.get(`${URL}/Hobby/getMemHobby/${userid}`);
        setProjectCards(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching project cards:", error);
      }
    };
    fetchProjectCards();
  }, [URL, userid]);

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
      <body className="intent-mouse ">
        <div className="container px-4 lg:px-0 pt-8 mb-6 h-full ">
          <h2 className="flex text-2xl">追蹤計畫</h2>
        </div>
        <div className="container pb-16">
          <div className="flex lg:-mx-4  flex-wrap ">
            {data ? (
              data.map((item: Like, index: number) => (
                <div key={index} className="px-4 py-4 w-full xs:w-1/2 lg:w-1/4">
                  <Link
                    className="block rounded mb-4 bg-zinc-100 aspect-ratio-project-cover "
                    to={`/project/${item.likePrjId}`}
                    style={{
                      backgroundImage: `url(${item.likePrjThumb})`,
                      backgroundSize: "cover",
                    }}
                  >
                    &nbsp;
                  </Link>
                  {/* <img src={item.likePrjThumb} alt="Project Thumbnail" /> */}
                  <Link
                    className="truncate line-clamp-2 block font-bold text-black mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    to={`/project/${item.likePrjId}`}
                  >
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
              ))
            ) : (
              <div>目前沒有關注的專案</div>
            )}
          </div>
        </div>
        <div className="container px-4 lg:px-0 mt-4 mb-6">
          <h2 className="flex text-2xl">您的專屬推薦</h2>
          <Carousel className="w-full">
            <CarouselContent className="-ml-1">
              {projectCards.length > 0 &&
                projectCards.map(
                  (item: ProjectCardDTO, index: number) =>
                    item && ( // 確保item不是undefined
                      <CarouselItem
                        key={index}
                        className="pl-1 md:basis-1/2 lg:basis-1/4"
                      >
                        <div className="p-1">
                          {/* 渲染每個Project卡片 */}
                          <ProjectCardVertical prj={item}></ProjectCardVertical>
                        </div>
                      </CarouselItem>
                    )
                )}
            </CarouselContent>
            {/* Carousel的導航按鈕 */}
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        
      </body>

      {/* 呼叫HobbyList Component*/}
      {isHobbyListOpen && <HobbyList onClose={closeHobbyList} />}
    </>
  );
}

export default Like;
