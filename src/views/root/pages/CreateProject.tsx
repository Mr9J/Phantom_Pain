import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";

const baseUrl = import.meta.env.VITE_API_URL;
const TINYAPIKEY = import.meta.env.VITE_TINY_MCE_KEY as string;
const formSchema = z.object({
  username: z.string().min(2, {
    message: "請輸入使用者名稱。",
  }),
  email: z.string().min(2, {
    message: "請輸入email。",
  }),
  startdate: z.date({
    required_error: "請輸入開始日期。",
  }),
  enddate: z.date({
    required_error: "請輸入結束日期。",
  }),
  goal: z.number().int().gte(1, { message: "請輸入金額。" }),
  typeid: z.string().min(1, { message: "請選擇分類。" }),
  projectname: z
    .string({
      required_error: "起碼給個名字呀。",
    })
    .min(1, { message: "起碼給個名字呀。" }),
  projectdescription: z.string().min(50, { message: "最少 50 字。" }),
  thumbnail: z.string().refine(
    (path) => {
      const fileType = path.split(".").pop();
      return fileType === "jpeg" || fileType === "jpg" || fileType === "png";
    },
    {
      message: "封面照片的檔案類型必須是 jpeg、jpg 或 png。",
    }
  ),
  projectdetail: z.string().min(350, { message: "最少 350 字。" }),
});

