import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Datatable from "@/components/Datatable";
import { deleteArtist, listArtists } from "@/services/artistService";

import { toast } from "react-toastify";
import { useUserContext } from "@/context/UserContext";
import type { Artist } from "@/types/artist";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useConfirm } from "@/context/ConfirmContext";
import { Button } from "@/components/ui/button";
import CSVImportModal from "@/components/CSVUploader";
import api from "@/services/APIRequest";


const ArtistList: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any[]>([]);
    const { user } = useUserContext();
    const [pagination, setPagination] = useState({
        page: 1,
        pages: 1,
        per_page: 10,
        total: 0,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const confirm = useConfirm();


    const columns = [
        { label: "S.N", data: "s_n" },
        { label: "Name", data: "name" },
        { label: "Date of birth", data: "dob" },
        { label: "Gender", data: "gender" },
        { label: "Address", data: "address" },
        { label: "1st Year", data: "first_release_year" },
        { label: "Albums", data: "albums_released" },
        { label: "Actions", data: "actions" },
    ];



    const fetchData = useCallback(async (page = 1, per_page = 10, search = "") => {
        setLoading(true);

        try {
            const params = {
                page, per_page, ...(search && { search })

            }


            const res = await listArtists(params);
            const { artists, pagination: serverPagination } = res.data;

            setPagination(serverPagination);

            const formattedData = artists.map((artist: Artist, index: number) => ({
                s_n:
                    (serverPagination.page - 1) * serverPagination.per_page +
                    index +
                    1,
                id: artist.id,
                name: artist.name,
                dob: artist.dob && new Date(artist.dob).toLocaleDateString(),
                gender:
                    artist.gender === "m"
                        ? "Male"
                        : artist.gender === "f"
                            ? "Female"
                            : "Other",

                address: artist.address,
                first_release_year: artist.first_release_year,
                albums_released: artist.no_of_albums_released,
                actions: (
                    <div className="flex justify-center items-center space-x-4">
                        <Link
                            to={`/artists/${artist.id}`}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <Eye size={16} />
                        </Link>
                        {(user?.role === 'artist_manager') &&
                        <>
                        <Link
                            to={`/artists/${artist.id}/edit`}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <Edit size={16} />
                        </Link>
                         <button
                            onClick={() =>
                                confirm({
                                    title: "Delete Artist",
                                    message:
                                        "Are you sure you want to delete this Artist? This action cannot be undone.All the songs of this artist will also be removed",
                                    confirmText: "Delete",
                                    cancelText: "Cancel",
                                    onConfirm: async () => {
                                        await deleteArtist(artist.id);
                                        toast.success("Artist Deleted Successfully!");
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
                        </>
                        }

                        
                       
                    </div>
                ),
            }));

            setData(formattedData);
        } catch {
            toast.error("Failed Fetching Artist Data");
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [user?.role]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const handleExport = async () => {
       

        
            try {
                const blob = await api.get(`/artists/export`);
                
                if (blob.data) {
                    const url = window.URL.createObjectURL(new Blob([blob.data]));
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'artists.csv';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);

                 toast.success("Artist Exported Successfully!");
                }
            } catch (error) {
                console.error("Failed to export the artists:", error);
            }
        }
        
    

    return (

        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
            <div className="w-full max-w-6xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Artists List</h1>
                    <div className="flex gap-2">
                        {(user?.role === 'artist_manager') &&
                            <>
                                <Button
                                    variant={"destructive"}
                                    className=""
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Import CSV
                                </Button>

                               
                                <CSVImportModal
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    uploadUrl="/artists/import" 
                                />

                                
                                <Button onClick={handleExport} 
                                    variant={"secondary"}
                                className="">
                                    Export CSV
                                </Button>
                                
                                <Link to="/artists/create">
                                    <Button className="px-4 py-2">
                                        Add New Artist
                                    </Button>
                                </Link>
                            </>}
                    </div>
                </div>


                <div className="w-full p-4 space-y-6 bg-white rounded-lg shadow-md">
                    <Datatable
                        columns={columns}
                        data={data}
                        loading={loading}
                        pagination={pagination}
                        onFetch={fetchData}
                    />
                </div>
            </div>
        </div>
    );
};

export default ArtistList;