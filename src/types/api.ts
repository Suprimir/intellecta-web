import Stripe from "stripe";

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
  last_name: string;
  username: string;
  email: string;
  password: string;
  role: "student" | "instructor" | "admin";
  profilePicture: string | null;
  lastLoggedIn: Date;
  verified: boolean;
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

export type Content = {
  id: number | undefined;
  unit_ID: number | undefined;
  course_ID: number | undefined;
  unit_Title: number | undefined;
  order_number: number | undefined;
  content_ID: number | undefined;
  title: string | undefined;
  description: string | undefined;
  media_Path: string | undefined;
  document_Path: string | undefined;
  isMarked: boolean;
};

export type UnitCourse = {
  id: number | undefined;
  unit_number: number | undefined;
  course_ID: number | undefined;
  title: string | undefined;
};

export type PurchasedCourses = {
  id: number | undefined;
  user_ID: string | undefined;
  course_ID: number | undefined;
  purchase_date: Date | undefined;
};

export type UnitWithContent = UnitCourse & {
  contents: Content[];
};

export type CourseWithUnitContent = Course & {
  units: UnitWithContent[];
};

export type Payments = {
  id: number;
  payment_intent: string;
  amount: number;
  currency: string;
  status: "succeded" | "pending" | "incomplete" | "expired" | "failed";
  user_ID: string;
  email: string;
};

export interface PaymentIntentResponse {
  success: boolean;
  data?: Stripe.PaymentIntent[];
  errors?: Array<{
    id: string;
    error: string;
  }>;
  message?: string;
}

export interface Stats {
  totalCourses: number;
  totalUsers: number;
  totalPayments: number;
  totalIncomes: number;
}

export interface ContentCompleted {
  content_ID: number;
  user_ID: string;
}

export interface Certificate {
  id: number;
  user_ID: string;
  course_ID: number;
  name: string;
}

export interface Profile extends User {
  certificates: Certificate[];
}
