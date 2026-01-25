import { useRef } from "react";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatAttachment } from "@/types/content";
import { cn } from "@/lib/utils";

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface AttachmentButtonProps {
  onAttach: (attachment: ChatAttachment) => void;
  disabled?: boolean;
  className?: string;
}

export function AttachmentButton({ onAttach, disabled, className }: AttachmentButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) {
        console.error(`File ${file.name} exceeds 5MB limit`);
        continue;
      }

      const isImage = file.type.startsWith("image/");
      const url = URL.createObjectURL(file);

      const attachment: ChatAttachment = {
        id: generateId(),
        type: isImage ? "image" : "file",
        name: file.name,
        url,
        mimeType: file.type,
        size: file.size,
      };

      onAttach(attachment);
    }

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("h-9 w-9", className)}
        onClick={handleClick}
        disabled={disabled}
        title="Attach file"
      >
        <Paperclip className="w-4 h-4" />
      </Button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
        multiple
        onChange={handleFileChange}
      />
    </>
  );
}
