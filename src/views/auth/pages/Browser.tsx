import { Input } from "@/components/ui/input";
import { SearchIcon, Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import GridPostList from "./GridPostList";
import { useSearchPosts } from "@/lib/react-query/queriesAndMutation";
import useDebounce from "@/hooks/useDebounce";
import LoaderSvg from "@/components/shared/LoaderSvg";
import { SearchTerm } from "@/types";
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

const searchType = [
  {
    value: "All",
    label: "全部",
  },
  {
    value: "Caption",
    label: "內文",
  },
  {
    value: "Tags",
    label: "標籤",
  },
  {
    value: "Username",
    label: "使用者",
  },
];

const Browser = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 500);
  const searchParams: SearchTerm = {
    keyword: debouncedValue,
    type: value || "All",
  };
  const { data: searchPosts, isFetching: isSearchFetching } =
    useSearchPosts(searchParams);

  return (
    <div className="flex flex-col flex-1 items-center overflow-scroll py-10 px-5 md:p-14 custom-scrollbar">
      <div className="max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9">
        <h2 className="text-[24px] font-bold leading-[140%] tracking-tighter md:text-[30px] w-full">
          搜尋貼文
        </h2>
        <div className="flex items-center gap-1 px-4 w-full rounded-lg dark:bg-dark-4 bg-slate-200">
          <SearchIcon width={24} height={24} />
          <Input
            type="text"
            placeholder="Search"
            className="h-12 dark:bg-dark-4 bg-slate-200 border-none placeholder:text-light-4 focus-visible:ring-0 focus-visible:ring-offset-0 ring-offset-0"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="text-[18px] font-bold leading-[140%] md:text-[24px]">
          熱門貼文
        </h3>
        <div className="flex justify-center items-center gap-3 dark:bg-dark-3 bg-slate-100 rounded-xl px-4 py-2 cursor-pointer">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {value
                  ? searchType.find((framework) => framework.value === value)
                      ?.label
                  : "分類搜尋..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="分類搜尋..." />
                <CommandList>
                  <CommandEmpty>找不到這個分類</CommandEmpty>
                  <CommandGroup>
                    {searchType.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === framework.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {framework.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        <ul className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7 max-w-5xl">
          {isSearchFetching ? (
            <LoaderSvg />
          ) : (
            searchPosts?.map((post, index) => (
              <li key={post.postId} className="relative min-w-80 h-80">
                <GridPostList key={index} post={post} />
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Browser;
