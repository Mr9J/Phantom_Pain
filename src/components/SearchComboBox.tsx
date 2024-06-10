// import * as React from "react"
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
import { getProjectType } from "@/services/projects.service";
type prjTpye = {
  projectTypeId: number;
  projectTypeName: string;
  memberInterestProjectTypes: [];
  projectIdtypes: [];
};
interface SearchComboBoxProps {
    onValueChange: (value: string) => void;
  }
export function SearchComboBox({ onValueChange }: SearchComboBoxProps) {
  const [types, setTypes] = useState<prjTpye[] | null>(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const fetchedTypes = await getProjectType();
        setTypes(
            fetchedTypes.map((project: prjTpye) => ({
            ...project,
          }))
        );
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchTypes();
  }, []);
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="選一個主題" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup >
          <SelectLabel>主題分類</SelectLabel>
          <SelectItem value="all">全部</SelectItem>
          {types &&
            types.map((item: prjTpye ,index:number) => (
              <SelectItem key={index} value={item.projectTypeId.toString()}>
                {item.projectTypeName}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
