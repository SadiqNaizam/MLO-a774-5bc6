import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MoreVertical } from 'lucide-react'; // Example icon for options
import { Button } from '@/components/ui/button';

interface ModularDashboardWidgetProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  // You could add props for actions, loading states, etc.
}

const ModularDashboardWidget: React.FC<ModularDashboardWidgetProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  console.log("Rendering ModularDashboardWidget:", title);
  return (
    <Card className={`w-full h-full flex flex-col ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            {description && <CardDescription className="text-sm">{description}</CardDescription>}
        </div>
        {/* Optional: Add an actions button or dropdown */}
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        {children}
      </CardContent>
      {/* Optional: CardFooter for actions or summaries */}
    </Card>
  );
};

export default ModularDashboardWidget;