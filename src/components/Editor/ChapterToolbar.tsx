import React, { useState, useEffect } from 'react';
import { Pencil, History } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface Version {
  id: string;
  createdAt: string;
  content: string;
  isCurrent?: boolean;
}

interface ChapterToolbarProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  versions: Version[];
  onRestore: (version: Version) => void;
  isPublished?: boolean;
}

export function ChapterToolbar({ 
  title, 
  onTitleChange, 
  versions, 
  onRestore,
  isPublished = false 
}: ChapterToolbarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [showVersions, setShowVersions] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);

  useEffect(() => {
    if (versions.length > 0 && !selectedVersion) {
      setSelectedVersion(versions[0]);
    }
  }, [selectedVersion, versions]);

  const handleTitleSave = () => {
    onTitleChange(editedTitle);
    setIsEditing(false);
  };

  const handleRestore = (version: Version) => {
    if (version.isCurrent) return;
    onRestore(version);
    setShowVersions(false);
  };

  return (
    <>
      <div className="flex items-center justify-between bg-white border rounded-lg p-4 mb-4 gap-6">
        <div className="flex items-center gap-4 flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="flex-1"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTitleSave();
                  } else if (e.key === 'Escape') {
                    setIsEditing(false);
                    setEditedTitle(title);
                  }
                }}
              />
              <Button onClick={handleTitleSave}>Save</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditedTitle(title);
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-900 font-heading">{title}</h2>
              {!isPublished && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-brand-accent hover:text-base-heading rounded-md hover:bg-gray-100"
                  title="Edit title"
                >
                  <Pencil size={16} />
                </button>
              )}
            </>
          )}
        </div>
        {versions.length > 0 && (
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowVersions(true)}
          >
            <History size={16} />
            v{versions.length}
          </Button>
        )}
      </div>

      <Dialog open={showVersions} onOpenChange={setShowVersions}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle className="font-heading">Version History</DialogTitle>
          </DialogHeader>
          <div className="flex gap-6 mt-4 h-[600px]">
            {/* Versions List */}
            <div className="w-64 border-r pr-4 overflow-y-auto">
              <div className="space-y-2">
                {versions.map((version, index) => (
                  <button
                    key={version.id}
                    onClick={() => setSelectedVersion(version)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedVersion?.id === version.id
                        ? 'bg-brand-accent text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium font-copy">
                        Version {versions.length - index}
                      </div>
                      {version.isCurrent && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-brand-primary text-white rounded-full font-copy">
                          Current
                        </span>
                      )}
                    </div>
                    <div className={`text-sm ${
                      selectedVersion?.id === version.id
                        ? 'text-white/80'
                        : 'text-gray-500'
                    } font-copy`}>
                      {new Date(version.createdAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Version Content */}
            <div className="flex-1 overflow-y-auto">
              {selectedVersion ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold font-heading">
                        Version from {new Date(selectedVersion.createdAt).toLocaleString()}
                      </h3>
                      <p className="text-sm text-gray-500 font-copy">
                        {selectedVersion.isCurrent 
                          ? "This is the current version"
                          : "Select this version to restore your content to this point"}
                      </p>
                    </div>
                    {!selectedVersion.isCurrent && (
                      <Button
                        onClick={() => handleRestore(selectedVersion)}
                        variant="outline"
                      >
                        Restore This Version
                      </Button>
                    )}
                  </div>
                  <div className="prose prose-sm max-w-none border rounded-lg p-6 bg-gray-50 text-base-paragraph">
                    <div dangerouslySetInnerHTML={{ __html: selectedVersion.content }} />
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 font-copy">
                  Select a version to preview its content
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}