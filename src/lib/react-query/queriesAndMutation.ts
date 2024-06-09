import { OuterSignIn, SignInDTO, SignUpDTO, PostDTO } from "@/types";
import {
  resetPassword,
  sendResetEmail,
  signIn,
  signInWithOthers,
  signUp,
} from "@/services/auth.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createPost, getRecentPosts } from "@/services/post.service";

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
