import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SwapService } from '../../services/swap.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './swap-requests.component.html'
})
export class SwapRequestsComponent implements OnInit {
  incoming: any[] = [];
  outgoing: any[] = [];
  error = '';
  success = '';

  constructor(private swaps: SwapService) {}

  ngOnInit() { this.load(); }

  load() {
    this.error = '';
    this.swaps.listForMe().subscribe({
      next: (res) => { this.incoming = res.incoming; this.outgoing = res.outgoing; },
      error: (e) => this.error = e?.error?.message || 'Failed to load swaps'
    });
  }

  respond(id: number, accept: boolean) {
    this.swaps.respond(id, accept).subscribe({
      next: () => { this.success = accept ? 'Accepted!' : 'Declined.'; this.load(); },
      error: (e) => this.error = e?.error?.message || 'Action failed'
    });
  }
}
