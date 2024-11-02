Movies Table 3NF:

- Has unqiue ID (movie_id) for each movie
- Every piece of movie info (title, year, genre, director) depends only on the movie_id
  -Info isn't repeated in other tables - no duplicates

Rentals Table 3NF:

- references customer_id, movie_id instead of duplicating info
- Only stores data specific to rental dates
- Unique ID rental_id

Customers Table 3NF:

- UNique ID customers_id
- All info contained within customer ID
- Customer info is stored only here - not duplicated in rentals or anywhere else
