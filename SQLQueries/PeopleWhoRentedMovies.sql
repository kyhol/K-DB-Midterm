SELECT DISTINCT c.first_name, c.last_name, c.email
FROM customers c
JOIN rentals r ON c.customer_id = r.customer_id
JOIN movies m ON r.movie_id = m.movie_id
WHERE m.title = 'The Matrix';