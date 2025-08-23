from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


from accounts.models import (
    CustomUser,
)


class CustomUserAmin(BaseUserAdmin):
    list_display = (
        "first_name",
        "last_name",
        "role",
        "email",
        "is_verified",
        "is_active",
        "created_at",
    )
    list_display_links = ("first_name", "last_name", "email")
    list_filter = ("first_name", "last_name",)
    search_fields = ("email",)
    ordering = ("-created_at",)
    fieldsets = ()
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide"),
                "fields": (
                    "first_name",
                    "last_name",
                    "email",
                    "password1",
                    "password2",
                ),
            },
        ),
    )


admin.site.register(CustomUser, CustomUserAmin)