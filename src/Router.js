import { Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Board from './components/Board';
import BoardDetail from './components/BoardDetail';
import Header from './components/Header';
import Home from './components/Home';
import ListContainer from './components/ListContainer';
import NotFound from './components/NotFound';
import Profile from './components/Profile';
import TestRedux from './components/TestRedux';

function App() {
  return (
    <div className="App">
      <ListContainer />
      {/* <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/board" element={<Board />} />
        <Route path="/board/:boardID" element={<BoardDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes> */}
    </div>
  );
}

export default App;
