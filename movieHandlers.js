const { addListener } = require("nodemon");
const database = require("./database")
const movies = [
  {
    id: 1,
    title: "Citizen Kane",
    director: "Orson Wells",
    year: "1941",
    colors: false,
    duration: 120,
  },
  {
    id: 2,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: "1972",
    colors: true,
    duration: 180,
  },
  {
    id: 3,
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: "1994",
    color: true,
    duration: 180,
  },
];

const getMovies = (req, res) => {

  const sql = "select * from movies"
  const sqlValues = []

  if(req.query.color != null){
    sql += "where color = ?";
    sqlValues.push(req.query.color);

  }
if(req.query.max_duration != null){
  sql += "and duration <= ?";
  sqlValues.push(req.query.max_duration);}
  else if(req.query.max_duration != null){
    sql+="where duration <= ?";
    sqlValues.push(req.query.duration);
  }
  
  database
  .query(sql, sqlValues)
  .then(([movies]) => {
    res.json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error retrieving data from database")
  });
  
};


const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find((movie) =>movie.id === id);

  

  database
  .query("select * from movies where id = ?", [id])
  .then(([movies])=>{
    if (movie != null) {
      res.json(movie);
    } else {
      res.status(404).send("Not Found");
    }
    if (movies[0] != null) {
      res.json(movies[0])}
    else{
      res.status(404).send("Not Found")
    }
  })

  .catch((err)=>
{
  console.error(err)
  res.status(500).send("Error retrieving data from database")
})
}

const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;

  database
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      res.location(`/api/movies/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
    });
};

const getUsers = (req, res) => { 
  let sql = "select * from users";
  const sqlValues = [];
  if(req.query.language!= null){
      sql+= " WHERE language = ? ";
      sqlValues.push(req.query.language);
     }
    else if(req.query.city != null && req.query.language!= null){
       sql += " WHERE language ? AND city = ? ";
       sqlValues.push(req.query.city, req.query.language);
        }
     else if (req.query.city != null){
        sql += " WHERE city = ? ";
          sqlValues.push(req.query.city)
          
    }
  database
  .query(sql,sqlValues)
  .then(([users])=> {
      res.json(users);
    })

.catch((err)=>
{
  console.error(err)
  res.status(500).send("Error retrieving data from database")
})
}


;
const getUserById = (req, res) => {

  const id = parseInt(req.params.id);
  database
    .query("select * from users where id = ?", [id])
    .then(([users])=>{
      if (users[0] != null) {
        res.json(users[0])}
      else{
        res.status(404).send("Not Found")
      }
    })
  
    .catch((err)=>
  {
    console.error(err)
    res.status(500).send("Error retrieving data from database")
  })
  }
  const postUsers = (req, res) => {
    const { firstname, lastname, email, city, language } = req.body;
  
    database
      .query(
        "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
        [firstname, lastname, email, city, language]
      )
      .then(([result]) => {
        res.location(`/api/users/${result.insertId}`).sendStatus(201);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving the user");
      });
  };

  const updateMovie = (req, res) => {
      const id = parseInt(req.params.id);
      const { title, director, year, color, duration } = req.body;
    
   database
     .query(
       "UPDATE movies SET title = ?, director = ?, year = ?, color = ?, duration = ? WHERE id = ?",
         [title, director, year, color, duration, id]
       )
       .then(([result]) => {
         if (result.affectedRows === 0) {
           res.status(404).send("Not Found");
         } else {
           res.sendStatus(204);
         }
       })
       .catch((err) => {
         console.error(err);
         res.status(500).send("Error editing the movie");
        });
  };
  const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { firstname, lastname, email, city, language } = req.body;
  
 database
   .query(
     "UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? WHERE id = ?",
       [firstname, lastname, email, city, language, id]
     )
     .then(([result]) => {
       if (result.affectedRows === 0) {
         res.status(404).send("Not Found");
       } else {
         res.sendStatus(204);
       }
     })
     .catch((err) => {
       console.error(err);
       res.status(500).send("Error editing the user");
      });
};

const deleteMovie = (req,res) => {
  const id= parseInt(req.params.id);
  database
  .query("DELETE from movies where id = ? ",[id])
.then(([result])=> {
  if (result.affectedRows === 0){
    res.status(404).send("Not Found");
  }else {
    res.sendStatus(204)
  }
})
.catch((err) => {
  console.error(err);
  res.status(500).send("Error deleting the movie");
});

};

const deleteUser = (req,res)=>{
  const id = parseInt(req.params.id);
  database
  .query("DELETE from users where id=?",[id])
  .then(([result])=>{
    if (result.affectedRows === 0){
res.status(404).send("Not Found");
    }else{res.sendStatus(204)}
  })
  .catch((err)=>{
    console.error(err);
    res.status(500).send("Error deleting the user");
  });
};
 
module.exports = {
  getMovies,
  getMovieById,
  getUsers,
  getUserById,
  postMovie,
  postUsers,
  updateMovie,
  updateUser,
  deleteMovie,
  deleteUser,
}

