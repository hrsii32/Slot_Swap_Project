import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventDto } from '../../interfaces/dto';
import { EventEntity } from '../../interfaces/event';
import { EventService } from '../../services/event.service';
import { SwapService } from '../../services/swap.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <h3>Marketplace</h3>
  <p class="text-muted">See swappable slots from others and request a swap.</p>

  <div class="row g-3 mb-4">
    <div class="col-md-6">
      <label class="form-label">My Slot</label>
      <select class="form-select" [(ngModel)]="mySlotId" name="myslot">
        <option [ngValue]="null">-- select one of my events --</option>
        <option *ngFor="let e of myEvents" [ngValue]="e.id">
          {{e.title}} — {{e.startTime}} → {{e.endTime}} ({{e.status}})
        </option>
      </select>
    </div>
  </div>

  <div class="table-responsive">
    <table class="table table-hover align-middle">
      <thead><tr><th>Title</th><th>Start</th><th>End</th><th>Status</th><th></th></tr></thead>
      <tbody>
        <tr *ngFor="let s of swappable">
          <td>{{s.title}}</td>
          <td>{{s.startTime}}</td>
          <td>{{s.endTime}}</td>
          <td>{{s.status}}</td>
          <td>
            <button class="btn btn-sm btn-primary" [disabled]="!mySlotId" (click)="requestSwap(s)">Request Swap</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="text-success" *ngIf="success">{{success}}</div>
  <div class="text-danger" *ngIf="error">{{error}}</div>
  `
})
export class MarketplaceComponent implements OnInit {
  swappable: EventDto[] = [];
  myEvents: EventEntity[] = [];
  mySlotId: number | null = null;
  error = '';
  success = '';

  constructor(private swap: SwapService, private events: EventService) {}

  ngOnInit() { this.refresh(); }

  refresh() {
    this.events.myEvents().subscribe({ next: (e) => this.myEvents = e });
    this.swap.swappableSlots().subscribe({
      next: (data) => this.swappable = data,
      error: (e) => this.error = e?.error?.message || 'Failed to load marketplace'
    });
  }

  requestSwap(slot: EventDto) {
    if (!this.mySlotId) return;
    const theirId = (slot as any).id ?? null;
    if (!theirId) { this.error = 'This demo expects marketplace items to include their event ID.'; return; }

    this.swap.createSwap(this.mySlotId!, theirId).subscribe({
      next: () => this.success = 'Swap requested! Check the Swaps page.',
      error: (e) => this.error = e?.error?.message || 'Swap request failed'
    });
  }
}
