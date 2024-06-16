import {
  OuterSignIn,
  SignInDTO,
  SignUpDTO,
  PostDTO,
  UpdatePostDTO,
  ICommentPost,
} from "@/types";
import {
  changeEmail,
  checkAdmin,
  resendEmail,
  resetPassword,
  sendResetEmail,
  signIn,
  signInWithOthers,
  signUp,
} from "@/services/auth.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  commentPost,
  createPost,
  deletePost,
  getCommentsPost,
  getPostById,
  getPostImg,
  getRecentPosts,
  getSavedPosts,
  likePost,
  savePost,
  updatePost,
} from "@/services/post.service";
import { getUserInfo } from "@/services/members.service";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (x: SignUpDTO) => signUp(x),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (x: SignInDTO) => signIn(x),
  });
};

export const useCreatePost = () => {
  return useMutation({
    mutationFn: (x: PostDTO) => createPost(x),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ password, jwt }: { password: string; jwt: string }) =>
      resetPassword(password, jwt),
  });
};

export const useSendResetEmail = () => {
  return useMutation({
    mutationFn: (x: string) => sendResetEmail(x),
  });
};

export const useSignInWithOthers = () => {
  return useMutation({
    mutationFn: (x: OuterSignIn) => signInWithOthers(x),
  });
};

export const useGetRecentPosts = (page: number) => {
  return useQuery({
    queryKey: ["recentPosts", page],
    queryFn: () => getRecentPosts(page),
  });
};

export const useLikePost = () => {
  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      likePost(postId, userId),
  });
};

export const useSavePost = () => {
  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savePost(postId, userId),
  });
};

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: ["GetPostById", postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useUpdatePost = () => {
  return useMutation({
    mutationFn: (post: UpdatePostDTO) => updatePost(post),
  });
};

export const useDeletePost = () => {
  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
  });
};

export const useCommentPost = () => {
  return useMutation({
    mutationFn: (x: ICommentPost) => commentPost(x),
  });
};

export const useGetCommentPost = (postId: string) => {
  return useQuery({
    queryKey: [postId],
    queryFn: () => getCommentsPost(postId),
    enabled: !!postId,
  });
};

export const useGetSavedPosts = (page: number) => {
  return useQuery({
    queryKey: ["savedPosts", page],
    queryFn: () => getSavedPosts(page),
  });
};

export const useChangeEmail = () => {
  return useMutation({
    mutationFn: (email: string) => changeEmail(email),
  });
};

export const useResendEmail = () => {
  return useMutation({
    mutationFn: () => resendEmail(),
  });
};

export const useCheckAdmin = () => {
  return useMutation({
    mutationFn: () => checkAdmin(),
  });
};

export const useGetUserInfo = (id: string) => {
  return useQuery({
    queryKey: ["userInfo", id],
    queryFn: () => getUserInfo(id),
  });
};

export const useGetPostImg = (imgUrl: string) => {
  return useQuery({
    queryKey: ["postPhoto", imgUrl],
    queryFn: () => getPostImg(imgUrl),
  });
};
