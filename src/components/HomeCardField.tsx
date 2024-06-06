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
import { getHomeCardPOP } from "@/services/projects.service";
export default function HomeCardField() {
  const [projects, setProjects] = useState<ProjectCardDTO[] | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getHomeCardPOP();
        setProjects(
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
        <h2 className="text-2xl font-bold">熱門計畫</h2>
        <a
          className="inline-block text-base font-bold px-3 py-1 rounded text-primary bg-teal-500 hover:bg-secondary"
          href="/explore"
        >
          更多 &gt;
        </a>
      </div>
      <Carousel className="w-full ">
        <CarouselContent className="-ml-1">
          {projects &&
            projects.map((item: ProjectCardDTO, index: number) => (
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
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
