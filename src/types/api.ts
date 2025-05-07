export type User = {
  user_ID: string;
  username: string;
  email: string;
  password: string;
  role: "student" | "instructor" | "admin";
  profilePicture: string | null;
};
