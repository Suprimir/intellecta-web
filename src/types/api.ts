export interface RequestBody {
  insertId: number;
  affectedRows: number;
}

export interface ResponseBody {
  message: string | undefined;
  error: string | undefined;
  status: number | undefined;
}

export type User = {
  uuid: string;
  name: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  role: "student" | "instructor" | "admin";
  profilePicture: string | null;
  lastLoggedIn: Date;
};

export type Category = {
  id: number;
  description: string;
};

export type Course = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  date: Date;
  duration: number;
  rating: number;
  instructor_ID: string;
  instructor: string;
  category_ID: number;
  category_name: string;
  location: string;
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

export type Order = {
  id: number | undefined;
  uuid: string | undefined;
  status: string | undefined;
  created_date: Date | undefined;
};

export type OrderDetails = {
  id: number | undefined;
  order_ID: number | undefined;
  course_ID: number | undefined;
};

export type PurchasedCourses = {
  id: number | undefined;
  user_ID: string | undefined;
  course_ID: number | undefined;
  purchase_date: Date | undefined;
};
