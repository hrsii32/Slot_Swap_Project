import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EventDto } from '../interfaces/dto';
import { EventEntity } from '../interfaces/event';

@Injectable({ providedIn: 'root' })
export class EventService {
  private base = environment.apiBase + '/api/events';

  constructor(private http: HttpClient) {}

  myEvents() {
    return this.http.get<EventEntity[]>(`${this.base}/get/me`);
  }

  create(dto: EventDto) {
    return this.http.post<EventEntity>(`${this.base}/add`, dto);
  }

  update(id: number, dto: Partial<EventDto>) {
    return this.http.put<EventEntity>(`${this.base}/update/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/delete/${id}`);
  }
}
