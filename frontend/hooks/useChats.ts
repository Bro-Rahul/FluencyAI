import { useEffect, useRef, useState } from "react";

const useChats = (client_id: string) => {
    const socketRef = useRef<WebSocket | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!client_id) return;

        let socket: WebSocket | null = new WebSocket(
            `ws://localhost:8000/v1/api/chats/${client_id}`
        );

        socketRef.current = socket;
        setIsReady(false);

        socket.onopen = () => {
            console.log("Connected to Server");
            setIsReady(true);
        };

        socket.onmessage = (ev) => {
            console.log("message:", ev.data);
        };

        socket.onerror = (err) => {
            console.log("ws error:", err);
        };

        socket.onclose = (e) => {
            console.log("ws closed:", e.code, e.reason);
            setIsReady(false);
        };

        return () => {
            socket?.close();
            socketRef.current = null;
        };
    }, [client_id]);

    return { socketRef, isReady };
};

export default useChats;