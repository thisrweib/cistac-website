export interface User {
  userId: number;
  name: string;
  surname: string;
  eMail: string;
  phoneNumber?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export interface Hotel {
  hotelAmenities: string;
  hotelId: number;
  name: string;
  description: string;
  location: string;
  image: string;
  rooms: Room[];
  eMail: string;
  rating: number;
  phoneNumber?:string
}

export interface Room {
  roomId?: number;// Opsiyonel: Genellikle backend tarafından atanır
  hotelId: number;
  roomNumber: string;
  type: string;
  pricePerNight: number;
  availabilityStatus: string;// Opsiyonel: boş gönderilebilir, backend "Available" atar
  capacity: number;
  roomAmenities: string;
}


export interface Reservation {
  id: number;
  userId: number;
  roomId: number;
  checkIn: Date;
  checkOut: Date;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  totalPrice: number;
  specialRequests?: string;
  feedback?: Feedback;
  hotelId?: number
}

export interface Review {
  reviewId: number;
  userId: number;
  roomId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string | null;
  user?: User;
}

export interface BookingDetails {
  hotelId: number;
  roomId: number;
  userId: number;
  checkInDate: string;
  checkOutDate: string;
  // guests: number;
  room?: Room;
}

export interface Feedback {
  id: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: Date;
}



export interface StaffMember {
  id: number;
  name: string;
  surname: string;
  position: string;
  shift: string;
  hotelId?: number;
  phoneNumber: string;
  eMail: string;
}

export interface StaffSchedule {
  id: number;
  staffId: number;
  date: Date;
  shift: 'morning' | 'afternoon' | 'night';
  status: 'scheduled' | 'completed' | 'absent';
  notes?: string;
}