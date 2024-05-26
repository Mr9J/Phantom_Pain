import { SignInDTO, SignUpDTO } from "@/types";
import { signIn, signUp } from "@/services/auth.service";
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
