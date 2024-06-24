import moment from "moment";
import { UserProfile } from "@/types";
import avatar from "@/assets/admin_img/mygo/6.jpg";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

type PostProfileProps = {
  member?: UserProfile;
  isLoading: boolean;
};

const PostProfileMain = ({ member, isLoading }: PostProfileProps) => {
  return (
    <>
      <section className="body-font w-full">
        <div className="container px-5 py-24 mx-auto flex flex-wrap">
          <div className="flex flex-wrap -mx-4 mt-auto mb-auto lg:w-1/2 sm:w-2/3 content-start sm:pr-10">
            <div className="w-full sm:p-4 px-4 mb-6">
              <h1 className="title-font font-medium text-3xl mb-2 overflow-x-scroll overflow-y-hidden custom-scrollbar">
                {member?.nickname || "這裡沒有人"}
              </h1>
              <div className="leading-relaxed text-xl">
                {member?.description || "無話可說"}
              </div>
            </div>
            <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
              <h2 className="title-font font-medium text-3xl line-clamp-1">
                {moment.utc(member?.time).fromNow() || "這裡沒有人"}
              </h2>
              <p className="leading-relaxed">加入時間</p>
            </div>
            <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
              <h2 className="title-font font-medium text-3xl">
                {member?.projects?.length || "0"}
              </h2>
              <p className="leading-relaxed">發布企劃</p>
            </div>
            <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
              <h2 className="title-font font-medium text-3xl">
                {member?.postCount || "0"}
              </h2>
              <p className="leading-relaxed">發布貼文</p>
            </div>
            <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
              <h2 className="title-font font-medium text-3xl">
                {member?.followCount || "0"}
              </h2>
              <p className="leading-relaxed">追隨數</p>
            </div>
          </div>
          <div className="lg:w-1/2 sm:w-1/3 w-full rounded-lg overflow-hidden mt-6 sm:mt-0">
            <img
              className="object-cover object-center w-full h-full"
              src={member?.avatar || avatar}
              alt="stats"
            />
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <header className="text-center">
            <h2 className="text-xl font-bold sm:text-3xl">近期募資專案</h2>
          </header>

          <ul className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {member?.projects[2] && (
              <li>
                <Link
                  to={`/project/${member?.projects[2].projectId}`}
                  className="group relative block"
                >
                  <img
                    src={`${member?.projects[2]?.projectThumbnail}`}
                    alt=""
                    className="aspect-square w-full object-cover transition duration-500 group-hover:opacity-90"
                  />

                  <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                    <h3 className="text-xl font-medium text-white line-clamp-2 bg-slate-600/50 px-3 rounded-lg">
                      {member?.projects[2]?.projectName}
                    </h3>

                    <Button
                      variant="ghost"
                      className="mt-1.5 inline-block bg-slate-600 px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
                    >
                      贊助
                    </Button>
                  </div>
                </Link>
              </li>
            )}

            {member?.projects[1] && (
              <li>
                <Link
                  to={`/project/${member?.projects[1].projectId}`}
                  className="group relative block"
                >
                  <img
                    src={`${member?.projects[1]?.projectThumbnail}`}
                    alt=""
                    className="aspect-square w-full object-cover transition duration-500 group-hover:opacity-90"
                  />

                  <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                    <h3 className="text-xl font-medium text-white line-clamp-2 bg-slate-600/50 px-3 rounded-lg">
                      {member?.projects[1]?.projectName}
                    </h3>

                    <Button
                      variant="ghost"
                      className="mt-1.5 inline-block bg-slate-600 px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
                    >
                      贊助
                    </Button>
                  </div>
                </Link>
              </li>
            )}

            {member?.projects[0] && (
              <li className="lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
                <Link
                  to={`/project/${member?.projects[0].projectId}`}
                  className="group relative block"
                >
                  <img
                    src={`${member?.projects[0]?.projectThumbnail}`}
                    alt=""
                    className="aspect-square w-full object-cover transition duration-500 group-hover:opacity-90"
                  />

                  <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                    <h3 className="text-xl font-medium text-white line-clamp-2 bg-slate-600/50 px-3 rounded-lg">
                      {member?.projects[0]?.projectName}
                    </h3>

                    <Button
                      variant="ghost"
                      className="mt-1.5 inline-block bg-slate-600 px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
                    >
                      贊助
                    </Button>
                  </div>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </section>
    </>
  );
};

export default PostProfileMain;
