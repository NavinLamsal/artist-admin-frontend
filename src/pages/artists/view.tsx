import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import BackButton from "@/components/BackNavigation";
import SongForm from "@/pages/songs/songForm";
import { getArtistDetails, type ArtistResponse } from "@/services/artistService";
import DataTable from "@/components/Datatable";
import { Edit } from "lucide-react";
import Skeleton from "@/components/Skeleton";
import { useUserContext } from "@/context/UserContext";
import PagesLayout from "@/layouts/pagesLayout";

const ViewArtist: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useUserContext();

    const { data, isLoading, error } = useQuery<ArtistResponse>({
        queryKey: ["artist", id],
        queryFn: async () => {
            if (!id) throw new Error("Artist ID missing");
            return getArtistDetails(id);
        },
        enabled: !!id,
    });

    if (isLoading) return <div className="p-6">Loading artist...
        <Skeleton />
    </div>;
    if (error) return <div className="p-6">Failed to load artist</div>;

    const artist = data?.data.artist;

    if (!artist) {
        return <div className="p-6">Artist not found</div>
    }


    const columns = [
        { label: "S.N", data: "s_n" },
        { label: "Title", data: "title" },
        { label: "Album Name", data: "album_name" },
        { label: "Genre", data: "genre" },
        (user?.role === 'artist' && { label: "Actions", data: "actions" })
    ] as const;

    const songdata = artist.music.map((song, index) => ({
        s_n: index + 1,
        id: song.id,
        title: song.title,
        album_name: song.album_name,
        genre: song.genre,
        
        actions: (
            <div className="flex justify-center items-center space-x-4">
                {user?.role === 'artist' &&
                    <Link
                        to={`/songs/${song.id}/edit`}
                        className="text-green-600 hover:text-green-800"
                    >
                        <Edit size={16} />
                    </Link>
                }
            </div>
        ),
    }));


    return (
        <PagesLayout title="Artist Details" actions={<BackButton />}>
            {/* Artist Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    <Info label="Name" value={artist.name} />
                    <Info label="Gender" value={artist.gender} />
                    <Info label="Address" value={artist.address} />
                    <Info label="First Release Year" value={artist.first_release_year} />
                    <Info
                        label="Date of Birth"
                        value={
                            artist.dob
                                ? new Date(artist.dob).toLocaleDateString()
                                : "-"
                        }
                    />
                    <Info label="Albums Released" value={artist.no_of_albums_released} />
                    <Info label="Songs Released" value={artist.music_count} />

                </div>

                {/* Divider */}
                <div className="border-t pt-8">

                    {user?.role === "artist" && id && <SongForm artist_id={id} showheader={true}/>}

                    <DataTable
                        columns={columns}
                        data={songdata}
                        loading={isLoading}
                        pagination={{
                            page: 1,
                            pages: 1,
                            per_page: artist.music.length,
                            total: artist.music.length
                        }}
                        onFetch={() => console.log("fetch")}
                        showPagination={false}
                        showPerPage={false}
                        showSearch={false}
                    />

                </div>
        </PagesLayout>
        
    );
};

export default ViewArtist;

interface InfoProps {
    label: string;
    value?: string | number;
}

const Info: React.FC<InfoProps> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
);