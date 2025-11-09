export enum EventStatus {
    BUSY = 'BUSY',
    FREE = 'FREE',
    SWAPPABLE = 'SWAPPABLE'
  }
  
  export interface EventEntity {
    id: number;
    title: string;
    startTime: string; 
    endTime: string;   
    status: EventStatus;
  }
  