import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventDto } from '../../interfaces/dto';
import { EventEntity } from '../../interfaces/event';
import { EventService } from '../../services/event.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html'
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
    const payload = { title: e.title, startTime: e.startTime, endTime: e.endTime, status: e.status };
    this.api.update(e.id, payload).subscribe({
      next: () => this.refresh(),
      error: (err) => this.error = err?.error?.message || 'Update failed'
    });
  }

  remove(e: EventEntity) {
    if (!confirm('Delete this event?')) return;
  
    this.api.delete(e.id).subscribe({
      next: () => {
        this.error = '';
        this.refresh();
      },
      error: (err) => {
        this.error = err?.error?.error || 'Delete failed';
        alert(this.error); // ✅ show message immediately
        this.refresh();
      }
    });
  }
  

  private toLocalInput(value: string): string {
    const d = new Date(value);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}
