import { LucideProps } from "lucide-react";
import react from "react";

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
  isEdit?: boolean;
};

export type OuterSignIn = {
  nickname: string;
  username: string;
  thumbnail: string;
  uid: string;
};

export type ProjectCardDTO={
  projectId:number;
  projectName:string;
  projectGoal:number;
  dayLeft:number;
  thumbnail:string;
  totalAmount:number;
  sponsorCount:number;
}

