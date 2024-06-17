import {
  PostProfileEdit,
  PostProfileMain,
  PostProfileReview,
} from "@/components/postProfile";
import {
  useGetMemberById,
  useGetRecent3Posts,
} from "@/lib/react-query/queriesAndMutation";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserContext } from "@/context/AuthContext";

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { data: member } = useGetMemberById(id || "");
  const { data: post3 } = useGetRecent3Posts(id || "");

  return (
    <>
      <div className="flex flex-col flex-1 items-center overflow-scroll custom-scrollbar w-full">
        <Tabs defaultValue="main" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="main">主頁</TabsTrigger>
            <TabsTrigger value="review">瀏覽</TabsTrigger>
            {Number(user.id) === member?.memberId && (
              <TabsTrigger value="edit">編輯</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="main">
            <PostProfileMain member={member} post3={post3} />
          </TabsContent>
          <TabsContent value="review">
            <PostProfileReview />
          </TabsContent>
          <TabsContent value="edit">
            <PostProfileEdit />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Profile;
