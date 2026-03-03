export interface Post {
  id: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  hasReacted: boolean;
  hasCommented: boolean;
  commentCount: number;
  isSpam: boolean;
  isValid: boolean;
}

export interface Prize {
  id: string;
  name: string;
  quantity: number;
  winners: User[];
}
