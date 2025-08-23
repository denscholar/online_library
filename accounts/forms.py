from django import forms
from accounts.models import CustomUser
from books.models import Book


class BookForm(forms.ModelForm):
    published_date = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date', 'class': 'form-control'})
    )

    class Meta:
        model = Book
        fields = [
            'conver_page_image', 'title', 'isbn', 'revision_number',
            'published_date', 'publisher', 'author', 'genre',
        ]
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'isbn': forms.TextInput(attrs={'class': 'form-control'}),
            'revision_number': forms.TextInput(attrs={'class': 'form-control'}),
            'publisher': forms.TextInput(attrs={'class': 'form-control'}),
            'author': forms.TextInput(attrs={'class': 'form-control'}),
            'genre': forms.TextInput(attrs={'class': 'form-control'}),
            'conver_page_image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
        }

class LibrarianCreationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    confirm_password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = CustomUser
        fields = ["first_name", "last_name", "email", "profile_image"]

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")

        if password and confirm_password and password != confirm_password:
            raise forms.ValidationError("Passwords do not match")

        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        user.role = CustomUser.LIBRARIAN
        user.is_active = True
        user.is_verified = True
        user.is_staff = True
        if commit:
            user.save()
        return user