import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EventDto } from '../interfaces/dto';

@Injectable({ providedIn: 'root' })
export class SwapService {
  private base = environment.apiBase + '/api';

  constructor(private http: HttpClient) {}

  swappableSlots() {
    return this.http.get<EventDto[]>(`${this.base}/swappable-slots`);
  }

  createSwap(mySlotId: number, theirSlotId: number) {
    return this.http.post(`${this.base}/swap-request`, { mySlotId, theirSlotId });
  }

  respond(requestId: number, accept: boolean) {
    return this.http.post(`${this.base}/swap-response/${requestId}`, { accept });
  }

  listForMe() {
    return this.http.get<{ incoming: any[]; outgoing: any[] }>(`${this.base}/swap-requests`);
  }
}
