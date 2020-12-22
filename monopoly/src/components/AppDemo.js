import React from 'react'
import socketIOClient from "socket.io-client";

import '../assets/css/App.css'

function AppDemo() {
  const [endPoint, setEndPoint] = React.useState("http://localhost:3000");
  const [data, setData] = React.useState("");

  React.useEffect(() => {
    const socket = socketIOClient(endPoint);
    socket.on("test", data2 => {
      console.log(data2);
      setData(data2);
    });
  }, []);

  return (
    <div>
      <h1>Hello, Electron!</h1>
      <h2>{data}</h2>
      <p>I hope you enjoy using basic-electron-react-boilerplate to start your dev off right!</p>
    </div>
  )
}

export default AppDemo
