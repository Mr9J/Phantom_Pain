import { Input } from "../ui/input";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { GroupDTO } from "@/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GroupFormValidation } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useUpdateGroup } from "@/lib/react-query/queriesAndMutation";
import { useToast } from "../ui/use-toast";

type GroupFormProps = {
  projectGroups?: GroupDTO;
  refetchGroup: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, Error>>;
  action: "create" | "update";
  projectId: number;
};

const GroupForm = ({
  projectGroups,
  refetchGroup,
  action,
  projectId,
}: GroupFormProps) => {
  const { mutateAsync: updateGroup } = useUpdateGroup();
  const { toast } = useToast();
  const [deleteUser, setDeleteUser] = useState<string>("F");
  const [showSmartOptions, setShowSmartOptions] = useState(false);
  const [keyword, setKeyword] = useState("");

  const handleChange = (value: string) => {
    if (value.includes("@")) {
      const parts = value.split("@");
      const lastPart = parts?.[parts.length - 1] ?? "";

      if (lastPart.length >= 2) {
        setKeyword(lastPart);
        setShowSmartOptions(true);
      }
    } else {
      setShowSmartOptions(false);
    }
  };

  const form = useForm<z.infer<typeof GroupFormValidation>>({
    resolver: zodResolver(GroupFormValidation),
    defaultValues: {
      groupName: "",
      username: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof GroupFormValidation>) => {
    if (deleteUser === "T") {
      const session = await updateGroup({
        groupId: projectGroups?.groupId || 0,
        groupName: values.groupName,
        username: values.username,
        projectId: projectId,
        action: "delete",
      });

      console.log(session);

      if (session === "Group not found.") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "找不到群組",
        });
        return;
      }

      if (session === "Member not found.") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "找不到使用者",
        });
        return;
      }

      if (session === "User already in the group.") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "使用者已在群組中",
        });
        return;
      }
      if (session === "請輸入欲刪除的用戶資訊") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "請輸入欲刪除的用戶資訊",
        });
        return;
      }

      if (!session) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "伺服器發生錯誤，請稍後再試",
        });

        return;
      }

      toast({
        title: "成功",
        description: "刪除完成",
      });

      await refetchGroup();

      return;
    }

    const session = await updateGroup({
      groupId: projectGroups?.groupId || 0,
      groupName: values.groupName,
      username: values.username,
      projectId: projectId,
      action: action,
    });

    if (session) {
      if (session === "Group not found.") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "找不到群組",
        });
        return;
      }
      if (session === "Member not found.") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "找不到使用者",
        });
        return;
      }
      if (session === "User already in the group.") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "使用者已在群組中",
        });
        return;
      }

      toast({
        title: "成功",
        description: "更新完成",
      });
    }

    if (!session) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "伺服器發生錯誤，請稍後再試",
      });

      return;
    }

    await refetchGroup();
  };

  useEffect(() => {
    if (action === "update") {
      form.setValue("groupName", projectGroups?.groupName || "");
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="groupName"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="col-start-1 col-end-2">群組名稱</FormLabel>
              <FormControl className="col-start-2 col-end-5">
                <Input placeholder="群組名稱..." list="groups" {...field} />
              </FormControl>
              <FormMessage className="text-red" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="col-start-1 col-end-2">新增帳號</FormLabel>
              <FormControl>
                <Input
                  className="col-start-2 col-end-5"
                  placeholder="新增人員帳號..."
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red" />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button
            type="submit"
            className="bg-red text-white hover:bg-red-600 hover:text-white"
            onClick={() => {
              setDeleteUser("T");
            }}
          >
            刪除
          </Button>
          <Button type="submit">儲存變更</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default GroupForm;
