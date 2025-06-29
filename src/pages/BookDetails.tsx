import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { FileUpload } from "../components/ui/file-upload";
import { ChapterList } from "../components/ChapterList";
import { StatusBadge } from "../components/ui/status-badge";
import { useToast } from "../hooks/use-toast";
import {
  ArrowLeft,
  Trash2,
  Archive,
  Download,
  AlertCircle,
  BookOpen,
  Calendar,
  Clock,
  User,
  Globe,
  Tag,
  Edit3,
  Save,
  X,
  Info,
  ChevronDown,
  FileText,
  BookText,
  FileType,
} from "lucide-react";
import {
  CustomSelect,
  SelectOption,
  mapToSelectOptions,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { BookCategory, Status } from "../store/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchCategories } from "../store/slices/categoriesSlice";
import { fetchLanguages } from "../store/slices/languagesSlice";
import { updateBookInList, deleteBook } from "../store/slices/booksSlice";
import { hasProOrStudioPlan } from "../store/slices/subscriptionSlice";
import { formatDistanceToNow } from "date-fns";
import { getCoverUrl } from "../lib/utils/covers";
import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";

interface BookFormData {
  title: string;
  authorName: string;
  isbn: string;
  cover_url: string;
  synopsis: string;
  categories: SelectOption[];
  language: SelectOption | null;
  status: Status;
}

export function BookDetails() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { session } = useSelector((state: RootState) => state.auth);
  const { status: subscriptionStatus } = useSelector(
    (state: RootState) => state.subscription
  );
  const { items: categories, status: categoriesStatus } = useSelector(
    (state: RootState) => state.categories
  );
  const { items: languages, status: languagesStatus } = useSelector(
    (state: RootState) => state.languages
  );
  const hasProOrStudio = useSelector(hasProOrStudioPlan);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showUnpublishDialog, setShowUnpublishDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [coverLoading, setCoverLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState({
    title: false,
    authorName: false,
    categories: false,
    language: false,
  });

  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    authorName: "",
    isbn: "",
    cover_url: "",
    synopsis: "",
    categories: [],
    language: null,
    status: "draft",
  });

  const [bookStats, setBookStats] = useState({
    chapterCount: 0,
    wordCount: 0,
    createdAt: "",
    updatedAt: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [bookData] = await Promise.all([
          supabase
            .from("books")
            .select(
              `
              *,
              languages (
                id,
                name
              ),
              book_categories (
                categories (
                  id,
                  name
                )
              )
            `
            )
            .eq("id", id)
            .single(),
          categoriesStatus === "idle"
            ? dispatch(
                fetchCategories({
                  isPro: hasProOrStudio,
                })
              ).unwrap()
            : Promise.resolve(),
          languagesStatus === "idle"
            ? dispatch(fetchLanguages()).unwrap()
            : Promise.resolve(),
        ]);

        const { data: book, error: bookError } = bookData;
        if (bookError) throw bookError;

        // Get chapter count
        const { data: chapters, error: chaptersError } = await supabase
          .from("chapters")
          .select("id")
          .eq("book_id", id);

        if (chaptersError) throw chaptersError;

        // Transform book data for form
        setFormData({
          title: book.title,
          authorName: book.author_name,
          isbn: book.isbn || "",
          cover_url: book.cover_url || "",
          synopsis: book.synopsis || "",
          status: book.status as Status,
          language: {
            value: book.languages.id,
            label: book.languages.name,
          },
          categories: book.book_categories.map((bc: BookCategory) => ({
            value: bc.categories.id,
            label: bc.categories.name,
          })),
        });

        setBookStats({
          chapterCount: chapters?.length || 0,
          wordCount: 0, // This would need to be calculated from chapter content
          createdAt: book.created_at,
          updatedAt: book.updated_at,
        });
      } catch (err) {
        console.error("Error loading book details:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load book details",
        });
        navigate("/workspace");
      } finally {
        setLoading(false);
      }
    }

    if (subscriptionStatus === "success") {
      fetchData();
    }
  }, [
    id,
    navigate,
    toast,
    categoriesStatus,
    languagesStatus,
    dispatch,
    hasProOrStudio,
    subscriptionStatus,
  ]);

  const handleFileSelect = async (file: File) => {
    try {
      setCoverLoading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${id}/cover.${fileExt}`;

      // Delete existing cover if any
      if (formData.cover_url) {
        const oldFileName = formData.cover_url.split("/").pop();
        if (oldFileName) {
          await supabase.storage
            .from("covers")
            .remove([`${id}/${oldFileName}`]);
        }
      }

      // Upload new cover
      const { error: uploadError } = await supabase.storage
        .from("covers")
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // Update book cover URL in database
      const { error: updateError } = await supabase
        .from("books")
        .update({ cover_url: fileName })
        .eq("id", id);

      if (updateError) throw updateError;

      setFormData({ ...formData, cover_url: fileName });

      // Update the book in the Redux store
      dispatch(
        updateBookInList({
          bookId: id!,
          updates: { cover_url: fileName },
        })
      );

      toast({
        title: "Success",
        description: "Cover image updated successfully",
      });
    } catch (error) {
      console.error("Error uploading cover image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload cover image",
      });
    } finally {
      setCoverLoading(false);
    }
  };

  const handleDeleteCover = async () => {
    try {
      if (formData.cover_url) {
        const fileName = formData.cover_url.split("/").pop();
        if (fileName) {
          // Delete file from storage
          const { error: deleteError } = await supabase.storage
            .from("covers")
            .remove([`${id}/${fileName}`]);

          if (deleteError) throw deleteError;
        }
      }

      // Update book cover URL in database
      const { error: updateError } = await supabase
        .from("books")
        .update({ cover_url: null })
        .eq("id", id);

      if (updateError) throw updateError;

      setFormData({ ...formData, cover_url: "" });

      // Update the book in the Redux store
      dispatch(
        updateBookInList({
          bookId: id!,
          updates: { cover_url: null },
        })
      );

      toast({
        title: "Success",
        description: "Cover image removed successfully",
      });
    } catch (error) {
      console.error("Error removing cover image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove cover image",
      });
    }
  };

  const validateForm = () => {
    const errors = {
      title: !formData.title.trim(),
      authorName: !formData.authorName.trim(),
      categories: formData.categories.length === 0,
      language: !formData.language,
    };
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    setSaving(true);

    try {
      // Update book details
      const { error: bookError } = await supabase
        .from("books")
        .update({
          title: formData.title,
          author_name: formData.authorName,
          isbn: formData.isbn || null,
          synopsis: formData.synopsis || null,
          language_id: formData.language?.value,
          status: formData.status,
        })
        .eq("id", id);

      if (bookError) throw bookError;

      // Update categories
      const { error: deleteError } = await supabase
        .from("book_categories")
        .delete()
        .eq("book_id", id);

      if (deleteError) throw deleteError;

      if (formData.categories.length > 0) {
        const { error: categoriesError } = await supabase
          .from("book_categories")
          .insert(
            formData.categories.map((category) => ({
              book_id: id,
              category_id: category.value,
            }))
          );

        if (categoriesError) throw categoriesError;
      }

      // Update bookStats with new updated_at time
      const newUpdatedAt = new Date().toISOString();
      setBookStats({
        ...bookStats,
        updatedAt: newUpdatedAt,
      });

      // Update the book in the Redux store
      dispatch(
        updateBookInList({
          bookId: id!,
          updates: {
            title: formData.title,
            author_name: formData.authorName,
            synopsis: formData.synopsis || undefined,
            status: formData.status,
            languages: languages.find(
              (lang) => lang.id === formData.language?.value
            )!,
            categories: formData.categories.map(
              (cat) => categories.find((category) => category.id === cat.value)!
            ),
            updated_at: newUpdatedAt,
          },
        })
      );

      setIsEditMode(false);

      toast({
        title: "Success",
        description: "Book details updated successfully",
      });
    } catch (error) {
      console.error("Error updating book details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update book details",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleArchiveToggle = async () => {
    try {
      const newStatus = formData.status === "archived" ? "draft" : "archived";

      const { error } = await supabase
        .from("books")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setFormData({ ...formData, status: newStatus });

      // Update the book in the Redux store
      dispatch(
        updateBookInList({
          bookId: id!,
          updates: { status: newStatus },
        })
      );

      toast({
        title: "Success",
        description: `Book ${
          newStatus === "archived" ? "archived" : "unarchived"
        } successfully`,
      });
    } catch (error) {
      console.error("Error archiving book:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${
          formData.status === "archived" ? "unarchive" : "archive"
        } book`,
      });
    }
  };

  const handleStatusChange = async (newStatus: Status) => {
    try {
      const { error } = await supabase
        .from("books")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setFormData({ ...formData, status: newStatus });

      // Update the book in the Redux store
      dispatch(
        updateBookInList({
          bookId: id!,
          updates: { status: newStatus },
        })
      );

      toast({
        title: "Success",
        description: `Book status changed to ${newStatus} successfully`,
      });
    } catch (error) {
      console.error("Error changing book status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to change book status to ${newStatus}`,
      });
    }
  };

  const handlePublishBook = async () => {
    try {
      await handleStatusChange("published");
      setShowPublishDialog(false);
    } catch (error) {
      console.error("Error publishing book:", error);
    }
  };

  const handleUnpublishBook = async () => {
    try {
      await handleStatusChange("draft");
      setShowUnpublishDialog(false);
    } catch (error) {
      console.error("Error unpublishing book:", error);
    }
  };

  const downloadExportedFile = async (
    filePath: string,
    format: "epub" | "pdf" | "docx"
  ) => {
    const { data, error } = await supabase.storage
      .from("book-files")
      .download(filePath);

    if (error) {
      console.error("Error downloading File", error);
      throw new Error("Error downloading File");
    }

    const blob = new Blob([data], {
      type:
        format === "epub"
          ? "application/epub+zip"
          : format === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.title}.${format}`;
    link.click();
  };

  const handleExport = async (format: "epub" | "pdf" | "docx") => {
    if (!id) return;

    try {
      setExporting(format);

      // Call the appropriate API endpoint based on the format
      const endpoint = `${
        import.meta.env.VITE_PYTHON_API_URL
      }/generate-${format}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ bookId: id }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to generate ${format.toUpperCase()}: ${response.statusText}`
        );
      }

      const result = await response.json();

      if (!result.fileUrl) {
        throw new Error("No file URL returned from the server");
      }

      // Get the file from Supabase storage
      downloadExportedFile(result.fileUrl, format);

      toast({
        title: "Export Complete",
        description: `Your book has been exported to ${format.toUpperCase()} format.`,
      });
    } catch (error) {
      console.error(`Error exporting to ${format}:`, error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description:
          error instanceof Error
            ? error.message
            : `Failed to export to ${format.toUpperCase()}`,
      });
    } finally {
      setExporting(null);
    }
  };

  const handleDeleteBook = async () => {
    try {
      await dispatch(deleteBook(id!)).unwrap();
      navigate("/workspace");
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete book",
      });
    }
  };

  const cancelEdit = () => {
    // Reset form errors
    setFormErrors({
      title: false,
      authorName: false,
      categories: false,
      language: false,
    });

    // Exit edit mode
    setIsEditMode(false);
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>ProsePilot</title>
        </Helmet>
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-8">
              <div>
                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-9 bg-gray-200 rounded"></div>
                  <div className="h-9 bg-gray-200 rounded"></div>
                  <div className="h-9 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-9 bg-gray-200 rounded"></div>
                    <div className="h-9 bg-gray-200 rounded"></div>
                    <div className="h-9 bg-gray-200 rounded"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  const isPublished = formData.status === "published";
  const hasError = formData.status === "error";

  return (
    <>
      <Helmet>
        <title>ProsePilot - {formData.title}</title>
      </Helmet>
      <div className="min-h-screen bg-base-background">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Back Button and Book Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/workspace")}
                className="flex items-center text-base-heading hover:text-base-heading/80 transition-colors mr-4"
              >
                <ArrowLeft className="mr-2" size={20} />
                <span className="font-medium">Back to Books</span>
              </button>
            </div>

            {!isEditMode && !isPublished && (
              <Button
                onClick={() => setIsEditMode(true)}
                className="flex items-center gap-2"
              >
                <Edit3 size={16} />
                Edit Book Details
              </Button>
            )}
          </div>

          {/* Alert Banners */}
          {isPublished && (
            <div className="mb-6 bg-state-success-light border border-state-success rounded-lg p-4 shadow-sm">
              <div className="flex">
                <div className="shrink-0">
                  <BookOpen className="h-5 w-5 text-state-success" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-state-success font-heading">
                    Published Book
                  </h3>
                  <div className="mt-2 text-sm text-state-success">
                    This book is published and ready for export. To make
                    changes, you need to unpublish it first.
                  </div>
                </div>
              </div>
            </div>
          )}

          {hasError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
              <div className="flex">
                <div className="shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 font-heading">
                    Generation Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    We apologize, but there was an error generating your book.
                    Please be assured that no credits have been deducted from
                    your account. You can try generating the book again, or
                    contact our support team if the issue persists.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
            {/* Left Column - Cover and Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* Book Cover */}
                <div className="mb-6 max-w-[300px] mx-auto">
                  {formData.cover_url ? (
                    <div className="relative">
                      <div className="aspect-[10/16] rounded-lg overflow-hidden shadow-lg">
                        <img
                          src={getCoverUrl({ src: formData.cover_url })}
                          alt={formData.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {!isPublished && isEditMode && (
                        <button
                          onClick={handleDeleteCover}
                          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors shadow-md"
                          title="Delete cover image"
                        >
                          <Trash2 className="w-5 h-5 text-state-error" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`${
                        isPublished || isEditMode
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isEditMode ? (
                        <FileUpload
                          onFileSelect={handleFileSelect}
                          className="aspect-[10/16]"
                          loading={coverLoading}
                        />
                      ) : (
                        <div className="aspect-[10/16] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                          <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
                          <p className="text-sm text-gray-600 text-center px-4">
                            No cover image. Click Edit Book to add one.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Book Stats */}
                {!isEditMode && (
                  <div className="space-y-3 mb-6">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider font-heading">
                      Book Stats
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Created</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDistanceToNow(new Date(bookStats.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Updated</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDistanceToNow(new Date(bookStats.updatedAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {!isEditMode && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider font-heading">
                      Actions
                    </h3>
                    <div className="space-y-2">
                      {/* Publish/Unpublish Button */}
                      {formData.status !== "published" &&
                        formData.status !== "archived" &&
                        formData.status !== "error" && (
                          <Button
                            onClick={() => setShowPublishDialog(true)}
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 bg-state-success-light text-state-success hover:bg-state-success-light hover:text-state-success border-state-success"
                          >
                            <BookOpen className="w-4 h-4" />
                            Publish Book
                          </Button>
                        )}

                      {/* Export Button - Only show when published */}
                      {formData.status === "published" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full flex items-center justify-center gap-2"
                              disabled={!!exporting}
                            >
                              {exporting ? (
                                <>
                                  <span className="animate-spin mr-2">
                                    <svg
                                      className="w-4 h-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                  </span>
                                  Exporting {exporting.toUpperCase()}...
                                </>
                              ) : (
                                <>
                                  <Download className="w-4 h-4" />
                                  Export Book
                                  <ChevronDown className="w-4 h-4 ml-auto" />
                                </>
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem
                              onClick={() => handleExport("epub")}
                              className="cursor-pointer"
                            >
                              <BookText className="w-4 h-4 mr-2" />
                              <span>Export as EPUB</span>
                            </DropdownMenuItem>
                            {hasProOrStudio && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleExport("pdf")}
                                  className="cursor-pointer"
                                >
                                  <FileText className="w-4 h-4 mr-2" />
                                  <span>Export as PDF</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleExport("docx")}
                                  className="cursor-pointer"
                                >
                                  <FileType className="w-4 h-4 mr-2" />
                                  <span>Export as DOCX</span>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}

                      {formData.status === "published" && (
                        <Button
                          onClick={() => setShowUnpublishDialog(true)}
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-700 border-yellow-200"
                        >
                          <Edit3 className="w-4 h-4" />
                          Unpublish for Editing
                        </Button>
                      )}

                      {formData.status !== "published" && (
                        <Button
                          onClick={handleArchiveToggle}
                          variant="outline"
                          className={`w-full flex items-center justify-center gap-2 ${
                            formData.status === "archived" &&
                            "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-700 border-blue-200"
                          }`}
                        >
                          <Archive className="w-4 h-4" />
                          {formData.status === "archived"
                            ? "Unarchive Book"
                            : "Archive Book"}
                        </Button>
                      )}

                      {formData.status === "archived" && (
                        <Button
                          onClick={() => setShowDeleteDialog(true)}
                          variant="destructive"
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Permanently Delete Book
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Book Details and Chapters */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  {isEditMode ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Label
                          htmlFor="title"
                          className="flex items-center gap-1 mb-1 text-gray-700"
                        >
                          Book Title
                          <span className="text-state-error">*</span>
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => {
                            setFormData({ ...formData, title: e.target.value });
                            setFormErrors({ ...formErrors, title: false });
                          }}
                          className={`bg-white ${
                            formErrors.title
                              ? "border-state-error focus:ring-state-error"
                              : ""
                          }`}
                        />
                        {formErrors.title && (
                          <p className="mt-1 text-sm text-state-error">
                            Title is required
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="authorName"
                          className="flex items-center gap-1 mb-1 text-gray-700"
                        >
                          Author Name
                          <span className="text-state-error">*</span>
                        </Label>
                        <Input
                          id="authorName"
                          value={formData.authorName}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              authorName: e.target.value,
                            });
                            setFormErrors({ ...formErrors, authorName: false });
                          }}
                          className={`bg-white ${
                            formErrors.authorName
                              ? "border-state-error focus:ring-state-error"
                              : ""
                          }`}
                        />
                        {formErrors.authorName && (
                          <p className="mt-1 text-sm text-state-error">
                            Author name is required
                          </p>
                        )}
                      </div>

                      {/* <div>
                        <Label
                          htmlFor="isbn"
                          className="flex items-center gap-1 mb-1 text-gray-700"
                        >
                          ISBN
                        </Label>
                        <Input
                          id="isbn"
                          value={formData.isbn}
                          onChange={(e) =>
                            setFormData({ ...formData, isbn: e.target.value })
                          }
                          className="bg-white"
                          placeholder="Enter ISBN (optional)"
                        />
                      </div> */}

                      <div>
                        <Label
                          htmlFor="categories"
                          className="flex items-center gap-1 mb-1 text-gray-700"
                        >
                          Categories
                          <span className="text-state-error">*</span>
                        </Label>
                        <CustomSelect
                          id="categories"
                          isMulti
                          value={formData.categories}
                          onChange={(newValue) => {
                            setFormData({
                              ...formData,
                              categories: newValue as SelectOption[],
                            });
                            setFormErrors({ ...formErrors, categories: false });
                          }}
                          options={mapToSelectOptions(categories, "category")}
                          placeholder="Select categories..."
                          error={
                            formErrors.categories
                              ? "At least one category is required"
                              : undefined
                          }
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="language"
                          className="flex items-center gap-1 mb-1 text-gray-700"
                        >
                          Language
                          <span className="text-state-error">*</span>
                        </Label>
                        <CustomSelect
                          id="language"
                          value={formData.language}
                          onChange={(newValue) => {
                            setFormData({
                              ...formData,
                              language: newValue as SelectOption,
                            });
                            setFormErrors({ ...formErrors, language: false });
                          }}
                          options={mapToSelectOptions(languages, "language")}
                          placeholder="Select language..."
                          error={
                            formErrors.language
                              ? "Language is required"
                              : undefined
                          }
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="synopsis"
                          className="flex items-center gap-1 mb-1 text-gray-700"
                        >
                          Synopsis
                        </Label>
                        <textarea
                          id="synopsis"
                          value={formData.synopsis}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              synopsis: e.target.value,
                            })
                          }
                          rows={6}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary"
                          placeholder="Enter a brief summary of your book..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.synopsis.length}/2000 characters
                        </p>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelEdit}
                          className="flex items-center gap-2"
                        >
                          <X size={16} />
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex items-center gap-2"
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <span className="animate-spin">
                                <svg
                                  className="w-4 h-4\"
                                  xmlns="http://www.w3.org/2000/svg\"
                                  fill="none\"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25\"
                                    cx="12\"
                                    cy="12\"
                                    r="10\"
                                    stroke="currentColor\"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                              </span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={16} />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-8">
                      {/* Book Title and Author */}
                      <div>
                        <div className="flex items-start justify-between">
                          <h1 className="text-3xl font-bold text-base-heading mb-2 font-heading">
                            {formData.title}
                          </h1>
                          <StatusBadge status={formData.status} />
                        </div>
                        <div className="flex items-center text-gray-600">
                          <User className="w-4 h-4 mr-1" />
                          <span>By {formData.authorName}</span>
                        </div>
                      </div>

                      {/* Book Metadata */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 font-heading">
                              Categories
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {formData.categories.length > 0 ? (
                                formData.categories.map((category) => (
                                  <span
                                    key={category.value}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-primary/10 text-base-heading"
                                  >
                                    <Tag className="w-3 h-3 mr-1" />
                                    {category.label}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-500 text-sm">
                                  No categories selected
                                </span>
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 font-heading">
                              Language
                            </h3>
                            <div className="flex items-center text-gray-700">
                              <Globe className="w-4 h-4 mr-2" />
                              <span>
                                {formData.language?.label || "Not specified"}
                              </span>
                            </div>
                          </div>

                          {/* {formData.isbn && (
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                                ISBN
                              </h3>
                              <p className="text-gray-700">{formData.isbn}</p>
                            </div>
                          )} */}
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 font-heading">
                            Synopsis
                          </h3>
                          {formData.synopsis ? (
                            <p className="text-gray-700 whitespace-pre-line">
                              {formData.synopsis}
                            </p>
                          ) : (
                            <div className="flex items-start gap-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <Info className="w-5 h-5 text-gray-400 mt-0.5" />
                              <p className="text-sm text-gray-500">
                                No synopsis available. Click "Edit Book" to add
                                a synopsis that will help readers understand
                                what your book is about.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!isEditMode && (
                <ChapterList bookId={id!} isPublished={isPublished} />
              )}
            </div>
          </div>

          {/* Delete Book Dialog */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Delete Book</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{formData.title}"? This
                  action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 font-heading">
                      Warning
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          All chapters and content will be permanently deleted
                        </li>
                        <li>All annotations and comments will be lost</li>
                        <li>This action cannot be reversed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                  className="bg-white hover:bg-gray-50 hover:text-gray-900 border-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteBook}
                  className="bg-state-error hover:bg-red-600 text-white"
                >
                  Delete Book
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Publish Book Dialog */}
          <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Publish Book</DialogTitle>
                <DialogDescription>
                  Are you sure you want to publish "{formData.title}"? Once
                  published, the book will be locked for editing.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 font-heading">
                      Publishing Information
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Publishing will lock the book for editing</li>
                        <li>
                          You'll be able to export the book in various formats
                        </li>
                        <li>
                          You can unpublish the book later if you need to make
                          changes
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setShowPublishDialog(false)}
                  className="bg-white hover:bg-gray-50 hover:text-gray-900 border-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePublishBook}
                  className="bg-state-success hover:bg-state-success-light text-white"
                >
                  Publish Book
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Unpublish Book Dialog */}
          <Dialog
            open={showUnpublishDialog}
            onOpenChange={setShowUnpublishDialog}
          >
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Unpublish Book</DialogTitle>
                <DialogDescription>
                  Are you sure you want to unpublish "{formData.title}"? This
                  will allow you to make edits to the book.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 font-heading">
                      Note
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Unpublishing will change the book status to "draft" and
                        allow you to make changes. You'll need to publish it
                        again when you're done editing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setShowUnpublishDialog(false)}
                  className="bg-white hover:bg-gray-50 hover:text-gray-900 border-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUnpublishBook}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Unpublish Book
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
