import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[cmsDropdown]',
  standalone: true,
})
export class DropdownDirective {
  private isOpen = false;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) {}

  @HostListener('click', ['$event'])
  onHostClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedToggle = !!target.closest('.dropdown-toggle');
    const clickedMenuItem = !!target.closest('.dropdown-item');

    if (clickedToggle) {
      event.preventDefault();
      this.isOpen = !this.isOpen;
      this.updateDropdownClasses();
      return;
    }

    if (clickedMenuItem) {
      this.isOpen = false;
      this.updateDropdownClasses();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen = false;
      this.updateDropdownClasses();
    }
  }

  private updateDropdownClasses() {
    const host = this.elementRef.nativeElement;
    const menu = host.querySelector('.dropdown-menu');

    if (this.isOpen) {
      this.renderer.addClass(host, 'show');
      if (menu) {
        this.renderer.addClass(menu, 'show');
      }
      return;
    }

    this.renderer.removeClass(host, 'show');
    if (menu) {
      this.renderer.removeClass(menu, 'show');
    }
  }
}
