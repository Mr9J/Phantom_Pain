export type typeProductCards = typeProduct[];

export type typeProduct = {
  productId: number;
  productName: string;
  productPrice: number;
  productDescription: string;
  productThumbnail: string;
  initialStock: number;
  currentStock: number;
};

export type typeComment = {
  commentId: number;
  commentMsg: string;
  date: string;
  sender: typeMember;
};

export type typeCommentDto = {
  commentId?: number;
  date?: string;
  commentMsg: string;
  memberId: number;
  projectId: number;
  member: typeMember;
};

export type typeMember = {
  username: string;
  thumbnail: string;
};
