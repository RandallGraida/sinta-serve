import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DatePicker } from "@/components/ui/date-picker";
import ImageGallery from "@/components/ImageGallery";
import type { Note, NoteCreate, NoteUpdate } from "@/types/notes";
import notesService from "@/service/notes";
import { Save, X, Image, Plus, Lightbulb, Calendar, Check } from "lucide-react";
import { cn, extractAppointmentDate, getCleanContent } from "@/lib/utils";

interface NoteEditorProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  isCreating: boolean;
}

export default function NoteEditor({ note, isOpen, onClose, onSave, isCreating }: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdNote, setCreatedNote] = useState<Note | null>(null);
  const [showImageSection, setShowImageSection] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      // Extract appointment date from content and show clean content
      const extractedDate = extractAppointmentDate(note.content);
      setAppointmentDate(extractedDate || "");
      setContent(getCleanContent(note.content));
      setImages(note.images);
      setImageUrls(note.image_urls || []);
      setCreatedNote(note);
      setShowImageSection(false);
    } else {
      setTitle("");
      setContent("");
      setAppointmentDate("");
      setImages([]);
      setImageUrls([]);
      setCreatedNote(null);
      setShowImageSection(false);
    }
    setError(null);
  }, [note, isOpen]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (isCreating) {
        // Include appointment date in content since backend might not support it
        const contentWithDate = appointmentDate 
          ? `${content.trim()}\n\n📅 Appointment Date: ${new Date(appointmentDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}`
          : content.trim();
          
        const noteData: NoteCreate = {
          title: title.trim(),
          content: contentWithDate,
        };
        const newNote = await notesService.createNote(noteData);
        setCreatedNote(newNote);
        setShowImageSection(true);
        // Don't close the dialog yet - allow user to add images
      } else if (note) {
        // Include appointment date in content since backend might not support it
        const contentWithDate = appointmentDate 
          ? `${content.trim()}\n\n📅 Appointment Date: ${new Date(appointmentDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}`
          : content.trim();
          
        const noteData: NoteUpdate = {
          title: title.trim(),
          content: contentWithDate,
        };
        await notesService.updateNote(note.id, noteData);
        onSave();
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleImagesUpdate = (newImages: string[], newImageUrls: string[]) => {
    setImages(newImages);
    setImageUrls(newImageUrls);
  };

  const handleFinishCreating = () => {
    onSave();
    onClose();
  };

  const currentNote = createdNote || note;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-1000 max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl rounded-2xl">
        <DialogHeader className="pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            {isCreating ? (
              createdNote ? (
                <>
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                    <Image className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">Add Attachments</DialogTitle>
                    <p className="text-gray-600 mt-1">Upload images and documents for your appointment</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">Schedule New Appointment</DialogTitle>
                    <p className="text-gray-600 mt-1">Fill in the details below to create your appointment</p>
                  </div>
                </>
              )
            ) : (
              <>
                <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">Appointment Details</DialogTitle>
                  <p className="text-gray-600 mt-1">View your scheduled appointment information</p>
                </div>
              </>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50 rounded-xl">
              <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
            </Alert>
          )}

          {/* Show form fields only if not in image-adding mode */}
          {!(isCreating && createdNote) && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-rows-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your full name"
                    className={cn(
                      "w-full text-gray-900 placeholder:text-gray-400 border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-xl",
                      !isCreating && "bg-gray-50 cursor-not-allowed text-gray-900"
                    )}
                    disabled={!isCreating}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="appointment-date" className="block text-sm font-semibold text-gray-900">
                    Appointment Date
                  </label>
                  <DatePicker
                    value={appointmentDate}
                    onChange={setAppointmentDate}
                    placeholder="Select appointment date"
                    className="w-full"
                    disabled={!isCreating}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="block text-sm font-semibold text-gray-900">
                  Appointment Details
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe your appointment requirements, any special requests, or additional information..."
                  className={cn(
                    "w-full min-h-[200px] sm:min-h-[250px] text-gray-900 placeholder:text-gray-400 resize-none border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-xl",
                    !isCreating && "bg-gray-50 cursor-not-allowed text-gray-900"
                  )}
                  disabled={!isCreating}
                />
              </div>
            </div>
          )}

          {/* Show success message and image section after creation */}
          {isCreating && createdNote && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-900 text-lg">Appointment Created Successfully!</h3>
                    <p className="text-green-700 text-sm">Your appointment has been scheduled and saved.</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-red-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">{createdNote.title}</h4>
                  </div>
                  
                  {(() => {
                    const extractedDate = extractAppointmentDate(createdNote.content);
                    if (extractedDate) {
                      return (
                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                          <span className="font-medium">Scheduled for:</span>
                          <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full font-medium">
                            {extractedDate}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  
                  {getCleanContent(createdNote.content) && (
                    <p className="text-gray-700 text-sm leading-relaxed">{getCleanContent(createdNote.content)}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Image gallery - show only for newly created notes */}
          {currentNote && isCreating && showImageSection && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-red-50 to-red-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Image className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-900 text-lg">Add Attachments</h3>
                    <p className="text-red-700 text-sm">Upload images and documents for your appointment</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 border border-blue-100">
                  <ImageGallery
                    noteId={currentNote.id}
                    images={images}
                    imageUrls={imageUrls}
                    onImagesUpdate={handleImagesUpdate}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-100">
            <Button 
              variant="outline" 
              onClick={onClose} 
              disabled={loading}
              className="order-2 sm:order-1 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl font-medium"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            
            {isCreating && !createdNote && (
              <Button 
                onClick={handleSave}
                disabled={loading}
                className="order-1 sm:order-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 rounded-xl font-medium"
              >
                <Save className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
            )}
            
            {isCreating && createdNote && (
              <Button 
                onClick={handleFinishCreating}
                className="order-1 sm:order-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 rounded-xl font-medium"
              >
                <Save className="h-4 w-4 mr-2" />
                Complete & Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
