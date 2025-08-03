import Navbar from "@/components/Navbar";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="border border-gray-300 p-2 w-full rounded"
                type="email"
                id="email"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="border border-gray-300 p-2 w-full rounded"
                type="password"
                id="password"
                required
              />
            </div>
            <button className="bg-blue-600 text-white py-2 px-4 rounded w-full">
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
