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
  const [projects, setProjects] = useState<HomeProjectDTO[] | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getHomeProjects();
        setProjects(
          fetchedProjects.map((project: HomeProjectDTO) => ({
            ...project,
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
        className="w-4/5 m-auto lg:w-1/2"
      >
        <CarouselContent>
          {projects &&
            projects.slice(0, 5).map((item: HomeProjectDTO, index: number) => (
              <CarouselItem key={index}>
                <a
                  href={`/project/${item.projectId}`}
                  data-click-event="select_content"
                >
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-video items-center justify-center p-6 group">
                        <img
                          src={item.thumbnail}
                          className="aspect-video rounded group-hover:scale-105 transition-all duration-500 ease-out border"
                        />
                      </CardContent>
                      {/* <div className="m-3 mt-0 ml-5 text-pretty line-clamp-1">
                      <p>{item.projectName}</p>
                    </div> */}
                      <div className="flex items-center relative py-3 md:py-4 md:px-6 leading-loose md:space-x-6">
                        <h2 className="font-semibold text-primary md:text-xl line-clamp-2 md:line-clamp-1 md:flex-1 w-full md:w-auto px-4 md:px-0">
                          {item.projectName}
                        </h2>
                        <div className="border-t border-secondary w-full mt-2 pb-2 md:hidden"></div>
                        <div className="flex md:flex-row-reverse items-center space-x-4 md:flex-initial px-4 md:px-0 justify-between w-full md:w-auto">
                          <h3 className="text-primary">
                            <span className="md:text-2xl font-semibold ml-2">
                              NT$ {item.totalAmount.toLocaleString()}
                            </span>
                          </h3>
                          <h3 className="text-primary">
                            <span className="font-semibold">{item.sponsorCount}</span>
                            <span className="text-xs sm:text-sm">人支持</span>
                          </h3>
                        </div>
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
          projects
            .slice(5)
            .map((item: HomeProjectDTO, index: number) => (
              <HomeCardHorizon
                key={index}
                title={item.projectName}
                image={item.thumbnail}
                id={item.projectId}
                totalAmount={item.totalAmount}
                supporter={item.sponsorCount}
              ></HomeCardHorizon>
            ))}
      </div>
    </>
  );
}
