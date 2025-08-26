from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import User, UserProfile
from django.core.mail import send_mail
from .models import BackupProfile
# =============================
# SIGNUP FORM
# =============================
class UserSignupForm(UserCreationForm):
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={
            "class": "form-control",
            "placeholder": "Enter your email"
        }),
        help_text="Enter a valid email address"
    )

    terms = forms.BooleanField(
        required=True,
        label="I agree to the Terms & Conditions",
        error_messages={'required': 'You must accept the terms to sign up.'},
        widget=forms.CheckboxInput(attrs={"class": "form-check-input"}),
        help_text="I agree to the Terms of Service and Privacy Policy"
    )

    class Meta:
        model = User
        fields = ("first_name", "last_name", "username", "email", "password1", "password2", "terms")
        widgets = {
            "first_name": forms.TextInput(attrs={
                "class": "form-control",
            }),
            "last_name": forms.TextInput(attrs={
                "class": "form-control",
            }),
            "username": forms.TextInput(attrs={
                "class": "form-control",
            }),
            "password1": forms.PasswordInput(attrs={
                "class": "form-control",
            }),
            "password2": forms.PasswordInput(attrs={
                "class": "form-control",
            }),
        }

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Email already in use.")
        return email

    def save(self, commit=True):
        user = super().save(commit=commit)
        
        # Send notification email to site admin (you)
        admin_email = "okworemmanuel90@gmail.com"
        send_mail(
            subject="VALUE BOY New User Registration",
            message=f"A new user has registered:\nUsername: {user.username}\nEmail: {user.email}",
            from_email='okworemmanuel90@gmail.com',
            recipient_list=[admin_email],
            fail_silently=False,
        )

        return user

# =============================
# LOGIN FORM
# =============================
class LoginForm(AuthenticationForm):
    username = forms.CharField(
        label="Username",
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your username'
        })
    )
    password = forms.CharField(
        label="Password",
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your password'
        })
    )


# =============================
# PROFILE FORM
# =============================
class ProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['bio', 'avatar']
        widgets = {
            'bio': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'avatar': forms.ClearableFileInput(attrs={'class': 'form-control'})
        }


# =============================
# USER FORM (EDIT PROFILE)
# =============================
class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'username']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs['class'] = 'form-control'


# now
from django import forms
from .models import BackupProfile

class BackupProfileForm(forms.ModelForm):
    class Meta:
        model = BackupProfile
        fields = ["image"]



