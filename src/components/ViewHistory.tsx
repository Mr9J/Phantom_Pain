// 引入必要的依賴和組件
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

// 定義ViewHistory組件
function ViewHistory() {
  // 使用useState來管理projectCards狀態
  const [projectCards, setProjectCards] = useState<ProjectCardDTO[]>([]);
  // 從URL參數中獲取當前項目ID
  const { pid } = useParams<{ pid: string }>();
  // 從環境變量中獲取API URL
  const URL: string = import.meta.env.VITE_API_URL as string;

  // 當pid變化時更新lastViewedPid
  useEffect(() => {
    if (pid && pid !== lastViewedPid) {
      lastViewedPid = pid;
    }
  }, [pid]);

  // 處理瀏覽歷史和獲取項目卡片數據
  useEffect(() => {
    // 從cookie中加載瀏覽歷史
    let history: string[] = cookie.load("projectHistory") || [];
    // 確保history是一個數組
    if (!Array.isArray(history)) {
      history = [history];
    }
    // 從歷史記錄中移除當前正在瀏覽的項目
    history = history.filter((id) => id !== pid);
    // 將最後瀏覽的項目添加到歷史記錄的開頭
    if (lastViewedPid && !history.includes(lastViewedPid)) {
      history.unshift(lastViewedPid);
    }
    // 只保留最近的6個記錄
    history = history.slice(0, 6);
    // 保存更新後的歷史記錄到cookie
    cookie.save("projectHistory", history, { path: "/" });

    // 定義獲取項目卡片數據的異步函數
    const fetchProjectCards = async () => {
      // 為每個歷史記錄項目創建一個Promise
      const projectPromises = history.map(async (projectId: string) => {
        try {
          // 發送API請求獲取項目數據
          const response = await axios.get<ProjectCardDTO>(`${URL}/Project/History/${projectId}`);
          return response.data;
        } catch (error) {
          // 如果請求失敗，記錄錯誤並返回null
          console.error(`API call for project ${projectId} failed:`, error);
          return null;
        }
      });

      try {
        // 等待所有Promise解決
        const results = await Promise.all(projectPromises);
        // 過濾和處理結果
        const filteredProjectCards = results
          .filter((card): card is ProjectCardDTO => card !== null) // 過濾掉null值
          .filter((card) => pid ? card.projectId !== parseInt(pid, 10) : true); // 過濾掉當前正在瀏覽的項目
        // 更新projectCards狀態
        setProjectCards(filteredProjectCards);
      } catch (error) {
        // 如果處理過程中出錯，記錄錯誤
        console.error("Error in processing project cards:", error);
      }
    };

    // 調用fetchProjectCards函數
    fetchProjectCards();
  }, [URL, pid]); // 當URL或pid改變時重新執行

  // 渲染Carousel組件來顯示Project卡片
  return (
    <>
      <Carousel className="w-full">
        <CarouselContent className="-ml-1">
          {projectCards.length > 0 && projectCards.map((item: ProjectCardDTO, index: number) => (
            item && // 確保item不是undefined
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/2 lg:basis-1/4">
              <div className="p-1">
                {/* 渲染每個Project卡片 */}
                <ProjectCardVertical prj={item}></ProjectCardVertical>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Carousel的導航按鈕 */}
        <CarouselPrevious className="hidden sm:flex"/>
        <CarouselNext className="hidden sm:flex"/>
      </Carousel>
    </>
  );
}

// 導出ViewHistory組件
export default ViewHistory;