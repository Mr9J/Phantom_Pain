import {
  OuterSignIn,
  SignInDTO,
  SignUpDTO,
  PostDTO,
  UpdatePostDTO,
} from "@/types";
import {
  resetPassword,
  sendResetEmail,
  signIn,
  signInWithOthers,
  signUp,
} from "@/services/auth.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createPost,
  getPostById,
  getRecentPosts,
  likePost,
  savePost,
  updatePost,
} from "@/services/post.service";
import { PostFormProps } from "@/components/forms/PostForm";

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

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [],
    queryFn: getRecentPosts,
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
    queryKey: [postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useUpdatePost = () => {
  return useMutation({
    mutationFn: (post: UpdatePostDTO) => updatePost(post),
  });
};
