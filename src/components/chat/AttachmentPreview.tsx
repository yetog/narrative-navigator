import { X, FileText } from "lucide-react";
import { ChatAttachment } from "@/types/content";
import { cn } from "@/lib/utils";

interface AttachmentPreviewProps {
  attachments: ChatAttachment[];
  onRemove?: (id: string) => void;
  compact?: boolean;
}

export function AttachmentPreview({ attachments, onRemove, compact }: AttachmentPreviewProps) {
  if (attachments.length === 0) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn(
      "flex flex-wrap gap-2",
      compact ? "p-2" : "p-3 border-t border-border"
    )}>
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className={cn(
            "relative group rounded-lg overflow-hidden border border-border bg-muted/50",
            attachment.type === "image" 
              ? compact ? "w-12 h-12" : "w-20 h-20"
              : "flex items-center gap-2 px-3 py-2"
          )}
        >
          {attachment.type === "image" ? (
            <img
              src={attachment.url}
              alt={attachment.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium truncate max-w-[100px]">
                  {attachment.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {formatFileSize(attachment.size)}
                </p>
              </div>
            </>
          )}

          {/* Remove button */}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(attachment.id)}
              className={cn(
                "absolute bg-destructive text-destructive-foreground rounded-full p-0.5",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                attachment.type === "image" 
                  ? "top-1 right-1"
                  : "-top-1 -right-1"
              )}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
