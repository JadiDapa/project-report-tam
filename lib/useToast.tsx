import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";

export const useCustomToast = () => {
  const toast = useToast();

  const showToast = (title: string, description: string, duration = 3000) => {
    const toastId = `toast-${Math.random().toString(36).substr(2, 9)}`; // Generate a unique string
    if (!toast.isActive(toastId)) {
      toast.show({
        id: toastId,
        placement: "top",
        duration,
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toast nativeID={uniqueToastId} action="muted" variant="solid">
              <ToastTitle>{title}</ToastTitle>
              <ToastDescription>{description}</ToastDescription>
            </Toast>
          );
        },
      });
    }
  };

  return { showToast };
};
