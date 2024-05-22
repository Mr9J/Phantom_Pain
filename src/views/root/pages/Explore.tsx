import { useState } from "react";
import axios from "axios";
import {
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  HelpCircle,
  LucideIcon,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProjectPhotoProps } from "@/types";
import ProjectCard from "@/components/explore/ProjectCard";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

type Status = {
  value: string;
  label: string;
  icon: LucideIcon;
};

const statuses: Status[] = [
  {
    value: "backlog",
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    value: "todo",
    label: "Todo",
    icon: Circle,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: ArrowUpCircle,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircle2,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: XCircle,
  },
];

const Explore = () => {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [data, setData] = useState<ProjectPhotoProps[]>([]);
  const [input, setInput] = useState<string>("");

  const auth = import.meta.env.VITE_PHOTO_API_KEY;
  const defaultURL = "https://api.pexels.com/v1/curated";
  const searchURL = `https://api.pexels.com/v1/search?query=${input}`;

  const search = async (url: string) => {
    if (input === "") {
      url = defaultURL;
    }
    const res = await axios.get(url, { headers: { Authorization: auth } });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: ProjectPhotoProps[] = res.data.photos.map((photo: any) => {
      return {
        id: photo.id,
        photographer: photo.photographer,
        photographer_id: photo.photographer_id,
        photographer_url: photo.photographer_url,
        imgSrc: photo.src.large,
      };
    });

    console.log(result);
    setData(result);
  };

  return (
    <main className="overflow-hidden">
      <div className="mt-12 sm:px-16 px-6 py-4 max-w-[1440px] mx-auto">
        <div className="flex flex-col items-start justify-start gap-y-2.5">
          <h1 className="text-4xl font-extrabold">Project Explore</h1>
          <p>Explore out project you might like</p>
        </div>
        <div className="mt-12 w-full flex justify-between flex-wrap gap-5">
          <div className="flex w-full max-w-lg items-center space-x-2">
            <Input
              type="text"
              placeholder="Search"
              onChange={(e) => {
                setInput(e.currentTarget.value);
              }}
            />
            <Button
              type="submit"
              onClick={() => {
                search(searchURL);
              }}
            >
              Search
            </Button>
            <div className="flex justify-start flex-wrap items-center gap-2">
              <div className="flex items-center space-x-4">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-[150px] justify-start"
                    >
                      {selectedStatus ? (
                        <>
                          <selectedStatus.icon className="mr-2 h-4 w-4 shrink-0" />
                          {selectedStatus.label}
                        </>
                      ) : (
                        <>+ Set status</>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" side="right" align="start">
                    <Command>
                      <CommandInput placeholder="Change status..." />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                          {statuses.map((status) => (
                            <CommandItem
                              key={status.value}
                              value={status.value}
                              onSelect={(value) => {
                                setSelectedStatus(
                                  statuses.find(
                                    (priority) => priority.value === value
                                  ) || null
                                );
                                setOpen(false);
                              }}
                            >
                              <status.icon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  status.value === selectedStatus?.value
                                    ? "opacity-100"
                                    : "opacity-40"
                                )}
                              />
                              <span>{status.label}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Link
              to="/"
              className={`${buttonVariants({
                variant: "link",
              })} text-xl font-extrabold`}
            >
              回首頁
            </Link>
          </div>
        </div>

        {data && (
          <section>
            <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full gap-8 pt-14">
              {data.map((project, index) => (
                <ProjectCard project={project} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default Explore;
