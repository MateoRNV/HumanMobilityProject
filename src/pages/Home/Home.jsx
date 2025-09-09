import { Link } from "react-router";

export default function Home() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold">Bienvenido</h1>
      <p className="mt-2 text-gray-600">Aquí irán los formularios</p>
      <div className="mt-4 flex justify-center gap-2">
        <Link to="/triaje">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Triaje
          </button>
        </Link>
        {/* <Button></Button>
        <Button></Button> */}
      </div>
    </div>
  );
}
