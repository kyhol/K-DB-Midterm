const { Pool } = require("pg");
//Absolute test...
// PostgreSQL connection
const pool = new Pool({
  user: "postgres", //This _should_ be your username, as it's the default one Postgres uses
  host: "localhost",
  database: "your_database_name", //This should be changed to reflect your actual database
  password: "What", //This should be changed to reflect the password you used when setting up Postgres
  port: 5432,
});

/**
 * Creates the database tables, if they do not already exist.
 */
async function createTable() {
  try {
    const client = await pool.connect();
    await client.query(`
    CREATE TABLE IF NOT EXISTS movies (
        movie_id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        release_year INTEGER NOT NULL,
        genre TEXT NOT NULL,
        director TEXT NOT NULL
    );    

    CREATE TABLE IF NOT EXISTS customers (
        customer_id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rentals (
        rental_id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers ON DELETE CASCADE,
        movie_id INTEGER REFERENCES movies,
        rental_date DATE NOT NULL,
        return_date DATE
        );
    `);
    client.release();
  } catch (err) {
    console.error("Error tables not created:", err);
    throw err;
  }
}

/**
 * Inserts a new movie into the Movies table.
 *
 * @param {string} title Title of the movie
 * @param {number} year Year the movie was released
 * @param {string} genre Genre of the movie
 * @param {string} director Director of the movie
 */
async function insertMovie(title, year, genre, director) {
  try {
    const query =
      "INSERT INTO movies (title, release_year, genre, director) VALUES ($1, $2, $3, $4)"; //1$,2$,3$,4$ are placeholders to prevent SQL injection. Kinda neat
    await pool.query(query, [title, year, genre, director]);
    console.log("Movie inserted Thumbs up");
  } catch (err) {
    console.error("Error inserting movie: Thumbs down", err);
  }
}
/**
 * Prints all movies in the database to the console
 */
async function displayMovies() {
  try {
    const result = await pool.query("SELECT * FROM movies ORDER BY title"); //selects movies by title and orders them alphabetically
    console.log("\n\tMovies:");

    //foreachloop to display each movie
    result.rows.forEach((movie) => {
      console.log(
        `${movie.title} (${movie.release_year}) - ${movie.genre} - Directed by: ${movie.director}`
      );
    });
  } catch (err) {
    console.error("Error displaying movies: thumbs down", err);
  }
}

/**
 * Updates a customer's email address.
 *
 * @param {number} customerId ID of the customer
 * @param {string} newEmail New email address of the customer
 */
async function updateCustomerEmail(customerId, newEmail) {
  try {
    const query = "UPDATE customers SET email = $1 WHERE customer_id = $2"; //Set placeholder for email and customer_id
    await pool.query(query, [newEmail, customerId]); //Update the email address and customer_id where 1$ is the new email and 2$ is the customer_id. Once again... neat.
    console.log("Customer email updated successfully Thumbs up");
  } catch (err) {
    console.error("Error updating customer email: Thumbs down", err);
  }
}

/**
 * Removes a customer from the database along with their rental history.
 *
 * @param {number} customerId ID of the customer to remove
 */
async function removeCustomer(customerId) {
  try {
    //same deal, try to delete customer by customer_id, but the placeholder prevents SQL injection
    const query = "DELETE FROM customers WHERE customer_id = $1";
    await pool.query(query, [customerId]); //fills the data in the placeholder
    console.log("Customer removed successfully: Thumbs up");
  } catch (err) {
    console.error("Error removing customer: Thumbs Down", err);
  }
}

/**
 * Prints a help message to the console
 */
function printHelp() {
  console.log("Usage:");
  console.log("  insert <title> <year> <genre> <director> - Insert a movie");
  console.log("  show - Show all movies");
  console.log("  update <customer_id> <new_email> - Update a customer's email");
  console.log("  remove <customer_id> - Remove a customer from the database");
}

/**
 * Runs our CLI app to manage the movie rentals database
 */
async function runCLI() {
  await createTable();

  const args = process.argv.slice(2);
  switch (args[0]) {
    case "insert":
      if (args.length !== 5) {
        printHelp();
        return;
      }
      await insertMovie(args[1], parseInt(args[2]), args[3], args[4]);
      break;
    case "show":
      await displayMovies();
      break;
    case "update":
      if (args.length !== 3) {
        printHelp();
        return;
      }
      await updateCustomerEmail(parseInt(args[1]), args[2]);
      break;
    case "remove":
      if (args.length !== 2) {
        printHelp();
        return;
      }
      await removeCustomer(parseInt(args[1]));
      break;
    default:
      printHelp();
      break;
  }
}

runCLI();
