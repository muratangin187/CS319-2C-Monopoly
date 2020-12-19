import React from 'react';
import {Card, H3, H5, Elevation, InputGroup, Button} from "@blueprintjs/core";

const messages = [
    {sendBy: "username", message: "message text"},
    {sendBy: "username - 2", message: "message text - 2"},
];

export default function Chat() {

    const styles = {
        card: {
            height: 700,
            display: "grid",
            gridTemplateRows: "[header-start] 40px [header-end-msg-start] auto [msg-end-footer-start] 40px [footer-end]",
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
        },
        chat_footer: {
            gridArea: "footer",
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
        />
    );
    return (
        <div className="chat">
            <Card style={styles.card}>
                <div className="chat_header" style={styles.chat_header}>
                    <H3>CHAT</H3>
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
                    />
                </div>
            </Card>
        </div>
    );
}
