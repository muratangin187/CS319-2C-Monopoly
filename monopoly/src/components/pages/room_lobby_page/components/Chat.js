import React from 'react';

export default function PlayerList() {
    const [messages, setMessages] = React.useState(
        [
                    {
                        senderId: "perborgen",
                        text: "who'll win?"
                    },
                    {
                        senderId: "janedoe",
                        text: "who'll win?"
                    }
                ]
    );

    return (
            <div>
                <p>Chat</p>
                <ul style={{listStyle: "none"}}>
                    {messages.map(message => {
                        return (
                            <li key={message.id} style={{backgroundColor: "lightgrey", border: "1px solid black", borderRadius: 20,padding: 10,marginBottom: 10,
                            }}>
                                <div style={{borderBottom: "1px solid black", padding: "5px", marginBottom: "10px"}}>
                                    {message.senderId}
                                </div>
                                <div style={{paddingLeft: "20px"}}>
                                    {message.text}
                                </div>
                            </li>
                        )
                    })}
                </ul>
                <form>
                    <input
                        placeholder="Type your message and hit ENTER"
                        type="text"
                        style={{padding: 20, borderRadius: 20, width: "50vw"}}/>
                </form>
            </div>
        );
}
