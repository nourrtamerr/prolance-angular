import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(minutes: number): string {
    if (minutes === null || minutes === undefined) return '';
    if (minutes < 0) return 'Invalid time';

    // Calculate time intervals
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } 
    else if (hours < 24) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } 
    else if (days < 30) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } 
    else if (months < 12) {
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } 
    else {
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
  }


}
