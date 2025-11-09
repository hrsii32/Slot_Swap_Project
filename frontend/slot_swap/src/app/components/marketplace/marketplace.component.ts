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
  templateUrl: './marketplace.component.html'
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
    const theirId = slot.id;
    if (!theirId || !this.mySlotId) return;

    this.swap.createSwap(this.mySlotId, theirId).subscribe({
      next: () => this.success = 'Swap requested! Check the Swaps page.',
      error: (e) => this.error = e?.error?.message || 'Swap request failed'
    });
  }
}
