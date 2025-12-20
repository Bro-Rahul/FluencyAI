import { useEffect, useRef, useState } from "react"



const useSocket = (url: string) => {
    const socketRef = useRef<WebSocket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    useEffect(() => {
        if (socketRef.current) return;
        const socket = new WebSocket(`${process.env['NEXT_PUBLIC_WEBSOCKET_BASEURL']}${url}`)
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("WebSocket connected");
        };

        socket.onmessage = (event) => {
            setMessages(pre => [...pre, JSON.parse(event.data)])
        };

        socket.onerror = (err) => {
            console.error("WebSocket error", err);
        };

        socket.onclose = () => {
            console.log("WebSocket closed");
            socketRef.current = null;
        };

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, []);

    return {
        messages
    }
}

export default useSocket