import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-osu-button',
  templateUrl: './osu-button.component.html',
  styleUrls: ['./osu-button.component.scss']
})
export class OsuButtonComponent implements OnInit {

  constructor() { }

  @Input() disabled = false;
  @Input() text = '';
  @Input() buttonText = '';

  @Output() click = new EventEmitter();

  ngOnInit(): void {
  }

}
