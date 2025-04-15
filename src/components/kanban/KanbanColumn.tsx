
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { KanbanStatus } from "@/components/kanban/KanbanBoard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KanbanColumnProps {
  title: string;
  description: string;
  status: KanbanStatus;
  count: number;
  onAddClick: () => void;
  children: React.ReactNode;
  onDragOver?: React.DragEventHandler<HTMLDivElement>;
  onDrop?: React.DragEventHandler<HTMLDivElement>;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  description,
  status,
  count,
  onAddClick,
  children,
  onDragOver,
  onDrop,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 sticky top-0 z-10 bg-card">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium">
              {title}
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              {description}
            </CardDescription>
          </div>
          <div className="rounded-full bg-gray-100 dark:bg-gray-800 w-6 h-6 flex items-center justify-center">
            <span className="text-xs font-medium">{count}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent 
        className="flex-1 overflow-hidden p-3"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="flex flex-col space-y-2 min-h-[200px] pr-2">
            {children}
            <Button 
              variant="ghost" 
              className="flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 w-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={onAddClick}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add task
            </Button>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default KanbanColumn;
