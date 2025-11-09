export interface EventDto {
    id?: number;
    title: string;
    startTime: string; 
    endTime: string;
    status: 'BUSY' | 'FREE' | 'SWAPPABLE';
  }
  