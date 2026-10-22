import { Component, signal, afterNextRender, ViewContainerRef, ViewChild, Type } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-components-app');
  protected isBrowser = signal(false);

  @ViewChild('editorContainer', { read: ViewContainerRef }) private editorContainer!: ViewContainerRef;

  constructor() {
    afterNextRender(async () => {
      this.isBrowser.set(true);

      // Dynamically import the editor component ONLY on the client browser.
      // This guarantees Vite never touches ckeditor5 during SSR evaluation.
      const { TextEditorComponent } = await import('./components/text-editor/text-editor');
      
      if (this.editorContainer) {
        this.editorContainer.clear();
        this.editorContainer.createComponent(TextEditorComponent);
      }
    });
  }
}