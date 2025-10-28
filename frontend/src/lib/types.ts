export interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export interface Club {
  id: number;
  name: string;
  description: string;
  image?: string;
  facebookUrl?: string;
  memberCount: number;
  eventCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  clubId: number;
  clubName: string;
  startDate: string;
  endDate: string;
  location: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: number;
  userId: number;
  clubId: number;
  role: string;
  joinedAt: string;
  user?: User;
  club?: Club;
}