import { Component, OnDestroy, AfterViewInit, Output, EventEmitter, ElementRef, Input } from '@angular/core';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'ngx-tiny-mce',
  template: '',
})
export class TinyMCEComponent implements OnDestroy, AfterViewInit {

  @Output() editorKeyup = new EventEmitter<any>();
  @Input() initValue:string = ''

  editor: any;

  constructor(
    private host: ElementRef,
    private locationStrategy: LocationStrategy,
  ) {
   }

  ngAfterViewInit() {
    // tinymce.init({
    //   target: this.host.nativeElement,
    //   plugins: ['link', 'paste', 'table'],
    //   skin_url: `${this.locationStrategy.getBaseHref()}assets/skins/lightgray`,
    //   setup: editor => {
    //     this.editor = editor;
    //     editor.on('keyup', () => {
    //       this.editorKeyup.emit(editor.getContent());
    //     });
    //   },
    //   height: '320',
    // });
    // this.editor.setContent(this.initValue)
  }

  ngOnDestroy() {
    // tinymce.remove(this.editor);
  }
}
