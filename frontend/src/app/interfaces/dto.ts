export interface EventDto {
    // include id if your backend returns it on marketplace endpoint
    id?: number;
    title: string;
    startTime: string; // 'YYYY-MM-DDTHH:mm' from <input type="datetime-local">
    endTime: string;
    status: 'BUSY' | 'FREE' | 'SWAPPABLE';
  }
  