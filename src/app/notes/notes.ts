import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoteComponent } from '../note/note';
import { AuthService } from '../services/auth';

interface Note {

  id: string;

  text: string;

  date: string;

  pinned: boolean;
}

@Component({
  selector: 'app-notes',

  standalone: true,

  imports: [
    FormsModule,
    NoteComponent
  ],

  templateUrl: './notes.html',

  styleUrls: ['./notes.css']
})

export class NotesComponent {

  darkMode = signal(true);

  notes = signal<Note[]>([]);

  newNote = '';

  searchText = '';

  toggleTheme() {

    this.darkMode.update(
      value => !value
    );
  }

  constructor(
    private router: Router,
    private authService: AuthService
  ) {

    if (typeof window !== 'undefined') {

      const savedNotes = localStorage.getItem('notes');

      if (savedNotes) {
        this.notes.set(this.parseSavedNotes(savedNotes));
      }

      effect(() => {
        localStorage.setItem('notes', JSON.stringify(this.notes()));
      });
    }
  }

  private parseSavedNotes(value: string): Note[] {
    try {
      const saved = JSON.parse(value);

      if (!Array.isArray(saved)) {
        return [];
      }

      return saved.map((note: any) => ({
        id: String(note?.id ?? this.generateNoteId()),
        text: String(note?.text ?? ''),
        date: String(note?.date ?? new Date().toLocaleString()),
        pinned: Boolean(note?.pinned ?? false),
      }));
    } catch {
      return [];
    }
  }

  private generateNoteId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return (crypto as any).randomUUID();
    }
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  addNote() {

    if (this.newNote.trim()) {
      const id = this.generateNoteId();

      this.notes.update(notes => [
        ...notes,
        {
          id,
          text: this.newNote,
          date: new Date().toLocaleString(),
          pinned: false,
        },
      ]);

      this.newNote = '';
    }
  }

  deleteNote(id: string) {

    this.notes.update(notes =>

      notes.filter(
        note => note.id !== id
      )

    );

  }

  editNote(updatedNote: Note) {

    this.notes.update(notes =>

      notes.map(note =>

        note.id === updatedNote.id
          ? updatedNote
          : note

      )

    );

  }

  filteredNotes() {

    return [...this.notes()]

      .filter(note =>

        String(note.text || '')
          .toLowerCase()
          .includes(this.searchText.toLowerCase())

      )

      .sort((a, b) =>

        Number(b.pinned)
        -
        Number(a.pinned)

      );

  }

  togglePin(updatedNote: Note) {

    this.notes.update(notes =>

      notes.map(note =>

        note.id === updatedNote.id
          ? updatedNote
          : note

      )

    );

  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('currentUser');
    }

    this.authService.logout().catch(() => {
      // If Firebase logout fails, still navigate away and clear local state.
    });

    this.router.navigate(['/']);
  }

}