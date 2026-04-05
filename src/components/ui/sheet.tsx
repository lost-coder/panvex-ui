import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Sheet as ModalSheet } from "react-modal-sheet";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: "left" | "right" | "bottom";
  fullScreen?: boolean;
}

const sideStyles = {
  right: "inset-y-0 right-0 h-full w-[320px] border-l",
  left: "inset-y-0 left-0 h-full w-[320px] border-r",
} as const;

// react-modal-sheet handles bottom and fullScreen variants (native swipe physics)
const isMobileVariant = (side: string, fullScreen: boolean) => fullScreen || side === "bottom";

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = "right", fullScreen = false, className, children, ...props }, ref) => {
  const useModalSheet = isMobileVariant(side, fullScreen);

  if (useModalSheet) {
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content ref={ref} asChild {...props}>
          <div className="fixed inset-0 z-50 pointer-events-none">
            <ModalSheet
              isOpen={true}
              onClose={() => {
                const closeButton = document.querySelector(
                  "[data-radix-dialog-close]",
                ) as HTMLElement;
                if (closeButton) closeButton.click();
                else document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
              }}
              detent={fullScreen ? "full" : "content"}
              style={{ pointerEvents: "auto" }}
            >
              <ModalSheet.Backdrop
                onTap={() => {
                  const closeButton = document.querySelector(
                    "[data-radix-dialog-close]",
                  ) as HTMLElement;
                  if (closeButton) closeButton.click();
                  else document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
                }}
              />
              <ModalSheet.Container
                className={cn(
                  "!bg-bg-card border border-border shadow-xl",
                  fullScreen ? "!rounded-none" : "!rounded-t-xl",
                )}
              >
                <ModalSheet.Header className="pt-2 pb-0 flex justify-center w-full">
                  <ModalSheet.DragIndicator className="!mt-2 !mx-auto" />
                </ModalSheet.Header>
                <VisuallyHidden.Root asChild>
                  <DialogPrimitive.Title>Sheet</DialogPrimitive.Title>
                </VisuallyHidden.Root>
                <VisuallyHidden.Root asChild>
                  <DialogPrimitive.Description>Sheet content</DialogPrimitive.Description>
                </VisuallyHidden.Root>
                <ModalSheet.Content className={cn("flex flex-col", className)}>
                  {children}
                </ModalSheet.Content>
              </ModalSheet.Container>
            </ModalSheet>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  }

  // Standard Radix Dialog for side panels (left/right) with slide animation
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-300" />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 bg-bg-card border-border shadow-xl flex flex-col overflow-y-auto",
          "duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out",
          side === "right"
            ? "inset-y-0 right-0 h-full w-[320px] border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right"
            : "inset-y-0 left-0 h-full w-[320px] border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
          className,
        )}
        {...props}
      >
        <VisuallyHidden.Root asChild>
          <DialogPrimitive.Title>Sheet</DialogPrimitive.Title>
        </VisuallyHidden.Root>
        <VisuallyHidden.Root asChild>
          <DialogPrimitive.Description>Sheet content</DialogPrimitive.Description>
        </VisuallyHidden.Root>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});
SheetContent.displayName = DialogPrimitive.Content.displayName;

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1 px-5 py-4 border-b border-border", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-base font-semibold text-fg", className)} {...props} />;
}

function SheetBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 px-5 py-4 overflow-y-auto", className)} {...props} />;
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetBody };
