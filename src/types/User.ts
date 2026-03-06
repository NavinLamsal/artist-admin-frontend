export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'm' | 'f' | 'o';
  role: 'super_admin' | 'artist_manager' | 'artist';
  address: string;
  created_at?: string;
  updated_at?: string;
}
