SELECT m.title, c.first_name, c.last_name, r.rental_date
FROM rentals r
JOIN movies m ON r.movie_id = m.movie_id
JOIN customers c ON r.customer_id = c.customer_id
WHERE r.return_date IS NULL
ORDER BY r.rental_date;