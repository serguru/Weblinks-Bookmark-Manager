import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {
  transform(text: string, searchTerm: string): string {
    if (!searchTerm) return text;

    const regex = new RegExp(searchTerm, 'gi');
    return text.replace(regex, match => `<mark>${match}</mark>`);
  }
}