function CreateProject() {
  //isAuthenticated: 是否已經登入
  //user: 登入的使用者資料
  const { user, isAuthenticated } = useUserContext();
  const [isAuth, setIsAuth] = useState(false);

  //頁面載入時檢查使用者是否已經登入，如果只是要取得使用者資料，可以不用檢查
  //isAuth時時判斷是否已經登入
  //依需求使用navigate導向特定頁面，或是history.back()返回上一頁
  useEffect(() => {
    setIsAuth(isAuthenticated);
  }, [isAuthenticated]);

  const [formData, setFormData] = useState({});
  const [visibleBanProjectModal, setBanProjectModal] = useState(false);
  const [projectContext, setProjectContext] = useState([0, "", 0, 0, 0]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    //event.preventDefault(); // 阻止表單默認的提交行為

    const formData = new FormData(event.currentTarget); // 收集表單數據

    const jsonData: Record<string, string> = {};
    formData.forEach((value, key) => {
      jsonData[key] = value as string;
    });
    setFormData(jsonData);

    const url = `${baseUrl}/project`;
    const method = "POST";
    //debug用
    //console.log("URL:", url);
    //console.log("Method:", method);
    //console.log("Data being sent:", jsonData);

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json", // 指定 Content-Type 為 application/json
      },
      body: JSON.stringify(jsonData), // 轉換數據為 JSON 字符串並作為請求體
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("成功提交數據：", data);
        setBanProjectModal(false); // 確認表單
      })
      .catch((error) => {
        console.error("提交數據時發生錯誤：", error);
      });
  };
  const day = new Date().setHours(0, 0, 0, 0);
  const today = new Date(day);
  const ninetyDaysFromNow = new Date();
  ninetyDaysFromNow.setDate(today.getDate() + 90);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      startdate: today,
      enddate: ninetyDaysFromNow,
      goal: 0,
      typeid: "",
      projectname: "",
      projectdescription: "",
      thumbnail: "",
      projectdetail: "",
    },
  });
  const editorRef = useRef<TinyMCEEditor | null>(null); // 註記 editorRef 的型別為 Editor | null
  const log = () => {
    if (editorRef.current) {
      form.setValue("projectdetail", editorRef.current.getContent());
      // console.log(editorRef.current.getContent());
    }
  };
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    console.log(values);
  }
  return (
    <div className="container mx-auto px-4 md:px-0">
      <div className="text-center">
        <h2 className="text-2xl font-bold my-16 inline-block after:h-1 after:block after:bg-teal-500 after:rounded after:mt-1">
          <span>群眾集資</span>
          提案
        </h2>
      </div>
      {/* 保護區 */}
      <div className="px-4 border border-gray-300 mb-16 rounded">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8 border-b border-gray-300">
                  <div className="md:col-span-1 mt-1">
                    <h2>
                      <FormLabel className="font-bold text-lg">
                        使用者名稱
                      </FormLabel>
                    </h2>
                  </div>
                  <div className="mt-4 md:mt-0 md:col-span-3">
                    <FormControl>
                      <Input
                        type="text"
                        className="w-full mb-2 rounded"
                        placeholder=""
                        {...field}
                        // disabled
                      />
                    </FormControl>
                    <FormDescription>
                      請確認您的使用者名稱正確無誤。
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8 border-b border-gray-300">
                  <div className="md:col-span-1 mt-1">
                    <h2>
                      <FormLabel className="font-bold text-lg">
                        電子信箱
                      </FormLabel>
                    </h2>
                  </div>
                  <div className="mt-4 md:mt-0 md:col-span-3">
                    <FormControl>
                      <Input
                        type="email"
                        className="w-full mb-2 rounded"
                        placeholder=""
                        {...field}
                        // disabled
                      />
                    </FormControl>
                    <FormDescription>
                      請確認你的信箱位址沒有錯誤，不然Mumu會聯絡不到你。
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startdate"
              render={({ field }) => (
                <FormItem className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8 border-b border-gray-300">
                  <div className="md:col-span-1 mt-1">
                    <h2>
                      <FormLabel className="font-bold text-lg">
                        預計開始時間
                      </FormLabel>
                    </h2>
                  </div>
                  <div className="mt-4 md:mt-0 md:col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < today || date > ninetyDaysFromNow
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      告訴我們你希望什麼時候開始你的計畫（必須是未來的時間），Mumu將會為你安排審核順序。Mumu至少需要約十個工作天審核你的提案。
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enddate"
              render={({ field }) => (
                <FormItem className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8 border-b border-gray-300">
                  <div className="md:col-span-1 mt-1">
                    <h2>
                      <FormLabel className="font-bold text-lg">
                        預計結束時間
                      </FormLabel>
                    </h2>
                  </div>
                  <div className="mt-4 md:mt-0 md:col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < form.getValues("startdate")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      計畫結束時間不得早於開始時間，計畫時間建議為期在 60 天內。
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8 border-b border-gray-300">
                  <div className="md:col-span-1 mt-1">
                    <h2>
                      <FormLabel className="font-bold text-lg">
                        計畫目標
                      </FormLabel>
                    </h2>
                  </div>
                  <div className="mt-4 md:mt-0 md:col-span-3">
                    <div className="flex w-64 items-center">
                      <FormControl>
                        <Input
                          type="number"
                          className="w-full mb-2 rounded"
                          placeholder="100000"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          // disabled
                        />
                      </FormControl>
                      <span className="flex-initial mb-2 pl-2">NTD</span>
                    </div>
                    <FormDescription>
                      請根據你計畫的需求，估算你所需要募集的金額。
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="typeid"
              render={({ field }) => (
                <FormItem className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8 border-b border-gray-300">
                  <div className="md:col-span-1 mt-1">
                    <h2>
                      <FormLabel className="font-bold text-lg">分類</FormLabel>
                    </h2>
                  </div>
                  <div className="mt-4 md:mt-0 md:col-span-3">
                    <div className="flex w-64 items-center">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="選擇計畫分類" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">教育</SelectItem>
                          <SelectItem value="2">居家生活</SelectItem>
                          <SelectItem value="3">科技</SelectItem>
                          <SelectItem value="4">時尚</SelectItem>
                          <SelectItem value="5">飲食</SelectItem>
                          <SelectItem value="6">表演</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectname"
              render={({ field }) => (
                <FormItem className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8">
                  <div className="md:col-span-1 mt-1">
                    <h2>
                      <FormLabel className="font-bold text-lg">
                        計畫名稱
                      </FormLabel>
                    </h2>
                  </div>
                  <div className="mt-4 md:mt-0 md:col-span-3">
                    <FormControl>
                      <Input
                        type="text"
                        className="w-full mb-2 rounded"
                        placeholder=""
                        {...field}
                        // disabled
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectdescription"
              render={({ field }) => (
                <FormItem className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8">
                  <div className="md:col-span-1 mt-1">
                    <h2>
                      <FormLabel className="font-bold text-lg">
                        計畫簡介
                      </FormLabel>
                    </h2>
                  </div>
                  <div className="mt-4 md:mt-0 md:col-span-3">
                    <FormControl>
                      <Textarea
                        className="w-full mb-2 rounded"
                        placeholder="請簡短的介紹這個計畫"
                        {...field}
                        // disabled
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8">
                  <div className="md:col-span-1 mt-1">
                    <h2>
                      <FormLabel className="font-bold text-lg">
                        封面照片
                      </FormLabel>
                    </h2>
                  </div>
                  <div className="mt-4 md:mt-0 md:col-span-3">
                    <FormControl>
                      <Input
                        type="file"
                        className="w-full mb-2 rounded"
                        placeholder=""
                        accept=".jpeg,.jpg,.png"
                        {...field}
                        // disabled
                      />
                    </FormControl>
                    <FormDescription>
                      建議尺寸為 1200 x 675 像素 (16:9)
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectdetail"
              render={() => (
                <FormItem className="md:grid md:grid-cols-4 md:gap-4 pb-4 md:pb-8 border-b border-gray-300">
                  <div className="md:col-span-1 mt-1">
                    <h2>
                      <FormLabel className="font-bold text-lg">
                        計畫內容
                      </FormLabel>
                    </h2>
                  </div>
                  <div className="mt-4 md:mt-0 md:col-span-3">
                    <FormControl>
                      <Editor
                        apiKey={TINYAPIKEY}
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue=""
                        init={{
                          height: 500,
                          menubar: false,
                          plugins:
                            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate  mentions  tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",

                          toolbar:
                            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments |  align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",

                          content_style:
                            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                        }}
                        onChange={log}
                      />
                    </FormControl>
                    <FormDescription>
                      請告訴詳細介紹關於你計畫的故事、為什麼大家應該支持你的計畫。（最少
                      350 字）
                    </FormDescription>
                    <FormDescription>
                      請注意：Mumu必須要有足夠的訊息才有辦法審核計畫，如果您所提供的資訊過少，或嘖嘖無法評估計畫的真實性、可行性，計畫就會無法上架。
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="md:grid md:grid-cols-4 md:gap-4 pb-4 md:py-8 -mx-4 px-4">
              <div className="md:col-span-1 mt-1"></div>
              <div className="mt-4 md:mt-0 md:col-span-3">
                <Button type="submit">確定提案</Button>
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* 保護區 */}
    </div>
  );
}

export default CreateProject;
