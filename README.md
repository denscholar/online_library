## Online Library – MVP

A minimal-yet-production-ready Online Library system with Book Management, User Management (Auth), and Check-in/Check-out.
Tech: Python (Django), JavaScript, HTML, CSS

## Project Screenshots

- Librarian Profile/Dashboard
#### `https://online-library-goy7.onrender.com/list-checkout-books/`
  ![list-checkout-books](https://github.com/denscholar/online_library/blob/main/screenshots/checkoutbook.png?raw=true)


- Checked-out book section - Librarian
#### `https://online-library-goy7.onrender.com/list-checkout-books/`
<img width="650" height="344" alt="checkoutbook" src="https://github.com/user-attachments/assets/2296a6db-716e-4aac-9977-cdc129f24495" />

- Reader Profile/Dashboard
#### `https://online-library-goy7.onrender.com/books/`
<img width="648" height="399" alt="image" src="https://github.com/user-attachments/assets/c205a599-1512-4ce5-959d-92af12bb2cae" />


## Features
1. User Management (Librarian & Reader)

- Email/password registration & login.
- Profile with profile photo upload.
- Librarian role doubles as admin; one default Librarian is created automatically.
- Readers manage their own profile and can borrow/return books.

2. Book Management (Librarian)

Create, read, update, delete (CRUD) books with:
- Cover image, Title, ISBN, Revision No., Published Date, Publisher, Author(s), Date Added, Genre (+ extensible fields).View checked-out books list.
- See reader details, checkout date, expected check-in date, days remaining/overdue.

3. Check-Out / Check-In (Reader)

- Search by title, ISBN, publisher, date added (case-insensitive, multi-field).
- Borrow a book (max duration: 10 days).
- Return a book with a single click/check-in.

Email reminders:
T-2 days before due date (if not returned).
Overdue: auto-notify Librarian end of due date.

## Getting Started

```
git clone https://github.com/denscholar/online_library.git
cd online-library
python -m venv env

# Windows: source env\Scripts\activate

# macOS/Linux:

source .venv/bin/activate

pip install -r requirements.txt


```

## Environment Variables
```
asgiref==3.9.1
certifi==2025.8.3
charset-normalizer==3.4.3
cloudinary==1.44.1
dj-database-url==3.0.1
Django==5.2.5
django-cloudinary-storage==0.3.0
django-widget-tweaks==1.5.0
gunicorn==23.0.0
idna==3.10
packaging==25.0
pillow==11.3.0
psycopg==3.2.9
psycopg-binary==3.2.9
python-decouple==3.8
python-dotenv==1.1.1
requests==2.32.5
six==1.17.0
sqlparse==0.5.3
typing_extensions==4.14.1
tzdata==2025.2
urllib3==2.5.0
whitenoise==6.9.0
```

## Database & Superuser (Default Librarian)
```
python manage.py migrate
python manage.py createsuperuser  # acts as default Librarian
python manage.py runserver
```

## Running the App (Dev),
```
python manage.py runserver
# visit http://127.0.0.1:8000/
```

## License

Choose one (MIT recommended for MVP). Put text in LICENSE.

## Contributing

- Fork & create a feature branch.
- Follow conventional commits.
- Add tests for new logic.
- Open a PR with clear description & screenshots.



