import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "./schema";
import { registerUser } from "../socket";
import { useAppDispatch } from "../redux/hooks";
import { setUser } from "../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux/api/baseApi";
// import { loginSchema, LoginFormData } from "./schemas";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const onSubmit = async (data: LoginFormData) => {
    console.log("Login Data:", data);
    try {
      const result = await login(data);
      registerUser(result?.data?.user?._id);
      dispatch(
        setUser({
          user: result?.data?.data?.user,
          accessToken: result?.data?.data?.accessToken,
        })
      );
      console.log(result);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
    // Call API here
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email")}
            className="mt-1 w-full border rounded-lg p-2"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password")}
            className="mt-1 w-full border rounded-lg p-2"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
