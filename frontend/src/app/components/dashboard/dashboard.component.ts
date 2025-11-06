import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventDto } from '../../interfaces/dto';
import { EventEntity } from '../../interfaces/event';
import { EventService } from '../../services/event.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h3>My Events</h3>
    <button class="btn btn-outline-secondary" (click)="refresh()">Refresh</button>
  </div>

  <form class="card card-body mb-3" (ngSubmit)="create()">
    <div class="row g-2">
      <div class="col-md-3">
        <input class="form-control" placeholder="Title" [(ngModel)]="form.title" name="title" required>
      </div>
      <div class="col-md-3">
        <input class="form-control" type="datetime-local" [(ngModel)]="form.startTime" name="start">
      </div>
      <div class="col-md-3">
        <input class="form-control" type="datetime-local" [(ngModel)]="form.endTime" name="end">
      </div>
      <div class="col-md-2">
        <select class="form-select" [(ngModel)]="form.status" name="status">
          <option [ngValue]="'BUSY'">BUSY</option>
          <option [ngValue]="'FREE'">FREE</option>
          <option [ngValue]="'SWAPPABLE'">SWAPPABLE</option>
        </select>
      </div>
      <div class="col-md-1">
        <button class="btn btn-primary w-100">Add</button>
      </div>
    </div>
  </form>

  <div class="table-responsive">
    <table class="table table-striped align-middle">
      <thead><tr>
        <th>Title</th><th>Start</th><th>End</th><th>Status</th><th style="width:160px">Actions</th>
      </tr></thead>
      <tbody>
        <tr *ngFor="let e of events">
          <td><input class="form-control" [(ngModel)]="e.title" name="t{{e.id}}"></td>
          <td><input class="form-control" type="datetime-local" [(ngModel)]="e.startTime" name="s{{e.id}}"></td>
          <td><input class="form-control" type="datetime-local" [(ngModel)]="e.endTime" name="e{{e.id}}"></td>
          <td>
            <select class="form-select" [(ngModel)]="e.status" name="st{{e.id}}">
              <option [ngValue]="'BUSY'">BUSY</option>
              <option [ngValue]="'FREE'">FREE</option>
              <option [ngValue]="'SWAPPABLE'">SWAPPABLE</option>
            </select>
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" (click)="save(e)">Save</button>
              <button class="btn btn-outline-danger" (click)="remove(e)">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="text-danger" *ngIf="error">{{error}}</div>
  `
})
export class DashboardComponent implements OnInit {
  events: EventEntity[] = [];
  error = '';

  form: EventDto = {
    title: '',
    startTime: '',
    endTime: '',
    status: 'BUSY'
  };

  constructor(private api: EventService) {}

  ngOnInit() { this.refresh(); }

  refresh() {
    this.api.myEvents().subscribe({
      next: (data) => this.events = data.map(e => ({
        ...e,
        startTime: this.toLocalInput(e.startTime),
        endTime: this.toLocalInput(e.endTime)
      })),
      error: (e) => this.error = e?.error?.message || 'Failed to load events'
    });
  }

  create() {
    this.api.create(this.form).subscribe({
      next: () => { this.form = { title: '', startTime: '', endTime: '', status: 'BUSY' }; this.refresh(); },
      error: (e) => this.error = e?.error?.message || 'Failed to create'
    });
  }

  save(e: EventEntity) {
    const payload = {
      title: e.title,
      startTime: e.startTime,
      endTime: e.endTime,
      status: e.status as any
    } as Partial<EventDto>;
    this.api.update(e.id, payload).subscribe({
      next: () => this.refresh(),
      error: (err) => this.error = err?.error?.message || 'Update failed'
    });
  }

  remove(e: EventEntity) {
    if (!confirm('Delete this event?')) return;
    this.api.delete(e.id).subscribe({
      next: () => this.refresh(),
      error: (err) => this.error = err?.error?.message || 'Delete failed'
    });
  }

  private toLocalInput(value: string): string {
    const d = new Date(value);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  }
}
