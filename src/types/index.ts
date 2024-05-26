export type SignUpDTO = {
  nickname: string;
  username: string;
  email: string;
  password: string;
};

export type SignInDTO = {
  username: string;
  password: string;
};

export type ProjectPhotoProps = {
  id: number;
  photographer: string;
  photographer_id: number;
  photographer_url: string;
  imgSrc: string;
};

export type CurrentUserDTO = {
  id: string;
  username: string;
  email: string;
};
