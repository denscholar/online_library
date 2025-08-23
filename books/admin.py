from django.contrib import admin

from books.models import Book


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "conver_page_image",
        "title",
        "publisher",
        "is_checked_out",
        "checked_out_by",
        "checked_out_date",
        "date_added",
        "updated_at",
    )
    list_display_links = ("user", "title")
