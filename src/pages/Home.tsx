import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { Music, User } from "lucide-react";
import api from "@/services/APIRequest";
import Skeleton from "@/components/Skeleton";
import { handleError } from "@/services/userService";
import PagesLayout from "@/layouts/pagesLayout";


export  function StatCard({ title, value, icon, color = "bg-indigo-500" }: { title: string, value: number, icon: React.ReactNode, color?: string }) {
  return (
    <div className={`flex items-center p-4 rounded-lg shadow-md ${color} text-white`}>
      {/* Icon */}
      <div className="p-3 rounded-full bg-white/20 mr-4 flex-shrink-0">
        {icon}
      </div>

      {/* Text */}
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useUserContext();
  const role = user?.role;

type StatsType = {
  total_users: number;
  total_artist_managers: number;
  total_artists: number;
  total_songs: number;
  total_rnb_songs: number;
  total_country_songs: number;
  total_classic_songs: number;
  total_rock_songs: number;
  total_jazz_songs: number;
};

const [stats, setStats] = useState<StatsType>({
  total_users: 0,
  total_artist_managers: 0,
  total_artists: 0,
  total_songs: 0,
  total_rnb_songs: 0,
  total_country_songs: 0,
  total_classic_songs: 0,
  total_rock_songs: 0,
  total_jazz_songs: 0
});

 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard");
        const data = res.data;
        setStats(data.data.stats);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Skeleton/>;

  return (
    <PagesLayout title={`Welcome, ${user?.first_name} ${user?.last_name}!`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {role === "super_admin" && stats && (
          <>
          <StatCard title="Total Users" value={stats.total_users} icon={<User size={24} />} color="bg-indigo-500" />
            <StatCard title="Total Artists" value={stats.total_artists} icon={<User size={24} />} color="bg-indigo-500" />
            <StatCard title="Total Managers" value={stats.total_artist_managers} icon={<User size={24} />} color="bg-green-500" />
            <StatCard title="Total Songs" value={stats.total_songs} icon={<Music size={24} />} color="bg-yellow-500" />
          </>
        )}

        {role === "artist_manager" && stats && (
          <>
            <StatCard title="Total Artists" value={stats.total_artists} icon={<User size={24} />} color="bg-purple-500" />
            <StatCard title="Total Songs" value={stats.total_songs} icon={<Music size={24} />} color="bg-red-500" />
          </>
        )}

        {role === "artist" && stats && (
          <>
            <StatCard title="My Songs" value={stats.total_songs} icon={<Music size={24} />} color="bg-blue-500" />

            {["rnb", "country", "classic", "rock", "jazz"].map((genre) => (
              <StatCard
                key={genre}
                title={`${genre.toUpperCase()} Songs`}
                value={stats[`total_${genre}_songs`] || 0}
                icon={<Music size={24} />}
                color="bg-teal-500"
              />
            ))}
          </>
        )}
      </div>
    </PagesLayout>
  );
}