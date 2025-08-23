from django.db import models
from django.utils import timezone
from datetime import timedelta
from accounts.models import CustomUser


class Book(models.Model):
    user = models.ForeignKey(CustomUser, related_name="books", on_delete=models.CASCADE)
    conver_page_image = models.ImageField(upload_to="cover_page_image/")
    title = models.CharField(max_length=50)
    isbn = models.CharField(max_length=50, unique=True)
    revision_number = models.CharField(max_length=50, blank=True, null=True)
    published_date = models.DateField()
    publisher = models.CharField(max_length=150)
    author = models.CharField(max_length=250)
    genre = models.CharField(max_length=250)
    is_checked_out = models.BooleanField(default=False)
    checked_out_by = models.ForeignKey(
        CustomUser,
        related_name="checked_out_books",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    checked_out_date = models.DateTimeField(blank=True, null=True)
    expected_check_in_date = models.DateTimeField(blank=True, null=True)
    check_in_date = models.DateTimeField(blank=True, null=True)
    date_added = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date_added"]

    def __str__(self):
        return f"{self.title} ({self.isbn})"

    @property
    def days_remaining(self):
        """
        Returns number of days remaining before check-in deadline,
        or negative if overdue.
        """
        if self.expected_check_in_date:
            delta = self.expected_check_in_date.date() - timezone.now().date()
            return delta.days
        return None

    @property
    def is_overdue(self):
        """Check if the book is overdue."""
        return self.days_remaining is not None and self.days_remaining < 0

    def checkout(self, user, days=14):
        """Mark book as checked out by a user for a given period (default 14 days)."""
        self.is_checked_out = True
        self.checked_out_by = user
        self.checked_out_date = timezone.now()
        self.expected_check_in_date = timezone.now() + timedelta(days=10)
        self.save()

    def checkin(self):
        """Mark book as returned."""
        self.is_checked_out = False
        self.check_in_date = timezone.now()
        self.checked_out_by = None
        self.checked_out_date = None
        self.expected_check_in_date = None
        self.save()
