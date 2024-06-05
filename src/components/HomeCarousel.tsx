// import * as React from "react"
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getHomeProjects } from "@/services/projects.service";
import { useEffect, useState } from "react";
import HomeCardHorizon from "./HomeCardHorizon";

type HomeProjectDTO = {
  projectId: number;
  projectName: string;
  projectGoal: number;
  startDate: {
      year: number;
      month: number;
      day: number;
      dayOfWeek: number;
      dayOfYear: number;
      dayNumber: number;
  };
  endDate: {
      year: number;
      month: number;
      day: number;
      dayOfWeek: number;
      dayOfYear: number;
      dayNumber: number;
  };
  thumbnail: string;
  totalAmount: number;
  sponsorCount: number;
};

export function HomeCarousel() {
  const [projects, setProjects] = useState<HomeProjectDTO[]|null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getHomeProjects();
        setProjects(
          fetchedProjects.map((project: HomeProjectDTO) => ({
            ...project,
            isEdit: false,
          }))
        );
        //console.log('fetchedProjects:', fetchedProjects); // 確認資料是否成功加載
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);
  // projects;
  return (
    <>
      <Carousel
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-4/5 m-auto md:w-1/2"
      >
        <CarouselContent>
          {projects &&
            projects.slice(0,5).map((item:HomeProjectDTO, index:number) => (
              <CarouselItem key={index}>
                <a href={`/project/${item.projectId}`} data-click-event="select_content">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-video items-center justify-center p-6 group">
                      <img
                        src={item.thumbnail}
                        className="aspect-video rounded group-hover:scale-105 transition-all duration-500 ease-out"
                      />
                    </CardContent>
                    <div className="m-3 mt-0 ml-5 text-pretty">
                      <p>{item.projectName}</p>
                    </div>
                  </Card>
                </div>
                </a>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="container px-4 md:px-0 py-8 grid grid-cols-4 gap-6">
      {projects &&
            projects.slice(5).map((item:HomeProjectDTO, index:number) => (
      <HomeCardHorizon key={index} title={item.projectName} image={item.thumbnail} id={item.projectId} totalAmount={item.totalAmount} supporter={item.sponsorCount}></HomeCardHorizon>
    ))}
      </div>
    </>
  );
}
