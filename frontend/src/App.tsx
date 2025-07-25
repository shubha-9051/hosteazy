import { Route,Routes} from "react-router-dom";
import Login from "./components/Login";
import Callback from "./components/Callback";
import User from "./components/User";

export default function  App(){
  return(
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/callback" element={<Callback/>}/>
      <Route path="/user" element={<User/>}/>
    </Routes>
  )
}

