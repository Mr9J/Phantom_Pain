export type SignUpProps = {
  nickname: string;
  username: string;
  email: string;
  password: string;
};

export type SignInProps = {
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
