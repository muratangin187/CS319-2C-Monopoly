import React, {useEffect, useState} from 'react';
import {Card, H5, Elevation, InputGroup, Button, H4} from "@blueprintjs/core";
const {ipcRenderer} = require("electron");

export default function Chat(props) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    function sendMessage(messageObj){
        ipcRenderer.send('send_message_fb', messageObj);
    }

    useEffect(() => {
        function getMessagesListener(event, messages) {
            console.log("Messages are set to:");
            console.log(messages);
            setMessages(messages);
        }

        function sendMessageListener(event, successMsg){
            console.log("State message: ");
            console.log(successMsg);
        }

        //listen
        ipcRenderer.on('get_messages_bf', getMessagesListener);
        ipcRenderer.on('send_message_bf', sendMessageListener);

        //send
        ipcRenderer.send('get_messages_fb');

        return () => {
            ipcRenderer.removeListener('get_messages_bf', getMessagesListener);
            ipcRenderer.removeListener('send_message_bf', sendMessageListener);
        };
    }, []);

    const styles = {
        card: {
            height: 700,
            display: "grid",
            gridTemplateRows: "[header-start] 40px [header-end-msg-start] auto [msg-end-footer-start] 48px [footer-end]",
            gridTemplateAreas: `
                "header"
                "main"
                "footer"
            `
        },
        chat_header: {
            gridArea: "header",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },

        chat_body: {
            gridArea: "main",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
        },
        chat_footer: {
            gridArea: "footer",
            marginTop: 8,
        },
        message: {
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            margin: 8,
            padding: 0,
        }
    };

    const sendButton = (
        <Button
            icon="send-message"
            minimal={true}
            onClick={() => sendMessage({sendBy: props.currentUser.username, message: message})}
        />
    );

    return (
        <div className="chat">
            <Card style={styles.card}>
                <div className="chat_header" style={styles.chat_header}>
                    <H4>Chat (Room: {props.roomName})</H4>
                </div>
                <div className="chat_body" style={styles.chat_body}>
                    {messages.map((msgObj) => {
                        return (
                            <Card interactive={true} elevation={Elevation.TWO} style={styles.message}>
                                <H5 style={{marginLeft: 8, marginTop: 8}}>{msgObj.sendBy}</H5>
                                <p style={{alignSelf: "center"}}>{msgObj.message}</p>
                            </Card>
                        );
                    })}
                </div>
                <div className="chat_footer" style={styles.chat_footer}>
                    <InputGroup
                        large={true}
                        placeholder="Send a message"
                        rightElement={sendButton}
                        type="text"
                        onChange={event => {
                            setMessage(event.target.value);
                        }}
                    />
                </div>
            </Card>
        </div>
    );
}
