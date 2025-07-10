import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inventory, InventoryService } from '../../services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { HotelService } from '@app/services/hotel.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-inventory-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">{{ 'inventoryManagement.title' | transloco }}</h2>
        <div class="flex items-center gap-4">
          <label class="text-sm font-medium text-gray-700">{{ 'inventoryManagement.filterByHotel' | transloco }}</label>
          <select [(ngModel)]="selectedHotelId" class="border rounded px-2 py-1">
            <option [ngValue]="null">{{ 'inventoryManagement.allHotels' | transloco }}</option>
            <option *ngFor="let hotel of hotels" [ngValue]="hotel.hotelId">{{ hotel.name }}</option>
          </select>
          <button (click)="showAddItemForm = true" class="btn-primary">
            {{ 'inventoryManagement.addNewInventoryItem' | transloco }}
          </button>
        </div>
        
      </div>

      <!-- Low Stock Alerts -->
      <div *ngIf="hasLowStockItems" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">{{ 'inventoryManagement.lowStockAlert' | transloco }}</h3>
            <div class="mt-2 text-sm text-yellow-700">
              <ul class="list-disc pl-5 space-y-1">
                <li *ngFor="let item of lowStockItems">
                  {{ 'inventoryManagement.lowStockItem' | transloco : {
                    itemName: item.itemName,
                    currentStock: item.currentStock,
                    hotelName: getHotelNameById(item.hotelID)
                  } }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>




      <!-- Inventory Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'inventoryManagement.item' | transloco }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'inventoryManagement.category' | transloco }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'inventoryManagement.currentStock' | transloco }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'inventoryManagement.lastRestocked' | transloco }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'inventoryManagement.actions' | transloco }}</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let item of filteredInventory()">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{item.itemName}}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      [ngClass]="{
                      'bg-blue-100 text-blue-800': item.category === 'Toiletries',
                      'bg-purple-100 text-purple-800': item.category === 'Linens',
                      'bg-yellow-100 text-yellow-800': item.category === 'Guest Supplies',
                      'bg-green-100 text-green-800': item.category === 'Beverages',
                      'bg-pink-100 text-pink-800': item.category === 'Snacks'
                    }">
                    {{ 'categories.' + item.category | transloco }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{item.currentStock}} 
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{item.updatedAt | date: 'short'}}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                <button (click)="updateStock(item)" 
                        class="text-primary-600 hover:text-primary-900 mr-3">
                  {{ 'inventoryManagement.update' | transloco }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add Item Modal -->
      <div *ngIf="showAddItemForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-8 max-w-md w-full">
          <h3 class="text-lg font-medium mb-4"> {{ 'inventoryManagement.addNewInventoryItem' | transloco }}</h3>
          <form (ngSubmit)="addNewItem()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ 'inventoryManagement.itemName' | transloco }}</label>
              <input type="text" [(ngModel)]="newItem.itemName" name="name" 
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ 'inventoryManagement.category' | transloco }}</label>
              <select [(ngModel)]="newItem.category" name="category" 
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                <option value="Linens">{{ 'categories.Linens' | transloco }}</option>
                <option value="Toiletries">{{ 'Toiletries' | transloco }}</option>
                <option value="Beverages">{{ 'categories.Beverages' | transloco }}</option>
                <option value="Guest Supplies">{{ 'categories.Guest Supplies' | transloco }}</option>
                <option value="Snacks">{{ 'categories.Snacks' | transloco }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Hotel</label>
              <select [(ngModel)]="newItem.hotelID" name="hotel" class="border rounded px-2 py-1">
                <option *ngFor="let hotel of hotels" [ngValue]="hotel.hotelId">{{ hotel.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ 'inventoryManagement.currentStock' | transloco }}</label>
              <input type="number" [(ngModel)]="newItem.currentStock" name="currentStock" 
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"/>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" (click)="showAddItemForm = false" 
                      class="btn-secondary">
                {{ 'inventoryManagement.cancel' | transloco }}
              </button>
              <button type="submit" class="btn-primary">
                {{ 'inventoryManagement.addItem' | transloco }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Update Stock Modal -->
      <div *ngIf="selectedItem" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-8 max-w-md w-full">
          <h3 class="text-lg font-medium mb-4">{{ 'inventoryManagement.updateStock' | transloco }}: {{selectedItem.itemName}}</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ 'inventoryManagement.currentStock' | transloco }}</label>
              <input type="number" [(ngModel)]="newStockAmount" 
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"/>
            </div>
            <div class="flex justify-end space-x-3">
              <button (click)="selectedItem = null" class="btn-secondary">
                {{ 'inventoryManagement.cancel' | transloco }}
              </button>
              <button (click)="confirmUpdateStock()" class="btn-primary">
                {{ 'inventoryManagement.update' | transloco }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InventoryManagementComponent implements OnInit {
  inventory: Inventory[] = [];
  showAddItemForm = false;
  selectedItem: Inventory | null = null;
  newStockAmount: number = 0;
  selectedHotelId: number | null = null;
  hotels: any[] = []; 

  newItem: Partial<Inventory> = {
    itemName: '',
    category: '',
    currentStock: null,
    hotelID: null,
    updatedAt: null
  };

  constructor(
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private hotelService: HotelService,
    private t : TranslocoService
    
  ) {}

  ngOnInit() {
    this.loadInventory();
    this.loadHotels();
  }

  loadInventory() {
    this.inventoryService.getInventory().subscribe(items => {
      this.inventory = items;
    });
  }

  loadHotels(){
    this.hotelService.getHotels().subscribe(hotels => {
      this.hotels = hotels;
    });
  }


  updateStock(item: Inventory) {
    this.selectedItem = item;
    this.newStockAmount = item.currentStock;
  }

  filteredInventory(): Inventory[] {
    if (!this.selectedHotelId) return this.inventory;
    return this.inventory.filter(item => item.hotelID === this.selectedHotelId);
  }

confirmUpdateStock() {
  if (this.selectedItem && this.newStockAmount >= 0) {
    
      const updatedData = {
        inventoryID: this.selectedItem.inventoryID,
        itemName: this.selectedItem.itemName,
        category: this.selectedItem.category,
        currentStock: this.newStockAmount,
        hotelID: this.selectedItem.hotelID
      };

      this.inventoryService.updateInventory(updatedData).subscribe({
        next: () => {
        this.toastr.success(this.t.translate('toastr.success'));
          this.loadInventory();
          this.selectedItem = null;
        },
        error: (error) => {
           this.toastr.error(this.t.translate('toastr.error'));

        }
      });
    }
  }


  addNewItem() {
    if (this.validateNewItem()) {
      this.inventoryService.addInventory(this.newItem)
        .subscribe({
          next: () => {
            this.toastr.success(this.t.translate('toastr.success'));
            this.loadInventory();
            this.showAddItemForm = false;
            this.resetNewItem();
          },
          error: (error) => {
                    this.toastr.error(this.t.translate('toastr.error'));

          }
        });
     }
  }

  private validateNewItem(): boolean {

    if (this.newItem.currentStock! < 0 ) {
      this.toastr.error('Stock amounts cannot be negative');
      return false;
    }
    return true;
  }

  private resetNewItem() {
    this.newItem = {
      inventoryID: null,
      itemName: '',
      category: '',
      currentStock: null,
      hotelID: null,
    };
  }

  getHotelNameById(hotelId: number): string {
    const hotel = this.hotels.find(h => h.hotelId === hotelId);
    return hotel ? hotel.name : 'Unknown Hotel';
  }


  get hasLowStockItems(): boolean {
    return this.filteredInventory().some(item => item.currentStock < 20);
  }

  get lowStockItems(): Inventory[] {
    return this.filteredInventory().filter(item => item.currentStock < 20);
  }

}
