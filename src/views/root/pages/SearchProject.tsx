import { SearchComboBox } from "@/components/SearchComboBox";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function SearchProject() {
  const [input, setInput] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    console.log(value);
  };
  return (
    <>
      <div className="opacity-100">
        <div className="container lg:py-8 py-4 lg:px-0 px-4">
          <div className="flex items-center justify-between space-y-2">
            <div className="flex-grow mt-2">
              <SearchComboBox
                onValueChange={handleValueChange}
              ></SearchComboBox>
            </div>
            <div className="inline-block align-middle xs:w-auto grow mb-2 xs:mb-0 max-w-72">
              <Input
                className="pl-8 rounded w-full mt-0"
                type="text"
                placeholder="搜尋計畫"
                onChange={(e) => {
                  setInput(e.currentTarget.value);
                }}
              ></Input>
            </div>
          </div>
        </div>
      </div>
        {/* 以上是查詢跟選類別 */}
        {/* 以下是prj生成跟選頁生成 */}
      <div className="container">

      </div>
    </>
  );
}
export default SearchProject;
