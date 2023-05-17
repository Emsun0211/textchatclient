import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = ({ socket, room, username }) => {
	const [currentMsg, setcurrentMsg] = useState("");
	const [messageList, setMessageList] = useState([]);

	const sendMsg = async () => {
		if (currentMsg !== "") {
			const msgData = {
				room: room,
				author: username,
				message: currentMsg,
				time:
					new Date(Date.now()).getHours() +
					":" +
					new Date(Date.now()).getMinutes(),
			};
			await socket.emit("send-message", msgData);
			setMessageList((prevMessage) => [...prevMessage, msgData]);
			setcurrentMsg("");
		}
	};

	useEffect(() => {
		const receiveMessage = (data) => {
			setMessageList((prevMessage) => [...prevMessage, data]);
		};
		socket.on("receive-message", receiveMessage);
		return () => {
			socket.off("receive-message", receiveMessage);
		};
	}, [socket]);

	return (
		<div className='chat-window'>
			<div className='chat-header'>
				<p>Live Chat</p>
				<p>{username}</p>
			</div>
			<div className='chat-body'>
				<ScrollToBottom className='message-container'>
					{messageList.map((msg, idx) => {
						return (
							<div
								className='message'
								id={username === msg.author ? "you" : "other"}>
								<div>
									<div className='message-content'>
										<p>{msg.message}</p>
									</div>
									<div className='message-meta'>
										<p id='time'>{msg.time}</p>
										<p id='author'>{msg.author}</p>
									</div>
								</div>
							</div>
						);
					})}
				</ScrollToBottom>
			</div>
			<div className='chat-footer'>
				<input
					type='text'
					value={currentMsg}
					placeholder='Hey'
					onChange={(e) => setcurrentMsg(e.target.value)}
					onKeyDown={(e) => {
						e.key === "Enter" && sendMsg();
					}}
				/>
				<button onClick={sendMsg}>&#9658;</button>
			</div>
		</div>
	);
};

export default Chat;
