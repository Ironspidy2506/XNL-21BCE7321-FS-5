import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="w-full p-4 bg-gray-800 text-white flex justify-between">
      <h1 className="text-xl font-bold">VideoApp</h1>
      <div>
        <Link href="/" className="mr-4">
          Home
        </Link>
        <Link href="/record" className="bg-blue-500 px-4 py-2 rounded">
          Record
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
