import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Note } from "@/types/notes";
import notesService from "@/service/notes";
import {Plus, Image as ImageIcon, RefreshCw, Check, Calendar, Eye } from "lucide-react";
import { extractAppointmentDate, getCleanContent } from "@/lib/utils";

interface NotesListProps {
  onEditNote: (note: Note) => void;
  onCreateNote: () => void;
  refreshTrigger: number;
}

export default function NotesList({ onEditNote, onCreateNote, refreshTrigger }: NotesListProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedNotes = await notesService.getAllNotes();
      setNotes(fetchedNotes.sort((a, b) => {
        // Sort by appointment date if available, otherwise by updated_at
        const dateA = extractAppointmentDate(a.content) ? new Date(extractAppointmentDate(a.content)!) : new Date(a.updated_at);
        const dateB = extractAppointmentDate(b.content) ? new Date(extractAppointmentDate(b.content)!) : new Date(b.updated_at);
        return dateB.getTime() - dateA.getTime();
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [refreshTrigger]);

  const handleDeleteNote = async (noteId: string) => {
    try {
      await notesService.deleteNote(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete note");
    }
  };

  const formatDate = (dateString: string, isAppointmentDate: boolean = false) => {
    const date = new Date(dateString);
    if (isAppointmentDate) {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center gap-2 text-lg text-gray-700">
          <RefreshCw className="h-5 w-5 animate-spin text-gray-500" />
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>Error: {error}</AlertDescription>
        </Alert>
        <Button onClick={fetchNotes} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  // Notes page
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 -mx-6 px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Appointments</h1>
                <p className="text-gray-600 mt-1">Manage your scheduled appointments</p>
              </div>
            </div>
            {notes.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm bg-red-50 text-red-700 border-red-200 font-medium px-3 py-1">
                  {notes.length} appointment{notes.length > 1 ? 's' : ''}
                </Badge>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-600">10 slots available</span>
              </div>
            )}
          </div>
          <Button 
            onClick={onCreateNote} 
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 rounded-xl font-medium"
          >
            <Plus className="h-5 w-5" />
            New Appointment
          </Button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="w-24 h-24 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center mb-6">
            <Calendar className="h-12 w-12 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No appointments scheduled</h3>
          <p className="text-gray-600 text-center max-w-md mb-8 leading-relaxed">
            Get started by creating your first appointment. Our scheduling system operates on a first-come, first-served basis to ensure fair access for all users.
          </p>
          <Button 
            onClick={onCreateNote} 
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-4 rounded-xl font-medium text-lg"
          >
            <Plus className="h-5 w-5" />
            Schedule Your First Appointment
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card 
              key={note.id} 
              className="group relative overflow-hidden bg-white border border-gray-200 hover:border-red-300 hover:shadow-xl transition-all duration-300 cursor-pointer rounded-xl"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-700"></div>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-red-700 transition-colors mb-2">
                      {note.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const extractedDate = extractAppointmentDate(note.content);
                        if (extractedDate) {
                          return (
                            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                              <Calendar className="h-4 w-4" />
                              {extractedDate}
                            </div>
                          );
                        }
                        return (
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <span>Created {formatDate(note.updated_at)}</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-50 px-2 py-1 rounded-full">
                      <Eye className="h-3 w-3 text-gray-600" />
                      <span className="text-xs text-gray-600 font-medium">View</span>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-50 p-2 rounded-full"
                        >
                          <Check className="h-5 w-5 text-green-600" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-lg font-semibold">Complete Appointment</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600">
                            Mark "{note.title}" as completed? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteNote(note.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Complete Appointment
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent onClick={() => onEditNote(note)} className="pt-0">
                <div className="space-y-4">
                  <p className="text-gray-700 line-clamp-3 leading-relaxed">{getCleanContent(note.content)}</p>
                  
                  {/* Image Preview Section */}
                  {note.images.length > 0 && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-gray-400" />
                        <Badge variant="outline" className="text-xs border-gray-200 text-gray-600 bg-gray-50 font-medium">
                          {note.images.length} attachment{note.images.length > 1 ? 's' : ''}
                        </Badge>
                      </div>
                      
                      {/* Show first few image thumbnails */}
                      <div className="flex -space-x-2">
                        {note.image_urls?.slice(0, 3).map((imageUrl, index) => (
                          <Avatar key={index} className="h-8 w-8 border-2 border-white shadow-sm ring-1 ring-gray-100">
                            <AvatarImage 
                              src={imageUrl} 
                              alt={`Preview ${index + 1}`}
                              className="object-cover"
                            />
                            <AvatarFallback className="text-xs bg-gray-100 text-gray-600">
                              <ImageIcon className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {note.images.length > 3 && (
                          <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center shadow-sm ring-1 ring-gray-100">
                            <span className="text-xs text-gray-600 font-medium">+{note.images.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
