/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Datatable from "@/components/Datatable";
import { listUsers, deleteUser } from "@/services/userService";
import { toast } from "react-toastify";
import { Edit, Plus, Trash2 } from "lucide-react";
import type { User } from "@/types/User";
import { useConfirm } from "@/context/ConfirmContext";
import { Button } from "@/components/ui/button";
import PagesLayout from "@/layouts/pagesLayout";

const UserList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    per_page: 1,
    total: 0,
  });

  const confirm = useConfirm(); 

  const columns = [
    { label: "S.N", data: "s_n" },
    { label: "Name", data: "name" },
    { label: "Email", data: "email" },
    { label: "Date of birth", data: "dob" },
    { label: "Gender", data: "gender" },
    { label: "Role", data: "role" },
    { label: "Address", data: "address" },
    { label: "Actions", data: "actions" },
  ];

  const fetchData = useCallback(
    async (page = 1, per_page = 1, search = "") => {
      setLoading(true);
      try {
        const params = {
          page,
          per_page,
          ...(search && { search }),
        };

        const res = await listUsers(params);
    
        const { users, pagination: serverPagination } = res.data;

        setPagination(serverPagination);

        const formattedData = users.map((user: User, index: number) => ({
          s_n:
            (serverPagination.page - 1) * serverPagination.per_page +
            index +
            1,
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          dob: new Date(user.dob).toLocaleDateString(),
          gender:
            user.gender === "m"
              ? "Male"
              : user.gender === "f"
              ? "Female"
              : "Other",
          role:
            user.role === "super_admin"
              ? "Super Admin"
              : user.role === "artist_manager"
              ? "Artist Manager"
              : user.role,
          address: user.address,
          actions: (
            <div className="flex justify-center items-center space-x-4">
              <Link
                to={`/users/${user.id}/edit`}
                className="text-green-600 hover:text-green-800"
              >
                <Edit size={16} />
              </Link>

              
              <button
                onClick={() =>
                  confirm({
                    title: "Delete User",
                    message:
                      "Are you sure you want to delete this user? This action cannot be undone.",
                    confirmText: "Delete",
                    cancelText: "Cancel",
                    onConfirm: async () => {
                      await deleteUser(user.id);
                      toast.success("User Deleted Successfully!");
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
        toast.error("Failed Fetching User Data");
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [confirm, pagination.page, pagination.per_page]
  );

  useEffect(() => {
    fetchData(1, pagination.per_page, "");
  }, []);

  return (
    <PagesLayout
      title="Users List"
      actions={
        <Link to="/users/create">
          <Button>Add New</Button>
        </Link>
      }
    >
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

export default UserList;