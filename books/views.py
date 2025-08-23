from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.utils.timezone import now


from books.models import Book


@login_required
def checkout_book(request, isbn):
    book = get_object_or_404(Book, isbn=isbn)

    if request.method == "POST":
        if not book.is_checked_out:
            book.is_checked_out = True
            book.checked_out_by = request.user
            book.checked_out_at = now()
            book.save()
            return JsonResponse({"status": "success", "message": "Book checked out"})
        else:
            return JsonResponse({"status": "error", "message": "Book already checked out"})

    return JsonResponse({"status": "error", "message": "Invalid request"})


@login_required
def checkin_book(request, isbn):
    book = get_object_or_404(Book, isbn=isbn)

    if request.method == "POST":
        if book.is_checked_out and book.checked_out_by == request.user:
            book.is_checked_out = False
            book.checked_out_by = None
            book.checked_out_at = None
            book.save()
            return JsonResponse({"status": "success", "message": "Book checked in"})
        else:
            return JsonResponse({"status": "error", "message": "You cannot check in this book"})

    return JsonResponse({"status": "error", "message": "Invalid request"})