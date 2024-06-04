import { SignInDTO, SignUpDTO } from "@/types";
import { resetPassword, signIn, signUp } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";

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

// export const useCreatePost = () => {
//   return useMutation({
//     mutationFn: (x: PostDTO) => createPost(x),
//   });
// };

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ password, jwt }: { password: string; jwt: string }) =>
      resetPassword(password, jwt),
  });
};
