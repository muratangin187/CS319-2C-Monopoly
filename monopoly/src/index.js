import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
import 'react-chat-widget/lib/styles.css';
import "@blueprintjs/core/lib/css/blueprint.css";
import 'react-dice-complete/dist/react-dice-complete.css'
import "./assets/css/App.css";

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div')

root.id = 'root'
document.body.appendChild(root)

// Now we can render our application into it
render(<App />, document.getElementById('root'))
