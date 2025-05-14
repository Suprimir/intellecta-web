export interface RequestBody {
  insertId: number;
  affectedRows: number;
}

export type User = {
  uuid: string;
  username: string;
  email: string;
  password: string;
  role: "student" | "instructor" | "admin";
  profilePicture: string | null;
};

export type Categories = {
  category_ID: number;
  category_Description: string;
};

export type Course = {
  id: number;
  name: string;
  description: string;
  image: string;
  date: Date;
  duration: number;
  uuid: string;
  category_ID: number;
  isInCart: boolean;
};

export type ShoppingCart = {
  id: number;
  uuid: string;
};

export type ShoppingCartDetails = {
  id: number;
  shoppingCart_ID: number;
  course_ID: number;
};
