import { useState, useCallback } from "react";

type ToastType = "error" | "success";

export function useToast() {
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [type, setType] = useState<ToastType>("error");

  const show = useCallback((msg: string, toastType: ToastType = "error") => {
    setIsVisible(false);
    setTimeout(() => {
      setMessage(msg);
      setType(toastType);
      setIsVisible(true);
    }, 10);
  }, []);

  const hide = useCallback(() => setIsVisible(false), []);

  return { message, isVisible, type, show, hide };
}
