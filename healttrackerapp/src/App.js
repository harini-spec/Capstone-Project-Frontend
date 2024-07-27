import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import DashBoard from './Components/DashBoard';
import './Styles/MainStyles.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 

function App() {
  return (
    <div className="App">
      {/* <NavBar /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/DashBoard" element={<DashBoard/>}/>
          {/* <Route path="/" element={<MoviesComponent movies={movies} getMovies={getMovies} setMovies={setMovies}/>}/> */}
          {/* <Route path="/addMovie" element={<AddMovieComponent/>}/>
          <Route path = "/updateMovie/:id" element={<UpdateMovieComponent/>}/> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
