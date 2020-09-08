import React, { FC, useState } from 'react'
import { Socket } from 'socket.io-client'
import { createContext } from "react";

interface SocketContextProps {
    socket: typeof Socket | null
    setSocket: React.Dispatch<React.SetStateAction<SocketIOClient.Socket | null>>
}

export const SocketContext = createContext<SocketContextProps>({
    socket: null,
    setSocket: () => {}
});

interface SocketContextProviderProps {
    children?: any
}

const SocketContextProvider: FC<SocketContextProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<typeof Socket | null>(null);

    return (
        <SocketContext.Provider value={{ socket, setSocket }}>
            { children }
        </SocketContext.Provider>
    );
}

export default SocketContextProvider;