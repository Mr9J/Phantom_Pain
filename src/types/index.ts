import { LucideProps } from "lucide-react";
import react from "react";
import { string } from "zod";
import { MemberDTO } from "@/types/index";

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
  nickname: string;
  thumbnail: string;
};

export type PropsTestType = {
  test1: string;
  test2: string;
  testSet: React.Dispatch<React.SetStateAction<string>>;
};

export type INavLink = {
  icon: react.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  to: string;
  label: string;
};
export type Order = {
  orderId: number;
  projectId: number;
  member: {
    username: string;
    thumbnail: string;
  };
  orderDate: string;
  shipDate: string;
  donate: number;
  thumbnail: string;
  isEdit?: boolean;
  orderDetails: {
    projectName: string;
    thumbnail: string;
    count: number;
    price: number;
  };
};
export type OrderProject = {
  orderId: number;
  projectId: number;
  projectName: string;
  thumbnail: string;
  statusId: number;
  orderCount: number;
  sponsorCount: number;
  projectDescription: string;
  isEdit?: boolean;
};

export type OuterSignIn = {
  nickname: string;
  username: string;
  thumbnail: string;
  uid: string;
};

export type ProjectCardDTO = {
  projectId: number;
  projectName: string;
  projectGoal: number;
  startDate: string;
  endDate: string;
  dayLeft: number;
  thumbnail: string;
  totalAmount: number;
  sponsorCount: number;
};
export type ProjectDTO = {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectGoal: number;
  startDate: number;
  endDate: number;
  memberId: number;
  groupId: number;
  thumbnail: string;
  totalAmount: number;
  statusId: number;
  products: ProductDTO[];
};
export type filteredProjects = ProjectDTO;
export type ProjectCount = number[];
export type MemberCount = number[];
export type MemberDTO = {
  id: number;
  memberId: number;
  username: string;
  nickname: string;
  thumbnail: string;
  email: string;
  address: string;
  memberIntroduction: string;
  phone: number;
  registrationTime: string;
  statusId: number;
  groupDetail: { authStatusId: number };
};

export type PostDTO = {
  caption: string;
  file: File[];
  location: string;
  tags: string;
  userId: string;
  id: string;
};

export type UpdatePostDTO = {
  postId: string;
  caption: string;
  file: File[];
  location: string;
  tags: string;
  userId: string;
  id: string;
};

export type NewUpdatePostDTO = {
  caption: string;
  file: string;
  location: string;
  tags: string;
  userId: string;
  postId: number;
};

export type NewPostDTO = {
  caption: string;
  file: string;
  location: string;
  tags: string;
  userId: string;
};

export type GetPostDTO = {
  postId: string;
  userId: string;
  username: string;
  userImg: string;
  caption: string;
  imgUrl: string;
  location: string;
  tags: string;
  postTime: string;
  isAnonymous: string;
};

export type ICommentPost = {
  postId: string;
  userId: string;
  comment: string;
};
export type Like = {
  likePrjName: string;
  likePrjThumb: string;
  likePrjId: number;
  likeDetailId: number;
};

export type PostImageDTO = {
  file: File[];
  projectId: string;
  productId: string;
};

export type ProductDTO = {
  productId: number;
  productName: string;
  productDescription: string;
  statusId: number;
  productPrice: number;
  initialStock: number;
  currentStock: number;
  startDate: string;
  endDate: string;
  thumbnail: string;
};
