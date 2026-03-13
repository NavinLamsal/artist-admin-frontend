import React, { useCallback, useEffect, useState } from "react";
import Datatable from "@/components/Datatable";

import { toast } from "react-toastify";
import { useUserContext } from "@/context/UserContext";
import type { Music } from "@/types/artist";
import { Edit, Trash2 } from "lucide-react";
import { useConfirm } from "@/context/ConfirmContext";
import { deleteSong, listSongs } from "@/services/songService";
import { Link } from "react-router-dom";
import PagesLayout from "@/layouts/pagesLayout";
import { Button } from "@/components/ui/button";

const SongsList: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any[]>([]);
    const { user } = useUserContext();
    const [pagination, setPagination] = useState({
        page: 1,
        pages: 1,
        per_page: 10,
        total: 0,
    });


    const confirm = useConfirm();

    const columns = [
        { label: "S.N", data: "s_n" },
        { label: "Title", data: "title" },
        { label: "Album Name", data: "album_name" },
        { label: "Genre", data: "genre" },
        { label: "Actions", data: "actions" },
    ];

    const fetchData = useCallback(
        async (page = 1, per_page = 10, search = "") => {
            setLoading(true);
            try {
                const params = { page, per_page, ...(search && { search }) };
                const res = await listSongs(params);
                const { songs, pagination: serverPagination } = res.data;
                setPagination(serverPagination);

                const formattedData = songs.map((song: Music, index: number) => ({
                    s_n:
                        (serverPagination.page - 1) * serverPagination.per_page +
                        index +
                        1,
                    id: song.id,
                    title: song.title,
                    album_name: song.album_name,
                    genre: song.genre,
                    actions: (
                        <div className="flex justify-center items-center space-x-4">
                            <Link
                                to={"/songs/" + song.id + "/edit"}
                                className="text-green-600 hover:text-green-800"
                            >
                                <Edit size={16} />
                            </Link>

                            <button
                                onClick={() =>
                                    confirm({
                                        title: "Delete Song",
                                        message:
                                            "Are you sure you want to delete this song? This action cannot be undone.",
                                        confirmText: "Delete",
                                        cancelText: "Cancel",
                                        onConfirm: async () => {
                                            await deleteSong(song.id);
                                            toast.success("Song Deleted Successfully!");
                                            await fetchData(
                                                pagination.page,
                                                pagination.per_page
                                            );
                                        },
                                    })
                                }
                                className="text-red-600 hover:text-red-800"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ),
                }));

                setData(formattedData);
            } catch {
                toast.error("Failed Fetching Song Data");
                setData([]);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <PagesLayout title="Songs List" actions={<>{user?.role === "artist" && (
            <Link to="/songs/create">
                <Button>Add New</Button>
            </Link>

        )}</>} >
            <Datatable
                columns={columns}
                data={data}
                loading={loading}
                pagination={pagination}
                onFetch={fetchData}
            />

        </PagesLayout>
    );
};

export default SongsList;