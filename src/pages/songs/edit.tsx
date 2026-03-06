import { useQuery } from "@tanstack/react-query";
import BackButton from "@/components/BackNavigation";
import Skeleton from "@/components/Skeleton";
import SongEditForm, { type ISongEditInput } from "@/components/editsongs";
import { getSongDetails, type SongResponse } from "@/services/songService";
import { useParams } from "react-router-dom";


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
        <div className="flex items-center justify-center  bg-gray-100">

            <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Edit User</h1>

                    <BackButton />

                </div>
                {!song && <>No song found</>}

                {song && 
                
                <SongEditForm defaultValue={{...song} as ISongEditInput}/>
                }
            </div>
        </div>
    );
};

export default EditSong;