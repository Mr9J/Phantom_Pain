export type ProjectInfoDto = {
  projectId: number;
  projectThumbnail: string;
  projectName: string;
  projectGoal: number;
  projectDescription: string;
  memberName: string;
  projectTotal: number;
  startDate: string;
  endDate: string;
  isLiked: boolean;
  products: typeProductCards;
  clicked: number;
  projectDetail: string;
  member: typeMember;
  sponsorCount: number;
};

export type typeProductCards = typeProduct[];

export type typeProduct = {
  productId: number;
  productName: string;
  productPrice: number;
  productDescription: string;
  productThumbnail: string;
  initialStock: number;
  currentStock: number;
  status: number;
};

export type typeComment = {
  commentId: number;
  commentMsg: string;
  date: string;
  sender: typeMember;
  liked: number;
  parentId: number;
};

export type typeCommentRequest = {
  commentMsg: string;
  projectId: number;
  parentId?: number;
};

export type typeCommentDto = {
  commentId?: number;
  date?: string;
  commentMsg: string;
  memberId?: number;
  projectId: number;
  member?: typeMember;
  liked: number;
  parentId: number;
};

export type typeMember = {
  memberId: number;
  username: string;
  thumbnail: string;
};
