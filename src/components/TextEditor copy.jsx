import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // icon import

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
       
          navigate(-1);
       
      }}
      className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-black text-white font-medium rounded-lg"
    >
      <ArrowLeft className="w-4 h-4" />
    </button>
  );
};

export default BackButton;
