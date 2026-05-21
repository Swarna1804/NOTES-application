import { Component, effect, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { NoteComponent } from '../note/note';

interface Note {

  id: number;

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

  styleUrl: './notes.css'
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

  constructor() {

    if(typeof window !== 'undefined') {

      const savedNotes =
        localStorage.getItem('notes');

      if(savedNotes) {

        this.notes.set(
          JSON.parse(savedNotes)
        );
      }

      effect(() => {

        localStorage.setItem(

          'notes',

          JSON.stringify(this.notes())

        );

      });

    }

  }

  addNote() {

    if(this.newNote.trim()) {

      this.notes.update(notes => [

        ...notes,

        {

          id: Date.now(),

          text: this.newNote,

          date: new Date().toLocaleString(),

          pinned: false
        }

      ]);

      this.newNote = '';

    }

  }

  deleteNote(id: number) {

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

        note.text
          .toLowerCase()
          .includes(
            this.searchText.toLowerCase()
          )

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

}