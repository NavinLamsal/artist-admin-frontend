import { lazy, type FC } from "react";

import { Gauge, List, ListMusic, Music, User } from 'lucide-react';
import EditArtist from "@/pages/artists/edit";

const Dashboard = lazy(() => import('@/pages/Home'));
const Unauthorized = lazy(() => import('@/pages/Unauthorized'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const UserList = lazy(() => import('@/pages/users/list'));
const CreateUser = lazy(() => import('@/pages/users/create'));
const EditUser = lazy(() => import('@/pages/users/edit'));

const ArtistList = lazy(() => import('@/pages/artists/list'));
const CreateArtist = lazy(() => import('@/pages/artists/create'));
const ViewArtist = lazy(() => import('@/pages/artists/view'));

const SongsList = lazy(() => import('@/pages/songs/list'));
const CreateSong = lazy(() => import('@/pages/songs/Create'));
const EditSong = lazy(() => import('@/pages/songs/edit'));


type UserRole = 'super_admin' | 'artist_manager' | 'artist';

interface RouteConfig {
    path: string;
    name?: string;
    component: React.FC;
    roles: UserRole[];
    icon?: FC<{ className?: string }>;
}



export const routes: RouteConfig[] = [
  // Dashboard
  {
    path: '/dashboard',
    component: Dashboard,
    roles: ['super_admin', 'artist_manager', 'artist'],
    name: 'Dashboard',
    icon: Gauge,
  },

  // Users
  {
    path: '/users',
    component: UserList,
    roles: ['super_admin'],
    name: 'Users',
    icon: User,
  },
  {
    path: '/users/create',
    component: CreateUser,
    roles: ['super_admin'],
  },
  {
    path: '/users/:id/edit',
    component: EditUser,
    roles: ['super_admin'],
  },

  // Artists
  {
    path: '/artists',
    component: ArtistList,
    roles: ['super_admin', 'artist_manager'],
    name: 'Artists',
    icon: List,
  },
  {
    path: '/artists/create',
    component: CreateArtist,
    roles: ['super_admin', 'artist_manager'],
  },
  {
    path: '/artists/:id',
    component: ViewArtist,
    roles: ['super_admin', 'artist_manager'],
  },
  {
    path: '/artists/:id/edit',
    component: EditArtist,
    roles: ['super_admin', 'artist_manager'],
  },

  // Songs
  {
    path: '/songs',
    component: SongsList,
    roles: [ 'artist'],
    name: 'Songs',
    icon: ListMusic,
  },
  {
    path: '/songs/create',
    component: CreateSong,
    roles: ['artist'],
  },
  {
    path: '/songs/:id/edit',
    component: EditSong,
    roles: ['super_admin', 'artist_manager', 'artist'],
  },

  // Errors / Unauthorized
  {
    path: '/unauthorized',
    component: Unauthorized,
    roles: ['super_admin', 'artist_manager', 'artist'],
  },
  {
    path: '*',
    component: NotFound,
    roles: ['super_admin', 'artist_manager', 'artist'],
  },
];



