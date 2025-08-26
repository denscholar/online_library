from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.conf import settings
from .models import CustomUser


# User = settings.AUTH_USER_MODEL

@receiver(post_migrate)
def create_default_librarian(sender, **kwargs):
    """
    This functionality creates a default admin user who is the librarian
    """
    if sender.name == "accounts":
        if not CustomUser.objects.filter(role=CustomUser.LIBRARIAN).exists():
            CustomUser.objects.create_superuser(
                email="admin@library.com",
                password="admin123",
                role=CustomUser.LIBRARIAN,
                first_name="Dennis",
                last_name="Akagha",
                is_verified=True,
                is_active=True,
            )