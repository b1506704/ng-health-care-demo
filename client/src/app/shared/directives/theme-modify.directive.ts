import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ThemeService } from '../services/theme.service';

@Directive({
  selector: '[appThemeModify]',
})
export class ThemeModifyDirective {
  @Input() inputType!: string;

  constructor(private elRef: ElementRef, private themeStore: ThemeService) {}
  @HostListener('mouseenter') onMouseEnter() {
    if (this.inputType === 'animation') {
      this.themeStore.$hoverBackgroundColor.subscribe((data: any) => {
        this.elRef.nativeElement.style.backgroundColor = data;
      });
      this.themeStore.$hoverTextColor.subscribe((data: any) => {
        this.elRef.nativeElement.style.color = data;
      });
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.inputType === 'animation') {
      this.elRef.nativeElement.style.backgroundColor = '';
      this.elRef.nativeElement.style.color = '';
    }
  }

  renderWithObservable() {
    switch (this.inputType) {
      case 'menu':
        this.themeStore.$backgroundColor.subscribe((data: any) => {
          this.elRef.nativeElement.style.backgroundColor = data;
        });
        this.themeStore.$textColor.subscribe((data: any) => {
          this.elRef.nativeElement.style.color = data;
        });
        break;
      case 'card':
        this.themeStore.$cardBackgroundColor.subscribe((data: any) => {
          this.elRef.nativeElement.style.backgroundColor = data;
        });
        this.themeStore.$cardTextColor.subscribe((data: any) => {
          this.elRef.nativeElement.style.color = data;
        });
        break;
      case 'typo':
        this.themeStore.$typoFontFamily.subscribe((data: any) => {
          this.elRef.nativeElement.style.fontFamily = data;
        });
        this.themeStore.$typoFontSize.subscribe((data: any) => {
          this.elRef.nativeElement.style.fontSize = data + 'px';
        });
        this.themeStore.$typoLetterSpacing.subscribe((data: any) => {
          this.elRef.nativeElement.style.letterSpacing = data + 'px';
        });
        break;
      default:
        break;
    }
  }
  ngAfterViewInit(): void {
    this.renderWithObservable();
  }
}
