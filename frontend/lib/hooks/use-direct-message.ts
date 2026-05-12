import { useCallback } from "react";
import { useWebSocket } from "../contexts/websocket-context";

export function useDirectMessage() {
  const { sendMessage } = useWebSocket();

  const sendDM = useCallback(
    (recipientId: string, text: string) => {
      sendMessage({ type: "direct_message", recipientId, text });
    },
    [sendMessage]
  );

  return { sendDM };
}
