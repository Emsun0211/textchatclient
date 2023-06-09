import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./component/Chat";

// const socket = io.connect("http://localhost:5000");
const socket = io.connect("https://textchatserver.onrender.com");

function App() {
	const [username, setusername] = useState("");
	const [room, setRoom] = useState("");
	const [showChat, setShowChat] = useState(false);

	const joinRoom = () => {
		if (room !== "" && username !== "") {
			socket.emit("join_room", room);
			setShowChat(true);
		}
	};

	return (
		<div className='App'>
			{!showChat ? (
				<div className='joinChatContainer'>
					<h3>Join Chat</h3>
					<input
						type='text'
						placeholder='John..'
						onChange={(e) => setusername(e.target.value)}
					/>
					<input
						type='text'
						placeholder='Room ID'
						onChange={(e) => setRoom(e.target.value)}
					/>
					<button onClick={joinRoom}>Join A room</button>
				</div>
			) : (
				<Chat socket={socket} username={username} room={room} />
			)}
		</div>
	);
}

export default App;
