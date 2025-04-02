import { useQuery } from "@tanstack/react-query";
import ScrapCreation from "../components/ScrapCreation";
const CreateScrap = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  return (
    <div className="px-4 py-6">
      <ScrapCreation user={authUser} />
    </div>
  )
}

export default CreateScrap
