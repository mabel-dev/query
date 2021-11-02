## SQL Lab

Query supports a limited Data Query Language.

~~~sql
 SELECT [DISTINCT] * | select_expression 
 FROM dataset
 [WHERE filter_expression]
 [GROUP BY column_name]
 [HAVING having_expression]
 [ORDER BY column_name ASC|DESC] 
 [LIMIT n]
~~~
            
Data is read only, `DELETE`, `INSERT`, `CREATE`, `ALTER` and `UPDATE` are not supported.

Some features, such as `JOIN`s, Sub Queries, `UNIONS` are not supported.

### select_expression

Sets the columns to populate the result set with, in a comma separated list. select_expressions can contain functions to perform on columns in the source dataset. At least one expression is required, `GROUP BY` statements must contain aggregation functions to perform on the groups.

The columns referenced in the `SELECT` clause must exist in the target table. Columns in big data applications duplicate values. Use the `DISTINCT` keyword to return only distinct (different) values.

### dataset

Filter Operations:

Description               | Operator         
------------------------- | -----------------
**EQUALS**                | `=` (also `==`)
**NOT EQUALS**            | `<>` (also `!=`)
**GREATER THAN**          | `>`
**GREATER THAN OR EQUAL** | `>=`
**LESS THAN**             | `<`
**LESS THAN OR EQUAL**    | `<=`
**PATTERN MATCH**         | `LIKE`
**ITEM IN LIST**          | `IN`
**LIST HAS ITEM**         | `CONTAINS`

Aggregation Functions:

- COUNT
- SUM
- MAX
- MIN
- AVG

Date and Time Functions:

- `DAY(date)` - extract the day of the month from a date
- `MONTH(date)` - extract the month of the year from a date
- `YEAR(date)` - extract the year from a date
- `DATE(date)` - extract/convert the date from a timestamp
- `QUARTER(date)` - extract the quarter of the year from a date
- `WEEK(date)` - extract the week of the year (ISO 8601)
- `TIME(timestamp)` - extract the time from a timestamp
- `HOUR(timestamp)` - extract the hour from a timestamp
- `MINUTE(timestamp)` - extract the minutes from a timestamp
- `SECOND(timestamp)` - extract the seconds from a timestamp
- `ADDDAYS(date, days)` - add 'days' number of days to a date, negative values allowed
- `NOW()` - the current date and time

String Functions:

- `UPPER(string)` - convert a string to upper case (also UCASE)
- `LOWER(string)` - convert a string to lower case (also LCASE)
- `LEN(string)` - calculate the length of a string
- `TRIM(string)` - remove whitespace from the start and end of a string
- `LEFT(string, count)` extract the leftmost characters from a string
- `RIGHT(string, count)` - extract the rightmost characters from a string
- `MID(string, start, length)` - extract a substring from a string
- `CONCAT(string, string ... )` - concatenate a set of strings
- `CONCAT(list)`
- `STRING(string)` - convert a value to a string

Numbers Functions:

- `ROUND(number)` - round a number
- `TRUNC(number)` - truncate a number
- `INT(number)` - convert a number or string to an integer (same logic as INT)
- `FLOAT(number)` - convert a number or string to a floating point number

Other Functions:

- `BOOLEAN(string)` - convert a string TRUE/FALSE to a boolean
- `ISNONE(any)` - returns TRUE (boolean) if a value is none/null
- `HASH(any)` - Hashes a value (uses SIPHASH)
- `MD5(any)` - Calculate the MD5 of a value
- `RANDOM()` - Return a random number between 0.000 to 0.999