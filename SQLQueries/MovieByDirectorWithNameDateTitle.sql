SELECT c.first_name, c.last_name, m.title, r.rental_date
FROM rentals r
JOIN movies m ON r.movie_id = m.movie_id
JOIN customers c ON r.customer_id = c.customer_id
WHERE m.director = 'Christopher Nolan'
ORDER BY r.rental_date;