import AppRoutes from "./routes/AppRoutes";
import { Header } from "./components";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <Header />
      <div className="flex-1 pt-5">
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;
