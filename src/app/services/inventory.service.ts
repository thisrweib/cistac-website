import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Inventory {
  inventoryID?: number;
  itemName: string;
  category: string;
  currentStock: number;
  hotelID: number;
  updatedAt:Date;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private baseUrl = 'https://localhost:44379/api/InventoryApi';

  constructor(private http: HttpClient) {}

  // GET: All inventory items
  getInventory(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.baseUrl);
  }

  // GET: Single inventory item by ID
  getInventoryById(id: number): Observable<Inventory> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Inventory>(url);
  }

  // POST: Add new inventory item
  addInventory(item: Partial<Inventory>): Observable<any> {
    return this.http.post(this.baseUrl, item);
  }

  // PUT: Update existing inventory item by ID
  updateInventory(item: Partial<Inventory>): Observable<any> {
    const url = `${this.baseUrl}/${item.inventoryID}`;
    return this.http.put(url, item);
  }
}
