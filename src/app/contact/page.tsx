export default function ContactPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="border border-gray-300 p-2 w-full rounded"
              type="text"
              id="name"
              required
            />
          </div>
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
            <label className="block text-sm font-medium mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              className="border border-gray-300 p-2 w-full rounded"
              id="message"
              rows={4}
              required
            ></textarea>
          </div>
          <button className="bg-blue-600 text-white py-2 px-4 rounded w-full">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
