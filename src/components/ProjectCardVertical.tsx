import * as React from "react"
import { UsersRoundIcon, TimerIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ProjectCardDTO } from "@/types";
import '@/css/ProjectCardVertical.css'
export default function ProjectCardVertical({ prj }: { prj: ProjectCardDTO }) {
    const [progress, setProgress] = React.useState(13)
    React.useEffect(() => {
      const timer = setTimeout(() => setProgress(Math.round((prj.totalAmount/prj.projectGoal)*100)>100?100:Math.round((prj.totalAmount/prj.projectGoal)*100)), 1500)
      return () => clearTimeout(timer)
    }, [prj.projectGoal, prj.totalAmount])
  return (
    <a
      className="inline-block text-primary rounded xs:w-1/4 lg:w-full px-4 pb-4 mb-4 group"
      href={`/project/${prj.projectId}`}
    >
      <div className="bg-secondary explore h-full rounded pb-4 flex flex-col group-hover:shadow-md dark:group-hover:shadow-slate-500 border">
        <img
          width="1600"
          height="900"
          className="rounded-t bg-zinc-100 placeholder-16:9 aspect-video object-cover lazy block entered loaded"
          src={prj.thumbnail}
        />
        <div className="flex flex-col flex-1 h-full justify-between px-3">
          <h3 className="flex-header my-4 font-bold line-clamp-2 h-full">
            {prj.projectName}
          </h3>
          <div>
            <div className="flex items-center pb-2 space-x-2">
              <div className="relative flex-1">
                {/* <div className="border-4 absolute w-full rounded border-zec-green bg-zec-green" style='width:100%'></div>
                <div className="border-4 border-gray-200 bg-gray-200 rounded"></div> */}
                <Progress value={progress} className="w-[100%]" />
              </div>
              <h4 className="text-xs flex-initial">{progress}%</h4>
            </div>

            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-semibold flex-1">NT$ {prj.totalAmount.toLocaleString()}</h4>
              <h4 className="text-sm font-semibold flex items-center">
                <UsersRoundIcon className="text-sm text-gray-500 leading-none align-middle mr-px"></UsersRoundIcon>
                <span className="text-sm inline-block mr-px">{prj.sponsorCount}</span>人
              </h4>
              <h4 className="font-semibold flex items-center">
                <TimerIcon className="text-sm text-gray-500 leading-none align-middle mr-px"></TimerIcon>
                <span className="text-sm">{prj.dayLeft} 天</span>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
