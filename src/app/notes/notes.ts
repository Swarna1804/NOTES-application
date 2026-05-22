import { Component, effect, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { NoteComponent } from '../note/note';

import { v4 as uuidv4 } from 'uuid';

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
      console.log(uuidv4());

      this.notes.update(notes => [

        ...notes,

        {

          id: uuidv4(),

          text: this.newNote,

          date: new Date().toLocaleString(),

          pinned: false
        }

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