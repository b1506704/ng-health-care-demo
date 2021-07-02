import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appScrollSpy]',
})
export class ScrollSpyDirective {
  @Input() public spiedTags: Array<string> = [];
  @Output() public sectionChange = new EventEmitter<string>();
  currentSection: string = '';

  constructor(private _el: ElementRef) {}

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    let currentSection: string = '';

    const children = this._el.nativeElement.children;
    const scrollTop = event.target.scrollTop;
    const parentOffset = event.target.offsetTop;

    for (let i = 0; i < children.length; i++) {
      const element = children[i];
      if (this.spiedTags.some((spiedTag) => spiedTag === element.tagName)) {
        if (element.offsetTop - parentOffset <= scrollTop) {
          currentSection = element.id;
        }
      }
    }

    if (currentSection !== this.currentSection) {
      this.currentSection = currentSection;
      this.sectionChange.emit(this.currentSection);
    }
  }
}
