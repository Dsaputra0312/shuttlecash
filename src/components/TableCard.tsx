import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { cn } from "./ui/utils";

type TableCardProps = {
  header: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
};

export function TableCard({
  header,
  children,
  className,
  headerClassName,
  contentClassName,
}: TableCardProps) {
  return (
    <Card
      className={cn(
        "shadow-xl border-none overflow-hidden bg-white/60 backdrop-blur-sm ring-1 ring-primary/10",
        className
      )}
    >
      <CardHeader
        className={cn(
          "bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10 pb-6",
          headerClassName
        )}
      >
        {header}
      </CardHeader>
      <CardContent className={cn("p-0", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
