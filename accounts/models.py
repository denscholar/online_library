from django.db import models
from django.utils.text import slugify
from django.utils import timezone
import uuid
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
    Group,
    Permission,
)


class MyUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given email, password, and any extra fields.
        """

        if not email:
            raise ValueError("Email address is required")

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Creates and saves a superuser with the given email, password, and any extra fields.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_verified", True)


        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        if extra_fields.get("is_active") is not True:
            raise ValueError("Superuser must have is_active=True.")
        if extra_fields.get("is_verified") is not True:
            raise ValueError("Superuser must have is_verified=True.")

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    LIBRARIAN = "librarian"
    READER = "reader"
    ROLE_CHOICES = (
        (LIBRARIAN, "Librarian"),
        (READER, "Reader"),
    )

    email = models.EmailField(max_length=254, unique=True)
    # phone_number = models.CharField(max_length=15, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    slug = models.CharField(max_length=400, blank=True, null=True, unique=True)
    profile_image = models.ImageField(upload_to='profile')
    role = models.CharField(choices=ROLE_CHOICES, blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"

    objects = MyUserManager()

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"
        ordering = ["-first_name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.email) + str(uuid.uuid4())

        super().save(*args, **kwargs)