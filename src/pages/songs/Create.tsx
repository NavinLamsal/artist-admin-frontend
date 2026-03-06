import BackButton from "@/components/BackNavigation";
import SongForm from "./songForm";
import { useParams } from "react-router-dom";
import { useUserContext } from "@/context/UserContext";
import { useQuery } from "@tanstack/react-query";
import { getArtistDetailsByUserId } from "@/services/artistService";
import Skeleton from "@/components/Skeleton";



const CreateSong: React.FC = () => {

    const { user } = useUserContext();

    const { data, isLoading, error } = useQuery({
        queryKey: ["artist_id", user?.id],
        queryFn: async () => {
            if (!user?.id) throw new Error("Artist ID missing");
            return getArtistDetailsByUserId(user.id);
        },
        enabled: !!user?.id,
    });

    if (isLoading) return <div className="p-6">Loading artist...
        <Skeleton />
    </div>;
    if (error) return <div className="p-6">Failed to load artist</div>;

    return (
        <div className="flex flex-col items-center  bg-gray-100">
            <div className="flex justify-between items-center w-full">
                <h1 className="text-3xl font-bold text-gray-800">Songs create</h1>
                <BackButton />
            </div>
            <div className="flex justify-between items-center mb-6">
            </div>
            {data?.data.artist.id && 
            <SongForm artist_id={`${data?.data.artist.id}`} />}
        </div>
    );
};

export default CreateSong;