import { useQuery } from "@tanstack/react-query";
import BackButton from "@/components/BackNavigation";
import Skeleton from "@/components/Skeleton";
import SongEditForm, { type ISongEditInput } from "@/components/editsongs";
import { getSongDetails, type SongResponse } from "@/services/songService";
import { useParams } from "react-router-dom";
import PagesLayout from "@/layouts/pagesLayout";


const EditSong: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const {
        data: songData,
        isLoading,
        error,
    } = useQuery<SongResponse, Error>({
        queryKey: ["song", id],
        queryFn: async () => {
            if (!id) throw new Error("No ID provided");
            return getSongDetails(Number(id));
        },
        enabled: !!id,
    });





    if (isLoading) return <div><Skeleton /></div>;
    if (error) return <div>Error loading user details.</div>;
    const song = songData?.data.song


    return (
        <PagesLayout title="Edit Song" actions={<BackButton />}>
            {!song && <>No song found</>}
            {song &&
                <SongEditForm defaultValue={{ ...song } as ISongEditInput} />
            }
        </PagesLayout>

    );
};

export default EditSong;