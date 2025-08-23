from django.urls import path
from accounts.views import add_book_view, check_out_view, create_librarian, get_books_view, list_of_checked_books_view, list_of_user, login_view, logout_view, readers_profile_view, register_view, update_book_view

app_name = "accounts"

urlpatterns = [
    path("", register_view, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("create-librarian/", create_librarian, name="create_librarian"),
    path("add-book/", add_book_view, name="add-book"),
    path("book-list/", get_books_view, name="book-list"),
    path("books/", readers_profile_view, name="reader"),
    path("checkout-books/", check_out_view, name="checkout-books"),
    path("list-checkout-books/", list_of_checked_books_view, name="list-checkout-books"),
    path("readers/", list_of_user, name="readers"),
    path("update-book/<str:isbn>/", update_book_view, name="update-book"),
]
