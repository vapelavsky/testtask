# Junior AI Test Task. Found bugs.

## Backend

| Destination | Bug                                    | 
|-------------|----------------------------------------|
| users_db:48 | Missed closing bracket before 'VALUES' | 
| users_db:14 | Missed in SELECT block 'password'      | 
| users_db:62 | fav_colour instead of fav_color        |

## Frontend
| Destination    | Bug                                                  |
|----------------|------------------------------------------------------|
| signup.ts:13   | Typo ('sinup' instead of 'signup')                   |
| config.ts      | Typo ('v1' instead of 'v2')                          |
| user.ts:12     | Tried to send fetch request not to full URL          |
| user.ts:30     | Tried to send fetch request not to full URL          |

## General

Absence of password validation on both sides. Frontend didn't validate, if password is empty.
Backend didn't validate too. This issue can puzzle junior dev, because he can think, that empty password and None (null)
are the same things.

Fixed by adding validation on frontend side via regex which can handle these cases.
On backend side we have validation too, because anyone can make API call via Postman (for example) and try to provide
empty password.