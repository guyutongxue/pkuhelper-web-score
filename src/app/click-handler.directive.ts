import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appClickHandler]'
})
export class ClickHandlerDirective {

  @Output() handlerClick = new EventEmitter();

  readonly MOVE_THRESHOLD = 3;

  #moved = true;
  #initX = 0;
  #initY = 0;
  #lastFired = 0;

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onBegin(e: TouchEvent | MouseEvent) {
    const pos = ("touches" in e ? e.touches[0] : e);
    this.#moved = false;
    this.#initX = pos.screenX;
    this.#initY = pos.screenY;
  }

  @HostListener('mousemove', ['$event'])
  @HostListener('touchmove', ['$event'])
  onMove(e: TouchEvent | MouseEvent) {
    const pos = ("touches" in e ? e.touches[0] : e);
    if (!this.#moved) {
      const movement = Math.abs(pos.screenY - this.#initY) + Math.abs(pos.screenX - this.#initX);
      if (movement > this.MOVE_THRESHOLD) {
        this.#moved = true;
      }
    }
  }

  @HostListener('click', ['$event'])
  onEnd(e: MouseEvent) {
    if (!this.#moved && e.target instanceof Element && !e.target.closest(".prevent-click-handler")) {
      this.#doClick(e);
    }
    this.#moved = true;
  }

  #doClick(e: MouseEvent) {
    if (this.#lastFired + 100 > + new Date()) return;
    this.#lastFired = +new Date();
    this.handlerClick.emit();
  }

  constructor() { }

}
