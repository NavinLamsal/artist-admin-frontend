import BackButton from "@/components/BackNavigation";
import SongForm from "./songForm";
import { useParams } from "react-router-dom";
import { useUserContext } from "@/context/UserContext";
import { useQuery } from "@tanstack/react-query";
import { getArtistDetailsByUserId } from "@/services/artistService";
import Skeleton from "@/components/Skeleton";
import PagesLayout from "@/layouts/pagesLayout";



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
        <PagesLayout title="Create Song" actions={<BackButton />} >
        
            
            {data?.data.artist.id && 
            <SongForm artist_id={`${data?.data.artist.id}`} />}
        
        </PagesLayout>
    );
};

export default CreateSong;