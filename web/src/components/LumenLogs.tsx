import { useState } from "react";
import type { Note } from "@/types/notes";
import NotesList from "./NotesList";
import NoteEditor from "./NoteEditor";
import { Button } from "@/components/ui/button";
import Members from "./data/members";
import Introduction from "./data/intro";


export default function LumenLogs() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsCreating(false);
    setIsEditorOpen(true);
    setShowWelcome(false);
  };

  const handleCreateNote = () => {
    setSelectedNote(null);
    setIsCreating(true);
    setIsEditorOpen(true);
    setShowWelcome(false);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedNote(null);
    setIsCreating(false);
  };

  const handleSaveNote = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-white mb-20">
        <div className="mobile-container py-8 sm:py-16">
          <section className="grid place-content-center h-100">
            <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
              <div className="mx-auto max-w-prose text-center">
                <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                  Save time and  
                  <strong className="text-red-600"> focus </strong>
                  on what matters
                </h1>

                <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
                  Get the documents you need quickly, clearly, and confidently.
                </p>

                <div className="mt-4 flex justify-center gap-4 sm:mt-6">
                  <Button 
                    size="lg" 
                    className="flex rounded border border-red-600 bg-red-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-red-700"
                    onClick={handleGetStarted}
                    >Book an Appointment
                  </Button>
                </div>
              </div>
            </div>
          </section>

         
          
        </div>
         <Introduction />
        <Members />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mobile-container py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center">
          </div>
          <Button 
            onClick={() => setShowWelcome(true)}
            variant="outline"
            className="btn-black-outline touch-target"
          >
            About us
          </Button>
        </div>
        
        <NotesList
          onEditNote={handleEditNote}
          onCreateNote={handleCreateNote}
          refreshTrigger={refreshTrigger}
        />
        
        <NoteEditor
          note={selectedNote}
          isOpen={isEditorOpen}
          onClose={handleCloseEditor}
          onSave={handleSaveNote}
          isCreating={isCreating}
        />
      </div>
    </div>
  );
}
