# views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView, LogoutView
from django.views.generic import CreateView
from django.urls import reverse_lazy
from django.contrib import messages
from django.core.mail import send_mail
from django.contrib.auth import update_session_auth_hash
from django.http import JsonResponse
from django.contrib.auth.models import User
import random, json

from .forms import (
    UserSignupForm, ProfileForm, LoginForm, UserForm, BackupProfileForm
)
from .models import (
    UserProfile, BackupProfile, PasswordResetOTP, ChatRoom, Message
)


# =============================
# AUTHENTICATION VIEWS
# =============================

class SignupView(CreateView):
    form_class = UserSignupForm
    template_name = 'signup.html'
    success_url = reverse_lazy('dashboard')


class CustomLoginView(LoginView):
    template_name = 'login.html'
    authentication_form = LoginForm

    def get_success_url(self):
        return reverse_lazy('dashboard')


class CustomLogoutView(LogoutView):
    next_page = reverse_lazy('index')


def index(request):
    return render(request, "index.html") 

# =============================
# DASHBOARD & BACKUP
# =============================

@login_required
def dashboard(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    backup, _ = BackupProfile.objects.get_or_create(user=request.user)
    return render(request, "dashboard.html", {
        "profile": profile,
        "backup": backup,
    })


@login_required
def view_backup(request):
    backup, _ = BackupProfile.objects.get_or_create(user=request.user)
    return render(request, "view_backup.html", {"backup": backup})


@login_required
def edit_backup(request):
    backup, _ = BackupProfile.objects.get_or_create(user=request.user)
    if request.method == "POST":
        form = BackupProfileForm(request.POST, request.FILES, instance=backup)
        if form.is_valid():
            form.save()
            messages.success(request, "Backup updated successfully ✅")
            return redirect("dashboard")
    else:
        form = BackupProfileForm(instance=backup)
    return render(request, "edit_backup.html", {"form": form, "backup": backup})


# =============================
# PROFILE VIEWS
# =============================

@login_required
def profile_view(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    return render(request, 'profile_page.html', {"profile": profile})


@login_required
def edit_profile_view(request):
    user = request.user
    profile, _ = UserProfile.objects.get_or_create(user=user)

    if request.method == 'POST':
        u_form = UserForm(request.POST, instance=user)
        p_form = ProfileForm(request.POST, request.FILES, instance=profile)

        if u_form.is_valid() and p_form.is_valid():
            u_form.save()
            p_form.save()
            messages.success(request, "Your profile has been updated successfully ✅")
            return redirect('profile')
    else:
        u_form = UserForm(instance=user)
        p_form = ProfileForm(instance=profile)

    return render(request, 'edit_profile.html', {
        'u_form': u_form,
        'p_form': p_form,
    })


# =============================
# PASSWORD RESET (OTP)
# =============================

@login_required
def reset_password_view(request):
    show_form = False

    if request.method == 'POST':
        # Step 1: Send OTP
        if 'send_otp' in request.POST:
            user = request.user
            if not user.email:
                messages.error(request, "Please update your profile with a valid email address first.")
                return redirect('edit_profile')

            otp = str(random.randint(100000, 999999))
            PasswordResetOTP.objects.update_or_create(
                user=user,
                defaults={'otp_code': otp}
            )

            send_mail(
                subject="Password Reset OTP",
                message=f"Your OTP is {otp}",
                from_email="no-reply@easyedu.com",
                recipient_list=[user.email],
                fail_silently=False,
            )

            messages.success(request, "OTP sent to your email.")
            show_form = True

        # Step 2: Verify OTP & reset password
        elif 'reset_password' in request.POST:
            otp_input = request.POST.get('otp')
            new_pw = request.POST.get('new_password1')
            confirm_pw = request.POST.get('new_password2')

            try:
                otp_record = PasswordResetOTP.objects.get(user=request.user)
            except PasswordResetOTP.DoesNotExist:
                messages.error(request, "Please request an OTP first.")
                return redirect('reset_password')

            if otp_record.is_expired():
                otp_record.delete()
                messages.error(request, "OTP expired. Request a new one.")
                return redirect('reset_password')

            if otp_record.otp_code != otp_input:
                messages.error(request, "Invalid OTP.")
                return redirect('reset_password')

            if new_pw != confirm_pw:
                messages.error(request, "Passwords do not match.")
                return redirect('reset_password')

            # Save new password
            user = request.user
            user.set_password(new_pw)
            user.save()
            otp_record.delete()
            update_session_auth_hash(request, user)

            messages.success(request, "Password updated successfully! ✅")
            return redirect('profile')
    else:
        show_form = PasswordResetOTP.objects.filter(user=request.user).exists()

    return render(request, 'reset_password.html', {'show_form': show_form})


# =============================
# CHAT VIEWS
# =============================

@login_required
def chat_page(request):
    rooms = ChatRoom.objects.filter(participants=request.user)
    return render(request, "chat.html", {"rooms": rooms})


@login_required
def create_chat(request):
    if request.method == "POST":
        data = json.loads(request.body)
        chat_type = data.get("chat_type")
        subject = data.get("subject", "")
        user_id = data.get("user_id")

        room = ChatRoom.objects.create(chat_type=chat_type, subject=subject)
        room.participants.add(request.user)

        if chat_type == "private" and user_id:
            other_user = get_object_or_404(User, id=user_id)
            room.participants.add(other_user)

        return JsonResponse({"room_id": room.id, "subject": room.subject})


@login_required
def get_messages(request, room_id):
    room = get_object_or_404(ChatRoom, id=room_id, participants=request.user)
    messages_qs = room.messages.select_related("sender").all()
    return JsonResponse([
        {"sender": msg.sender.username, "content": msg.content, "timestamp": msg.timestamp.strftime("%H:%M")}
        for msg in messages_qs
    ], safe=False)


@login_required
def send_message(request, room_id):
    if request.method == "POST":
        room = get_object_or_404(ChatRoom, id=room_id, participants=request.user)
        data = json.loads(request.body)
        msg = Message.objects.create(room=room, sender=request.user, content=data.get("content"))
        return JsonResponse({
            "sender": msg.sender.username,
            "content": msg.content,
            "timestamp": msg.timestamp.strftime("%H:%M")
        })


# =============================
# EXTRA VIEWS (Public Pages)
# =============================

def chat_view(request):
    return render(request, 'chat.html')


def about_sandra(request):
    context = {
        "date_of_birth": "July 26, 1964",
        "birthplace": "Arlington County, Virginia, USA",
        "children": "Louis (adopted 2010) & Laila (adopted 2015)",
        "known_for": "Versatile roles in comedy and drama",
        "notable_films": "Speed, Miss Congeniality, The Blind Side, Gravity",
        "movies_count": "50+ Films",
        "box_office": "$5.3B+ Worldwide",
        "awards_count": "100+ Nominations",
        "years_active": "1987 - Present",
        "biography": [
            "Sandra Annette Bullock is an American actress and producer who has received numerous accolades, including an Academy Award and a Golden Globe Award.",
            "She was the world's highest-paid actress in 2010 and 2014, and was named one of Time's 100 most influential people in the world in 2010.",
            "Born in Arlington, Virginia, and raised in Germany, Bullock began her career as a stage actress before making her film debut in the 1987 thriller Hangmen.",
            "She rose to prominence in the 1990s with roles in Demolition Man (1993) and Speed (1994), which established her as a leading actress in Hollywood.",
            "Throughout her career, Bullock has demonstrated remarkable versatility, excelling in both comedic roles like Miss Congeniality and dramatic performances such as her Oscar-winning turn in The Blind Side."
        ],
        "lifetime_achievements": [
            {"year": "1994", "detail": "Speed - Breakthrough Role"},
            {"year": "2009", "detail": "Academy Award Winner - The Blind Side"},
            {"year": "2013", "detail": "People’s Choice Award - Gravity"},
            {"year": "2018", "detail": "Hollywood Walk of Fame Star"},
            {"year": "2021", "detail": "Screen Actors Guild Award"},
        ],
        "fun_facts": [
            {"title": "Multilingual", "detail": "Fluent in German and English"},
            {"title": "Philanthropist", "detail": "Donated millions to disaster relief efforts"},
            {"title": "Producer", "detail": "Founded Fortis Films production company"},
            {"title": "Voice Acting", "detail": "Voiced Scarlet Overkill in Minions"},
        ],
    }
    return render(request, "about.html", context)



def more_pic_view(request):
    return render(request, "more_pic.html")


def sell_card_page(request):
    return render(request, "sell_card.html")


def chat_one_view(request):
    return render(request, 'chat_one.html')


def still_card_A(request):
    return render(request, 'still_card.html')


@login_required
def settings_view(request):
    return render(request, "setting.html")


@login_required
def notification_view(request):
    return render(request, "notification.html")
