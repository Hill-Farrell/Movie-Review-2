import './App.css';
// import './App.scss';
// import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from "react";
import {LeaveReview} from './Form.js';
import Navbar from './components/Navbar.js';
import {Routes, Route} from "react-router-dom";

function MovieList(props){
  const removeItem = async (title) => {

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("title", title);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };

  try{
    let response = await fetch("/api/removeMovie", requestOptions)
    let text = await response.text();
    console.log(text)
    props.setMovies(props.fav_movies.filter(movieElement => movieElement.title != title))
  }
  catch (e){
      console.log('error', e)
  }
  }

  return (
    <>
    <ul className='mov'>
      {
        props.fav_movies.map(movie => {
            return <li>{movie.title}<br />
            Release: {movie.release}<br />
            Actors: {movie.actors}<br />
            <img height={200}
            src={movie.image} ></img><br />
            Rating: {movie.rating}<br />
              
            <button onClick = {() => removeItem(movie.title)}>Remove</button><br /><br />

        </li> }
        )
      }
    </ul>
    </>
  )
}

function App() {

  let [movies, setMovies] = useState(null);

  useEffect( () => {
    console.log("Loading Data..");
    fetch("/api/movies")
    .then(response => response.json())
    .then(setMovies)
    .catch(e => console.log(e.message)) 
  }, [])

  if(movies == null){
    return <h1>Loading....</h1>;
  }
  console.log(movies)

  return (
  <>
    <Navbar />
      <div className="container">
        <Routes>
          <Route path = "/" element = {<MovieList fav_movies = {movies} setMovies={setMovies}/>}/>
          <Route path = "/review" element = {<LeaveReview movies = {movies} setMovies = {setMovies}/>}/>
        </Routes>
      </div>
  </>
  )
}

export default App;
