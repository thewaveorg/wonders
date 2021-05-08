import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


// pages
import Home from './pages/Home';

// components
import Nav from "./components/nav.tsx";

import './App.global.css';
import './styles/normalize.css';



export default class App extends React.Component {
  state: any;
  constructor(props: any) {
    super(props);
    this.state = {
      tab: "home"
    }
  }
  render() {
    return (
      <>
      <div className="MenuBar">
        <p className="MenuP">Wonders!</p>
        <div className="MenuButtons">
          <button className="MenuBtn" style={{backgroundColor: "#FF605C"}} onClick={() => window.close()}></button>
          <button className="MenuBtn" style={{backgroundColor: "#FFBD44"}} onClick={() => window.moveTo( -100000, -100000 )}></button>
          <button className="MenuBtn" style={{backgroundColor: "#00CA4E"}}></button>
        </div>
      </div>
      <Nav cb={(data: string) => this.switchTab(data)}/>
      <Router>
        <Switch>
          <Route path="/" component={() => <Home tab={this.state.tab}/>} />
        </Switch>
      </Router>
    </>
    )
  }

  switchTab(data: string) {
    this.setState({tab: data})
  }
}

// export default function App() {
//   return (
//     <>
//       <div className="MenuBar">
//         <p className="MenuP">Wonders!</p>
//         <div className="MenuButtons">
//           <button className="MenuBtn" style={{backgroundColor: "#FF605C"}} onClick={() => window.close()}></button>
//           <button className="MenuBtn" style={{backgroundColor: "#FFBD44"}} onClick={() => window.moveTo( -100000, -100000 )}></button>
//           <button className="MenuBtn" style={{backgroundColor: "#00CA4E"}}></button>
//         </div>
//       </div>
//       <nav />
//       <Router>
//         <Switch>
//           <Route path="/">
//             <Home />
//           </Route>
//         </Switch>
//       </Router>
//     </>
//   );
// }
