// room.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '@app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'https://localhost:44379/api/roomsapi';

  constructor(private http: HttpClient) {}

    //Tekli oda oluşturma
    createRoom(room: Room): Observable<Room> {
      return this.http.post<Room>(this.apiUrl, room);
    }

    //Çoklu oda oluşturma (bulk)
    createRoomsBulk(rooms: Room[]): Observable<any> {
      return this.http.post(`${this.apiUrl}/bulk`, rooms);
    }

    deleteRoom(roomId: number){
        return this.http.delete(`${this.apiUrl}/${roomId}`);
    }

    updateRoomsBulk(rooms: Room[]): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/bulk`, rooms);
    }

    getRoomById(roomId): Observable<any> {
      return this.http.get(`${this.apiUrl}/${roomId}`)
    }

  
}
