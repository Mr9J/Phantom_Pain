import {
  PostProfileEdit,
  PostProfileEditP,
  PostProfileMain,
  PostProfileReview,
} from "@/components/postProfile";
import { useGetUserInfo } from "@/lib/react-query/queriesAndMutation";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserContext } from "@/context/AuthContext";

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { data: member, isPending } = useGetUserInfo(id || "");

  return (
    <>
      <div className="flex flex-col flex-1 items-center overflow-scroll custom-scrollbar w-full">
        <Tabs defaultValue="main" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="main">主頁</TabsTrigger>
            <TabsTrigger value="review">瀏覽</TabsTrigger>
            {user.id === id && <TabsTrigger value="edit">編輯</TabsTrigger>}
          </TabsList>
          <TabsContent value="main">
            <PostProfileMain member={member} isLoading={isPending} />
          </TabsContent>
          <TabsContent value="review">
            <PostProfileReview id={id} />
          </TabsContent>
          <TabsContent value="edit">
            {member?.authenticationProvider === "N" ? (
              <PostProfileEdit id={user.id} />
            ) : (
              <PostProfileEditP id={user.id} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Profile;
