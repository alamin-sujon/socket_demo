import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-3xl font-medium">This is Home page</h1>
      <Link
        className="bg-red-600 block mt-4 text-white py-2 px-5 rounded-sm"
        to={"/chat"}
      >
        Chat
      </Link>
    </div>
  );
}
