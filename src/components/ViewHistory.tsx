// 引入React的useEffect Hook和react-cookies套件
import { ProjectCardDTO } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import cookie from "react-cookies";
import ProjectCardVertical from "./ProjectCardVertical";
import { useParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

// 定義一個變數來儲存上一次瀏覽的Project ID
let lastViewedPid: string | null = null;

// 定義一個React功能組件來顯示瀏覽歷史
function ViewHistory() {
  // 使用useState Hook來管理Project卡片的狀態
  const [projectCards, setProjectCards] = useState<ProjectCardDTO[]>([]);
  // 使用useParams Hook來從URL中獲取pid參數
  const { pid } = useParams<{ pid: string }>();
  // 從環境變數中獲取API的URL
  const URL: string = import.meta.env.VITE_API_URL as string;

  // 使用useEffect Hook來更新上一次瀏覽的Project ID
  useEffect(() => {
    if (pid && pid !== lastViewedPid) {
      lastViewedPid = pid;
    }
  }, [pid]);

  // 使用useEffect Hook來從cookie中加載並更新瀏覽歷史
  useEffect(() => {
    // 從cookie中加載歷史紀錄
    let history: string[] = cookie.load("projectHistory") || [];

    // 確保歷史紀錄是一個陣列
    if (!Array.isArray(history)) {
      history = [history];
    }

    // 移除陣列中已存在的當前pid
    history = history.filter((id) => id !== pid);

    // 將上一次瀏覽的pid添加到歷史紀錄的開頭
    if (lastViewedPid && !history.includes(lastViewedPid)) {
      history.unshift(lastViewedPid);
    }

    // 只保留最新的6個紀錄（不包括當前的pid）
    history = history.slice(0, 6);

    // 更新cookie以儲存最新的瀏覽歷史
    cookie.save("projectHistory", history, { path: "/" });

    // 定義一個異步函數來呼叫API並更新Project卡片的狀態
    const fetchProjectCards = async () => {
      // 創建一個請求陣列來獲取所有歷史紀錄的Project資訊
      const requests = history.map((projectId: string) =>
        axios.get<ProjectCardDTO>(`${URL}/Project/History/${projectId}`)
      );
      try {
        // 等待所有請求完成並處理響應
        const responses = await Promise.all(requests);
        // 過濾掉當前瀏覽的Project ID並更新狀態
        const filteredProjectCards = responses
          .map((res) => res.data)
          .filter((card) =>
            pid ? card.projectId !== parseInt(pid, 10) : true
          );
        setProjectCards(filteredProjectCards);
      } catch (error) {
        // 如果API呼叫出錯，則在控制台中輸出錯誤訊息
        console.error("API呼叫出錯:", error);
      }
    };

    // 呼叫fetchProjectCards函數來執行API請求
    fetchProjectCards();
  }, [URL, pid]);

  // 渲染一個Carousel組件來顯示Project卡片
  return (
    <>
      <Carousel className="w-full">
        <CarouselContent className="-ml-1">
          {projectCards.map((item: ProjectCardDTO, index: number) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                {/* 渲染每個Project卡片 */}
                <ProjectCardVertical prj={item}></ProjectCardVertical>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Carousel的導航按鈕 */}
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
}

export default ViewHistory;
