SELECT m.title, r.rental_date, r.return_date 
FROM movies m
JOIN rentals r ON m.movie_id = r.movie_id
JOIN customers c ON r.customer_id = c.customer_id
WHERE c.email = 'john@test.com';