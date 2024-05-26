import { SignInProps } from "./../../types/index";
import { INewUser } from "@/types";
import { signIn, signUp } from "@/services/auth.service";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

export const useCreateUserAccountMutation = () => {
  return useMutation({
    mutationFn: (x: INewUser) => signUp(x),
  });
};

export const useSignInAccountMutation = () => {
  return useMutation({
    mutationFn: (x: SignInProps) => signIn(x),
  });
};
