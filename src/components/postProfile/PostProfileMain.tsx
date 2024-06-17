import { useGetPostImg } from "@/lib/react-query/queriesAndMutation";
import GridPostList from "@/views/auth/pages/GridPostList";
import moment from "moment";
import ProfileGridPosts from "./ProfileGridPosts";

type PostProfileProps = {
  member?: {
    memberId: number;
    username: string;
    nickname: string;
    thumbnail: string;
    email: string;
    address: string;
    memberIntroduction: string;
    phone: string;
    statusId: number | null;
    registrationTime: string;
  };
  post3?: {
    postId: string;
    userId: string;
    username: string;
    userImg: string;
    caption: string;
    imgUrl: string;
    location: string;
    tags: string;
    postTime: string;
    isAnonymous: string;
  }[];
};

const PostProfileMain = ({ member, post3 }: PostProfileProps) => {
  return (
    <>
      <section className="body-font w-full">
        <div className="container px-5 py-24 mx-auto flex flex-wrap">
          <div className="flex flex-wrap -mx-4 mt-auto mb-auto lg:w-1/2 sm:w-2/3 content-start sm:pr-10">
            <div className="w-full sm:p-4 px-4 mb-6">
              <h1 className="title-font font-medium text-3xl mb-2">
                {member?.nickname}
              </h1>
              <div className="leading-relaxed text-xl">
                {member?.memberIntroduction}
              </div>
            </div>
            <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
              <h2 className="title-font font-medium text-3xl line-clamp-1">
                {moment.utc(member?.registrationTime).fromNow()}
              </h2>
              <p className="leading-relaxed">加入時間</p>
            </div>
            <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
              <h2 className="title-font font-medium text-3xl">1.8K</h2>
              <p className="leading-relaxed">Subscribes</p>
            </div>
            <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
              <h2 className="title-font font-medium text-3xl">35</h2>
              <p className="leading-relaxed">Downloads</p>
            </div>
            <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
              <h2 className="title-font font-medium text-3xl">4</h2>
              <p className="leading-relaxed">Products</p>
            </div>
          </div>
          <div className="lg:w-1/2 sm:w-1/3 w-full rounded-lg overflow-hidden mt-6 sm:mt-0">
            <img
              className="object-cover object-center w-full h-full"
              src={member?.thumbnail || "https://dummyimage.com/600x300"}
              alt="stats"
            />
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <header className="text-center">
            <h2 className="text-xl font-bold sm:text-3xl">近期貼文</h2>
          </header>

          <ul className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {post3?.map((post, index) => (
              <li key={post.postId} className="relative min-w-80 h-80">
                <ProfileGridPosts
                  key={index}
                  post={post}
                  userImg={member?.thumbnail || ""}
                />
              </li>
            ))}
            {/* {post3?.length > 0 && (
              <li>
                <a href="#" className="group relative block">
                  <img
                    src="https://images.unsplash.com/photo-1618898909019-010e4e234c55?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                    alt=""
                    className="aspect-square w-full object-cover transition duration-500 group-hover:opacity-90"
                  />

                  <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                    <h3 className="text-xl font-medium text-white">
                      Casual Trainers
                    </h3>

                    <span className="mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white">
                      Shop Now
                    </span>
                  </div>
                </a>
              </li>
            )}

            {post3?.length > 1 && (
              <li>
                <a href="#" className="group relative block">
                  <img
                    src="https://images.unsplash.com/photo-1624623278313-a930126a11c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                    alt=""
                    className="aspect-square w-full object-cover transition duration-500 group-hover:opacity-90"
                  />

                  <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                    <h3 className="text-xl font-medium text-white">
                      Winter Jumpers
                    </h3>

                    <span className="mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white">
                      Shop Now
                    </span>
                  </div>
                </a>
              </li>
            )}

            {post3?.length > 2 && (
              <li className="lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
                <a href="#" className="group relative block">
                  <img
                    src="https://images.unsplash.com/photo-1593795899768-947c4929449d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2672&q=80"
                    alt=""
                    className="aspect-square w-full object-cover transition duration-500 group-hover:opacity-90"
                  />

                  <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                    <h3 className="text-xl font-medium text-white">
                      Skinny Jeans Blue
                    </h3>

                    <span className="mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white">
                      Shop Now
                    </span>
                  </div>
                </a>
              </li>
            )} */}
          </ul>
        </div>
      </section>
    </>
  );
};

export default PostProfileMain;
