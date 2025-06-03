import { format, isToday, isYesterday, parseISO } from "date-fns";

interface ChatDateDividerProps {
  date: string;
}

export function ChatDateDivider({ date }: ChatDateDividerProps) {
  const dateObj = parseISO(date);

  const formatDate = () => {
    if (isToday(dateObj)) {
      return "Today";
    } else if (isYesterday(dateObj)) {
      return "Yesterday";
    } else {
      return format(dateObj, "EEEE, MMMM d");
    }
  };

  return (
    <div className="flex items-center justify-center my-4">
      <div className="h-px bg-border flex-1" />
      <span className="px-3 text-xs text-muted-foreground">{formatDate()}</span>
      <div className="h-px bg-border flex-1" />
    </div>
  );
}
