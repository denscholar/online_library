from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from books.views import checkin_book, checkout_book


urlpatterns = [
    path(
        "checkout/<str:isbn>/",
        csrf_exempt(checkout_book),
        name="check-out",
    ),
    path(
        "checkin/<str:isbn>/",
        csrf_exempt(checkin_book),
        name="check-in",
    )
]
