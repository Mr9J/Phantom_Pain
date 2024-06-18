import React, { useState, useEffect, useRef } from "react";
const baseUrl = import.meta.env.VITE_API_URL;
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import { useUserContext } from "@/context/AuthContext";

const Create: React.FC = () => {
  //const [formData, setFormData] = useState({});
  const [projectDetail, setProjectDetail] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const { user, checkAuthUser } = useUserContext();
  const [isAuth, setIsAuth] = useState(true);
  useEffect(() => {
    checkAuthUser().then((res) => {
      setIsAuth(res);
    });
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 檢查檔案類型是否為圖像
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const contents = e.target?.result;
          setSelectedImage({
            file: file,
            preview: contents, // 用於顯示預覽圖像
          }); // 更新狀態以顯示所選圖像
        };
        reader.readAsDataURL(file); // 以 Data URL 格式讀取檔案內容
      } else {
        alert("請選擇圖像檔案！");
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    //event.preventDefault(); // 阻止表單默認的提交行為

    const formData = new FormData(event.currentTarget); // 收集表單數據
    formData.append("projectDetail", projectDetail);

    const jwt = localStorage.getItem("token");
    const url = `${baseUrl}/Home/CreateProject`;
    const method = "POST";

    fetch(url, {
      method: method,
      body: formData,
      headers: {
        Authorization: jwt as string,
      },
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
        //setBanProjectModal(false); // 確認表單
      })
      .catch((error) => {
        console.error("提交數據時發生錯誤：", error);
      });
  };
  const TINYAPIKEY = import.meta.env.VITE_TINY_MCE_KEY as string;
  const editorRef = useRef<TinyMCEEditor | null>(null); // 註記 editorRef 的型別為 Editor | null
  const log = () => {
    if (editorRef.current) {
      setProjectDetail(editorRef.current.getContent());
      // console.log(editorRef.current.getContent());
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 md:px-0">
        <div className="text-center">
          <h2 className="text-2xl font-bold my-16 inline-block after:h-1 after:block after:bg-teal-500 after:rounded after:mt-1">
            <span>群眾集資</span>
            提案
          </h2>
        </div>
        {/* 保護區 */}

        <div className="px-4 border border-gray-300 mb-16 rounded">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            className="space-y-8"
          >
            <div className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8 border-b border-gray-300">
              <div className="md:col-span-1 mt-1">
                <h2>
                  <label className="font-bold text-lg">使用者名稱</label>
                </h2>
              </div>
              <div className="mt-4 md:mt-0 md:col-span-3">
                <input
                  type="text"
                  className="w-full mb-2 rounded border bg-secondary text-primary"
                  value={user.username}
                  readOnly
                />

                <p>請確認您的使用者名稱正確無誤。</p>
              </div>
            </div>

            <div className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8 border-b border-gray-300">
              <div className="md:col-span-1 mt-1">
                <h2>
                  <label className="font-bold text-lg">電子信箱</label>
                </h2>
              </div>
              <div className="mt-4 md:mt-0 md:col-span-3">
                <input
                  type="email"
                  className="w-full mb-2 rounded border bg-secondary text-primary"
                  placeholder=""
                  value={user.email}
                  readOnly
                />

                <p>請確認你的信箱位址沒有錯誤，不然Mumu會聯絡不到你。</p>
              </div>
            </div>

            <div className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8 border-b border-gray-300">
              <div className="md:col-span-1 mt-1">
                <h2>
                  <label className="font-bold text-lg">預計開始時間</label>
                </h2>
              </div>
              <div className="mt-4 md:mt-0 md:col-span-3">
                <input
                  type="date"
                  className="border bg-secondary text-primary"
                  name="startDate"
                />
                <p>
                  告訴我們你希望什麼時候開始你的計畫（必須是未來的時間），Mumu將會為你安排審核順序。Mumu至少需要約十個工作天審核你的提案。
                </p>
              </div>
            </div>

            <div className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8 border-b border-gray-300">
              <div className="md:col-span-1 mt-1">
                <h2>
                  <label className="font-bold text-lg">預計結束時間</label>
                </h2>
              </div>
              <div className="mt-4 md:mt-0 md:col-span-3">
                <input
                  type="date"
                  className="border bg-secondary text-primary"
                  name="endDate"
                />
                <p>
                  計畫結束時間不得早於開始時間，計畫時間建議為期在 60 天內。
                </p>
              </div>
            </div>

            <div className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8 border-b border-gray-300">
              <div className="md:col-span-1 mt-1">
                <h2>
                  <label className="font-bold text-lg">計畫目標</label>
                </h2>
              </div>
              <div className="mt-4 md:mt-0 md:col-span-3">
                <div className="flex w-64 items-center">
                  <input
                    type="number"
                    className="w-full mb-2 rounded border bg-secondary text-primary"
                    placeholder="100000"
                    name="projectGoal"
                  />

                  <span className="flex-initial mb-2 pl-2">NTD</span>
                </div>
                <p>請根據你計畫的需求，估算你所需要募集的金額。</p>
              </div>
            </div>

            <div className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8 border-b border-gray-300">
              <div className="md:col-span-1 mt-1">
                <h2>
                  <label className="font-bold text-lg">分類</label>
                </h2>
              </div>
              <div className="mt-4 md:mt-0 md:col-span-3">
                <div className="flex w-64 items-center">
                  <select
                    className="border bg-secondary text-primary"
                    name="projectTypeId"
                  >
                    <option value="1" className="text-primary">
                      教育
                    </option>
                    <option value="2" className="text-primary">
                      居家生活
                    </option>
                    <option value="3" className="text-primary">
                      科技
                    </option>
                    <option value="4" className="text-primary">
                      時尚
                    </option>
                    <option value="5" className="text-primary">
                      飲食
                    </option>
                    <option value="6" className="text-primary">
                      表演
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8">
              <div className="md:col-span-1 mt-1">
                <h2>
                  <label className="font-bold text-lg">計畫名稱</label>
                </h2>
              </div>
              <div className="mt-4 md:mt-0 md:col-span-3">
                <input
                  type="text"
                  className="w-full mb-2 rounded border bg-secondary text-primary"
                  placeholder=""
                  name="projectName"
                />
              </div>
            </div>

            <div className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8">
              <div className="md:col-span-1 mt-1">
                <h2>
                  <label className="font-bold text-lg">計畫簡介</label>
                </h2>
              </div>
              <div className="mt-4 md:mt-0 md:col-span-3">
                <textarea
                  className="w-full mb-2 rounded border bg-secondary text-primary"
                  placeholder="請簡短的介紹這個計畫"
                  name="projectDescription"
                ></textarea>
              </div>
            </div>

            <div className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8">
              <div className="md:col-span-1 mt-1">
                <h2>
                  <label className="font-bold text-lg">封面照片</label>
                </h2>
              </div>
              <div className="mt-4 md:mt-0 md:col-span-3">
                <input
                  type="file"
                  className="w-full mb-2 rounded border bg-secondary text-primary"
                  placeholder=""
                  accept=".jpeg,.jpg,.png"
                  onChange={handleFileChange}
                  name="thumbnail"
                  // disabled
                />
                {selectedImage ? (
                  <img
                    src={selectedImage.preview}
                    alt="Selected"
                    className="aspect-video"
                  />
                ) : null}
                <p>
                  請上傳小於 7MB 的圖片，建議尺寸為 1200 x 675 像素 (16:9)。
                </p>
              </div>
            </div>

            <div className="md:grid md:grid-cols-4 md:gap-4 pb-4 md:pb-8 border-b border-gray-300">
              <div className="md:col-span-1 mt-1">
                <h2>
                  <label className="font-bold text-lg">計畫內容</label>
                </h2>
              </div>
              <div className="mt-4 md:mt-0 md:col-span-3">
                <Editor
                  apiKey={TINYAPIKEY}
                  onInit={(_evt, editor) => (editorRef.current = editor)}
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

                <p>
                  請告訴詳細介紹關於你計畫的故事、為什麼大家應該支持你的計畫。（最少
                  350 字）
                </p>
                <p>
                  請注意：Mumu必須要有足夠的訊息才有辦法審核計畫，如果您所提供的資訊過少，或嘖嘖無法評估計畫的真實性、可行性，計畫就會無法上架。
                </p>
              </div>
            </div>

            <div className="md:grid md:grid-cols-4 md:gap-4 pb-4 md:py-8 -mx-4 px-4">
              <div className="md:col-span-1 mt-1"></div>
              <div className="mt-4 md:mt-0 md:col-span-3">
                <button
                  type="submit"
                  className="bg-primary text-secondary  rounded px-6 py-2 font-bold border-2 border-current cursor-pointer"
                >
                  確定提案
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* 保護區 */}
      </div>
    </>
  );
};
export default Create;
