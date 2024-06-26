import React, { useState, useEffect, useRef } from "react";
const baseUrl = import.meta.env.VITE_API_URL;
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import { useUserContext } from "@/context/AuthContext";
import { Navigate, useNavigate, useParams } from "react-router-dom";
// import { EventHandler } from "@tinymce/tinymce-react/lib/cjs/main/ts/Events";
import axios from "axios";
import { Helmet } from "react-helmet-async";
const Create: React.FC = () => {
  //const [formData, setFormData] = useState({});
  const { pid } = useParams();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [projectGoal, setProjectGoal] = useState<number>();
  const [projectTypeId, setProjectTypeId] = useState<string>("1");
  const [projectName, setProjectName] = useState<string>();
  const [projectDescription, setProjectDescription] = useState<string>();
  const [projectPreDetail, setProjectPreDetail] = useState<string>();
  const [projectDetail, setProjectDetail] = useState("");
  const [statusID, setStatusID] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );
  const { user, checkAuthUser } = useUserContext();
  const [isAuth, setIsAuth] = useState(true);
  const [pic, setPic] = useState<string | null>(null);
  const navigate = useNavigate();
  interface SelectedImage {
    file: File;
    preview: string | ArrayBuffer | null | undefined;
  }
  useEffect(() => {
    if (pid) getProjectInfo();
    checkAuthUser().then((res) => {
      setIsAuth(res);
    });
  }, []);

  const getProjectInfo = async () => {
    try {
      const res = await axios.get(`${baseUrl}/Home/GetEditProject/${pid}`);
      // const res = await axios.get(
      //   `https://localhost:7150/api/Home/GetEditProject/${pid}`
      // );
      //console.log(res.data);
      if (!res.data[0]) navigate("/notfound");
      setStartDate(res.data[0]["startDate"]);
      setEndDate(res.data[0]["endDate"]);
      setProjectGoal(res.data[0]["projectGoal"]);
      setProjectTypeId(res.data[0]["projectTypeId"]);
      setProjectName(res.data[0]["projectName"]);
      setProjectDescription(res.data[0]["description"]);
      setProjectPreDetail(res.data[0]["projectDetails"]);
      setSelectedImage(res.data[0]["thumbnail"]);
      setStatusID(res.data[0]["statusID"]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDate(event.target.value);
  };
  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };
  const handleProjectGoalChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProjectGoal(Number(event.target.value));
  };
  const handleProjectTypeIdChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProjectTypeId(event.target.value);
  };
  const handleStatusIDChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusID(event.target.value);
  };
  const handleProjectNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProjectName(event.target.value);
  };
  const handleProjectDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setProjectDescription(event.target.value);
  };

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

  useEffect(() => {
    if (selectedImage && selectedImage.file instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = (reader.result as string).split(",")[1]; // 獲取 Base64 編碼的圖片數據
        setPic(base64Image);
        // 將 Base64 圖片數據添加到 formData 中
      };
      reader.readAsDataURL(selectedImage.file);
    }
  }, [selectedImage]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    //event.preventDefault(); // 阻止表單默認的提交行為

    const formData = new FormData(event.currentTarget); // 收集表單數據
    formData.append("projectDetail", projectDetail);
    if (pid) formData.append("projectId", pid);

    //console.log(pic);
    if (pic) formData.append("thumbnail", pic as string);

    const jsonData: Record<string, string> = {};
    formData.forEach((value, key) => {
      jsonData[key] = value as string;
    });

    const jwt = localStorage.getItem("token");
    const url = pid
      ? `${baseUrl}/Home/EditProject`
      : `${baseUrl}/Home/CreateProject`;
    // const url = pid
    //   ? `https://localhost:7150/api/Home/EditProject`
    //   : `https://localhost:7150/api/Home/CreateProject`;
    const method = pid ? "PUT" : "POST";
    // console.log(JSON.stringify(jsonData));
    fetch(url, {
      method: method,
      body: JSON.stringify(jsonData),
      headers: {
        Authorization: jwt as string,
        "Content-Type": "application/json",
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
        alert(pid ? "修改完成。" : "請等候管理員審核。");
        navigate("/manu/projects");
        //setBanProjectModal(false); // 確認表單
      })
      .catch((error) => {
        console.error("提交數據時發生錯誤：", error);
      });
  };
  const TINYAPIKEY = import.meta.env.VITE_TINY_MCE_KEY as string;
  const editorRef = useRef<TinyMCEEditor | null>(null); // 註記 editorRef 的型別為 Editor | null
  const log = () => {
    //setProjectPreDetail(e.target.value);
    if (editorRef.current) {
      setProjectDetail(editorRef.current.getContent());
      //console.log(editorRef.current.getContent());
    }
  };
  function demo(): undefined {
    setStartDate("2024-06-28");
    setEndDate("2024-07-18");
    setProjectGoal(10000);
    setProjectTypeId("1");
    setProjectName("興大附農耕心吉他社16屆大型成果發表會");
    setProjectDescription(
      "2024/7/20 13:00入場13:30開始 這是耕心16屆的最後一場表演《致•16歲的青春》，我們將盡所能，以這次的成果發表會為高中社團生涯畫上句號，歡迎大家一起共襄盛舉🎉"
    );
    setProjectPreDetail(
      '<div class="js-expand-project-content maxh7 mb-4 overflow-hidden relative maxh-none-ns mv-child-0 xs:overflow-visible"><table class="w-full" style="table-layout: fixed; border-spacing: 0;"><tbody><tr><td><iframe width="560" height="315" src="https://www.youtube.com/embed/mrulGtvNB9c?si=l8NI4LUUST-AtkTq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><p><u></u>大家好，我們是興大附農耕心吉他社16屆，我們即將在七月中旬舉辦我們的成果發表會。</p><p>這是我們高中社團的最後一個表演，讓這兩年的回憶畫上一個句點。從一開始少少人，到現在8個人，從素不相識變到無話不談，兩年來，一起從零開始學習吉他，爬格子、音階、節奏練習，慢慢地開始些簡單的曲子，再到可以一起合奏、或甚至是一個人帶著一把吉他在台上獨當一面。我們一起辦了大大小小的活動、一起做了許許多多有趣的事、一起參加了多場不同的演出。</p><h4 class="hide-child relative"><a name="h-716d6371" class="-mt-32 absolute"></a>這是倒數100天的時候🌟<br><img alt="" data-src="https://cdn.mumumsit158.com/Projects/project-998/Thumbnail.png" class="lazy entered loaded" data-ll-status="loaded" src="https://cdn.mumumsit158.com/Projects/project-998/Thumbnail.png"></h4><p><br></p><p>從小高一開始、每個禮拜大家一起社練，每一點基本功、技巧的建立，每一場活動、表演經驗的累積，都是為著這一天做的準備。</p><p>最後，我們耕心吉他16屆，即將迎來最後一場演出，希望我們盡所有努力辦好最後一場表演，傳承最珍貴的精神給學弟妹們，給予大家最寶貴的回憶。</p><p>為了完成這個追逐許久的目標，因此，需要大家的幫助，有你們的參與，我們會離這個目標更進一步。</p><p><br></p><p>相關資訊ℹ️</p><p>地點：興大附農 活水堂</p><p>時間：113/7/20 &nbsp; &nbsp;13:00入場13:30開始</p><p>免費入場🌟</p><div class="-mt-32"><div class="pt-32" id="project_risk"></div></div><h3 class="mt-8">風險與挑戰</h3><div class="prose"><p>本團隊將以如期演出、出貨為宗旨，但仍可能因不可抗力因素延期、取消演出或是物流延後、延遲出貨等等，如果您贊助此次計劃，則代表您同意承擔此風險。同時，團隊也會盡力保障各位贊助者們的權益。</p></div><div class="-mt-32"><div class="pt-32" id="project_return"></div></div><h3 class="mt-8">退換貨規則</h3><div class="prose"><p>回饋品項為同學所設計之印刷物品及創意客製小物。由於是演出當天領取，須於領取當下檢查商品是否有瑕疵，一旦離開領取區域，則當作您同意商品沒有問題，恕不接受退換貨。若因故無法到場觀看演出，耕心吉他社將於演出完後，與您聯絡寄送回饋商品相關事宜。</p><p>依照《消費者保護法》的規定，您享有商品貨到次日起七天猶豫期（包含例假日）之權益，超過七天後則無法退換貨，請於期限內主動聯絡客服，並提供以下資訊申請退換貨，待確認收到商品後，將由系統人員處理發貨。<br>換貨時請將回饋品保持原始的狀態，並以電子郵件聯絡辦理換貨，若缺少其中一項物品將不受理換貨</p></div><div class="-mt-32"><div class="pt-32" id="project_contact"></div></div><h3 class="mt-8">客服聯絡方式</h3><div class="prose"><p>集資金額將由荊煒洲收取控管<br>聯絡之電子郵件為 <a href="mailto:z0958953723@gmail.com">z0958953723@gmail.com</a><br>歡迎有任何問題嘖嘖站內訊息可以私訊我們哦<br>IG:gengxin_guitar</p><p><a href="https://www.instagram.com/gengxin_guitar?igsh=eDJ5cDFseDN1bzV2">https://www.instagram.com/gengxin_guitar?igsh=eDJ5cDFseDN1bzV2</a></p></div></td></tr></tbody></table></div>'
    );
  }

  return (
    <>
      {!isAuth && <Navigate to="/sign-in" />}
      <Helmet>
        <title>{pid?'Mumu | 編輯計畫':'Mumu | 發起計畫'}</title>
      </Helmet>
      <div className="container mx-auto px-4 md:px-0">
        <div className="text-center">
          <h2 className="text-2xl font-bold my-16 inline-block after:h-1 after:block after:bg-teal-500 after:rounded after:mt-1">
            <span>{pid ? "編輯" : "群眾集資"}</span>
            提案
          </h2>
        </div>
        {/* 保護區 */}
        <button
          onClick={demo}
          className="bg-secondary text-primary rounded border bottom-7"
        >
          demo
        </button>
        <div className="px-4 border border-gray-300 mb-16 rounded">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (confirm("請確認內容有無錯誤")) handleSubmit(e);
            }}
            className="space-y-8"
          >
            {!pid && (
              <>
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
              </>
            )}

            {pid && (
              <>
                <div className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8 border-b border-gray-300">
                  <div className="md:col-span-1 mt-1">
                    <h2>
                      <label className="font-bold text-lg">狀態</label>
                    </h2>
                  </div>
                  <div className="mt-4 md:mt-0 md:col-span-3">
                    <div className="flex w-64 items-center">
                      <select
                        className="border bg-secondary text-primary rounded"
                        name="statusID"
                        onChange={handleStatusIDChange}
                        value={statusID}
                      >
                        {statusID != "3" && (
                          <>
                            <option value="1" className="text-primary">
                              上架
                            </option>
                            <option value="2" className="text-primary">
                              下架
                            </option>
                          </>
                        )}
                        {statusID == "3" && (
                          <>
                            <option value="3" className="text-primary">
                              審核中
                            </option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="md:grid md:grid-cols-4 md:gap-4 py-4 md:py-8 border-b border-gray-300">
              <div className="md:col-span-1 mt-1">
                <h2>
                  <label className="font-bold text-lg">預計開始時間</label>
                </h2>
              </div>
              <div className="mt-4 md:mt-0 md:col-span-3">
                <input
                  type="date"
                  className="border bg-secondary text-primary rounded"
                  name="startDate"
                  value={startDate}
                  onChange={handleStartDateChange}
                  required
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
                  className="border bg-secondary text-primary rounded"
                  name="endDate"
                  value={endDate}
                  onChange={handleEndDateChange}
                  required
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
                    value={projectGoal}
                    onChange={handleProjectGoalChange}
                    required
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
                    className="border bg-secondary text-primary rounded"
                    name="projectTypeId"
                    onChange={handleProjectTypeIdChange}
                    value={projectTypeId}
                    required
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
                  value={projectName}
                  onChange={handleProjectNameChange}
                  required
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
                  value={projectDescription}
                  onChange={handleProjectDescriptionChange}
                  required
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
                  name=""
                  required={!pid}
                  // disabled
                />
                {selectedImage ? (
                  <img
                    src={
                      (selectedImage.preview as string) ||
                      (selectedImage as unknown as string)
                    }
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
                  value={projectPreDetail}
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: "link image lists table wordcount",
                    toolbar:
                      "undo redo | bold italic underline strikethrough | link image | align numlist bullist | removeformat",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                  onChange={(e) => {
                    setProjectPreDetail(e.target.value);
                    log();
                  }}
                />

                <p>
                  請告訴詳細介紹關於你計畫的故事、為什麼大家應該支持你的計畫。
                </p>
                <p>
                  請注意：Mumu必須要有足夠的訊息才有辦法審核計畫，如果您所提供的資訊過少，或Mumu無法評估計畫的真實性、可行性，計畫就會無法上架。
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
                  {pid ? "確定修改" : "確定提案"}
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
