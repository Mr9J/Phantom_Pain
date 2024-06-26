import { useEffect, useState } from "react";
import ProjectCardVertical from "./ProjectCardVertical";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProjectCardDTO } from "@/types";
import {
  getHomeCardDayLeft,
  getHomeCardPOP,
} from "@/services/projects.service";
export default function HomeCardField() {
  const [POPprojects, setPOPProjects] = useState<ProjectCardDTO[] | null>(null);
  const [DayLeftprojects, setDayleftProjects] = useState<
    ProjectCardDTO[] | null
  >(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getHomeCardPOP();
        setPOPProjects(
          fetchedProjects.map((project: ProjectCardDTO) => ({
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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getHomeCardDayLeft();
        setDayleftProjects(
          fetchedProjects.map((project: ProjectCardDTO) => ({
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

  return (
    <div className="container">
      <div className="flex items-center justify-between p-4 mb-4 lg:px-0">
        <h2 className="text-2xl font-bold">熱門項目</h2>
        <a
          className="inline-block text-base font-bold px-3 py-1 rounded text-primary bg-teal-500 hover:bg-secondary"
          href="/SearchProject?orderby=sponsor"
        >
          更多 &gt;
        </a>
      </div>
      <div className="flex lg:-mx-4">
        <Carousel className="w-full ">
          <CarouselContent className="-ml-1">
            {POPprojects &&
              POPprojects.map((item: ProjectCardDTO, index: number) => (
                <CarouselItem
                  key={index}
                  className="pl-1 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <ProjectCardVertical prj={item}></ProjectCardVertical>
                    {/* <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-2xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card> */}
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className="ml-6 sm:flex"/>
          <CarouselNext className="mr-6 sm:flex"/>
        </Carousel>
      </div>

      <div className="flex items-center justify-between p-4 mb-4 lg:px-0">
        <h2 className="text-2xl font-bold">即將到期</h2>
        <a
          className="inline-block text-base font-bold px-3 py-1 rounded text-primary bg-teal-500 hover:bg-secondary"
          href="/SearchProject?orderby=enddate"
        >
          更多 &gt;
        </a>
      </div>
      <div className="flex lg:-mx-4">
        <Carousel className="w-full ">
          <CarouselContent className="-ml-1">
            {DayLeftprojects &&
              DayLeftprojects.map((item: ProjectCardDTO, index: number) => (
                <CarouselItem
                  key={index}
                  className="pl-1 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <ProjectCardVertical prj={item}></ProjectCardVertical>
                    {/* <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-2xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card> */}
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className="ml-6 sm:flex"/>
          <CarouselNext className="mr-6 sm:flex"/>
        </Carousel>
      </div>
    </div>
  );
}
