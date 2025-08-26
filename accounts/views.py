from django.shortcuts import render
from django.contrib import messages
from django.shortcuts import reverse, redirect
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import check_password
from django.db.models import Q

from accounts.forms import BookForm, LibrarianCreationForm
from accounts.models import CustomUser
from books.models import Book


# ============================================================================
#                       REGISTER VIEW
# ============================================================================

def register_view(request):

    context = {"field_values": request.POST.dict()}

    if request.method == "POST":
        first_name = request.POST.get("first_name", "").strip()
        last_name = request.POST.get("last_name", "").strip()
        email = request.POST.get("email", "").strip()
        password = request.POST.get("password", "").strip()
        confirm_password = request.POST.get("confirm_password", "").strip()
        profile_image = request.FILES.get("profile_image")

        if not CustomUser.objects.filter(email=email).exists():
            if len(password) < 6:
                messages.error(request, "Password too short")
                return render(request, "accounts/register.html", context)

            if password != confirm_password:
                messages.error(request, "Password doesn't match")
                return render(request, "accounts/register.html", context)

            if not first_name:
                messages.error(request, "First name is required")
                return render(request, "accounts/register.html", context)

            if not last_name:
                messages.error(request, "Last name is required")
                return render(request, "accounts/register.html", context)

            user = CustomUser.objects.create_user(email=email, password=password)

            user.first_name = first_name
            user.role = CustomUser.READER
            user.last_name = last_name
            user.is_active = True
            user.is_verified = True

            if profile_image:
                user.profile_image = profile_image

            user.save()

            messages.success(request, "Account Created, please login")
            return redirect(reverse("accounts:login"))

        messages.error(request, "User with this number exist")
        return render(request, "accounts/register.html", context)

    return render(request, "accounts/register.html", context)


# ============================================================================
#                       LOGIN VIEW
# ============================================================================

def login_view(request):
     # Redirect if user is already logged in
    if request.user.is_authenticated:
        if request.user.role == "librarian":
            return redirect("accounts:book-list")
        return redirect("accounts:reader")
    
    context = {"field_value": {}}

    if request.method == "POST":
        email = request.POST.get("email", "").strip()
        password = request.POST.get("password", "").strip()
        context["field_value"] = request.POST

        if not email or not password:
            messages.error(request, "Email and password are required")
            return render(request, "accounts/login.html", context)

        # Authenticate user
        user = authenticate(request, email=email, password=password)

        if user is None:
            messages.error(request, "Invalid email or password")
            return render(request, "accounts/login.html", context)

        # Login and redirect based on role
        login(request, user)

        if user.role == "librarian":
            return redirect("accounts:book-list")
        else:
            return redirect("accounts:reader")

    return render(request, "accounts/login.html")

# ============================================
# AUTHENTICATION VIEW
# ===========================================
@login_required
def add_book_view(request):
    if request.method == "POST":
        form = BookForm(request.POST, request.FILES)
        if form.is_valid():
            book = form.save(commit=False)
            book.user = request.user
            book.save()
            messages.success(request, "Book uploaded successfully!")
            return redirect("accounts:book-list")
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = BookForm()

    context = {"form": form}
    return render(request, "accounts/add_book.html", context)


# =====================================================
# GET BOOKS VIEW
# ======================================

def get_books_view(request):
    books = Book.objects.filter(user=request.user).order_by("-date_added")
    context = {"books": books}

    return render(request, "accounts/get_books.html", context)


# ====================================
# UPDATE BOOK VIEW
# =======================================

def update_book_view(request, isbn):
    book = get_object_or_404(Book, isbn=isbn, user=request.user)

    if request.method == "POST":
        form = BookForm(request.POST, request.FILES, instance=book)
        if form.is_valid():
            form.save()
            messages.success(request, "Book updated successfully!")
            return redirect("accounts:book-list")
    else:
        form = BookForm(instance=book)

    context = {"form": form, "book": book}
    return render(request, "accounts/update_book.html", context)


# ===============================
# LOGOUT VIEW
# ============================================
def logout_view(request):
    logout(request)
    messages.success(request, "Logged out successfully!")
    return redirect("accounts:login")


# ====================================
# READERS VIEW
# ===================================

def readers_profile_view(request):
    query = request.GET.get("q", "")
    all_books = Book.objects.filter(is_checked_out=False)

    if query:
        all_books = all_books.filter(
            Q(title__icontains=query)
            | Q(isbn__icontains=query)
            | Q(publisher__icontains=query)
            | Q(date_added__date__icontains=query)
        )

    context = {
        "all_books": all_books,
        "query": query,
    }
    return render(request, "accounts/readers_profile.html", context)

# ================================
# CHECKOUT VIEW
# ==============================

def check_out_view(request):
    checkout_books = Book.objects.filter(
        is_checked_out=True,
        checked_out_by=request.user,
    )
    context = {"checkout_books": checkout_books}
    return render(request, "accounts/checkout.html", context)


# ==========================
# LIST OF CHECKOUT BOOKS
# =============================
def list_of_checked_books_view(request):
    checkout_books = Book.objects.filter(
        is_checked_out=True,
    )
    context = {"checkout_books": checkout_books}
    return render(request, "accounts/list_checkedout_books.html", context)

# ===============================
# LIST OF ALL READERS
# ===============================
def list_of_user(request):
    readers = CustomUser.objects.filter(role="reader")
    context = {
        "readers": readers,
    }
    return render(request, "accounts/all-reader.html", context)

# =========================================
# CREATE OTHER LIBRARIAN
# ===================================
@login_required
def create_librarian(request):
    # only allow librarians to create librarians
    if request.user.role != CustomUser.LIBRARIAN:
        messages.error(request, "You are not authorized to perform this action.")
        return redirect("accounts:book-list")

    if request.method == "POST":
        form = LibrarianCreationForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, "New librarian created successfully!")
            return redirect("accounts:create_librarian")
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = LibrarianCreationForm()

    return render(request, "accounts/create_librarian.html", {"form": form})
