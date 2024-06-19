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

function ViewHistory() {
  const [projectCards, setProjectCards] = useState<ProjectCardDTO[]>([]);
  const { pid } = useParams(); // 使用useParams來獲取pid參數
  const URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    // 從cookie中加載歷史紀錄
    let history = cookie.load("projectHistory") || [];

    // 確保歷史紀錄是一個陣列
    if (!Array.isArray(history)) {
      history = [history];
    }

    // 將當前的pid添加到歷史紀錄的開頭
    if (history.indexOf(pid) === -1) {
      // 移除陣列中已存在的當前pid
      history = history.filter((id: string | undefined) => id !== pid);
      // 將當前的pid添加到歷史紀錄的開頭
      history.unshift(pid);
      // 只保留最新的5個紀錄
      history = history.slice(0, 6);
      // 更新cookie
      cookie.save("projectHistory", history, { path: "/" });
    }

    // 使用所有歷史紀錄的ID來呼叫API並更新狀態
    const fetchProjectCards = async () => {
      const requests = history.map((projectId: string) =>
        axios.get(`${URL}/Project/History/${projectId}`)
      );
      try {
        const responses = await Promise.all(requests);
        setProjectCards(responses.map((res) => res.data));
      } catch (error) {
        console.error("API呼叫出錯:", error);
      }
    };

    fetchProjectCards();
  }, [URL, pid]);

  return (
    <>
      <Carousel className="w-full">
        <CarouselContent className="-ml-1">
          {projectCards.map((item: ProjectCardDTO, index: number) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <ProjectCardVertical prj={item}></ProjectCardVertical>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
}

export default ViewHistory;
