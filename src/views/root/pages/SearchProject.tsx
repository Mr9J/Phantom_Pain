import ProjectCardVertical from "@/components/ProjectCardVertical";
import { SearchComboBox } from "@/components/SearchComboBox";
import { SearchPagination } from "@/components/SearchPagination";
import { Input } from "@/components/ui/input";
import { getSearching } from "@/services/projects.service";
import { ProjectCardDTO } from "@/types";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Helmet } from "react-helmet-async";
function SearchProject({
  input,
  setInput,
}: {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}) {
  const params = new URLSearchParams(window.location.search).get("orderby");

  type SearchProjectDTO = {
    projectData: ProjectCardDTO[];
    totalPage: number;
  };

  const [searchedProjects, setSearchedProjects] = useState<
    ProjectCardDTO[] | null
  >(null);
  // const [input, setInput] = useState<string>(""); //關鍵字
  const [selectedValue, setSelectedValue] = useState<number>(0); //專案type
  const [page, setPage] = useState<number>(1); //當前頁
  const [totalPage, settotalPage] = useState<number>(1); //總頁數
  const [orderBy, setOrderBy] = useState<string>(params ? params : "all");
  const handleValueChange = (value: string) => {
    setSelectedValue(Number(value));
    setPage(1);
    //console.log(numberValue);
  }; //combobox的變更
  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  }; //page的變更
  const handleOrderByChange = (value: string) => {
    setOrderBy(value);
    setPage(1);
  };

  useEffect(() => {
    const fetchSearchProjects = async () => {
      try {
        const fetchedSearchProjects: SearchProjectDTO = await getSearching(
          input,
          page,
          selectedValue,
          orderBy
        ); //console.log('fetchedSearchProjects:', fetchedSearchProjects);
        setSearchedProjects(
          fetchedSearchProjects.projectData.map((project: ProjectCardDTO) => ({
            ...project,
          }))
        );
        settotalPage(
          fetchedSearchProjects.totalPage < 1
            ? 1
            : fetchedSearchProjects.totalPage
        );
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchSearchProjects(); //console.log(Date());
  }, [input, page, selectedValue, orderBy]); //後面陣列的參數有變動就會重新render useEffect

  

  return (
    <>
      <Helmet>
        <title>Mumu | 查詢計畫</title>
      </Helmet>
      <div className="opacity-100 container">
        <div className="container lg:py-8 py-4 lg:px-0 px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2">
            <div className="flex-grow">
              <SearchComboBox
                onValueChange={handleValueChange}
              ></SearchComboBox>
            </div>
            <div className="flex items-center w-full xs:w-auto xs:flex-row justify-center sm:justify-end">
              <div className="inline-block align-middle xs:w-auto grow mb-2 xs:mb-0 max-w-72">
                <div className="flex mb-2">
                  <Input
                    className="pl-8 rounded w-full mt-0"
                    type="text"
                    placeholder="搜尋計畫"
                    onChange={(e) => {
                      setInput(e.currentTarget.value);
                      setPage(1);
                    }}
                  ></Input>
                  <div className="relative ml-2 min-w-28">
                    <Select onValueChange={handleOrderByChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="排序"/>
                      </SelectTrigger>
                      <SelectContent ref={(ref) => { if (!ref) return; ref.ontouchstart = (e) => { e.preventDefault(); }; }} >
                        <SelectGroup>
                          <SelectLabel>排序方式</SelectLabel>
                          <SelectItem value="all">預設排序</SelectItem>
                          <SelectItem value="goal">專案金額</SelectItem>
                          <SelectItem value="sponsor">支持人次</SelectItem>
                          <SelectItem value="clicked">熱門點擊</SelectItem>
                          <SelectItem value="enddate">最後衝刺</SelectItem>
                          <SelectItem value="startdate">最新啟動</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 以上是查詢跟選類別 */}
      {/* 以下是prj生成跟選頁生成 */}
      <div className="container">
        <div className="flex flex-wrap">
          {searchedProjects &&
            searchedProjects.map((item: ProjectCardDTO, index: number) => (
              <div
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 px-4"
                key={index}
              >
                <ProjectCardVertical prj={item}></ProjectCardVertical>
              </div>
            ))}
        </div>
        <div className="text-center pb-16">
          <div className="mt-4">
            <SearchPagination
              totalPage={totalPage}
              currentPage={page}
              onPageChange={handlePageChange}
            ></SearchPagination>
          </div>
        </div>
      </div>
    </>
  );
}
export default SearchProject;
