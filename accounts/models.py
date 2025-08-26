from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta
from django.conf import settings  # ✅ for AUTH_USER_MODEL


# ✅ Custom User model
class User(AbstractUser):
    ROLE_CHOICES = [
        ('member', 'Member'),
        ('instructor', 'Instructor'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')

    def __str__(self):
        return f"{self.username} ({self.role})"


# ✅ User Profile
class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} ({self.user.role})"


# ✅ Password Reset OTP
class PasswordResetOTP(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=10)

    def __str__(self):
        return f"OTP for {self.user.username}"


# ✅ Celebrity images
class CelebrityImage(models.Model):
    image = models.ImageField(upload_to='celebs/')
    celebrity = models.CharField(max_length=100)

    def __str__(self):
        return self.celebrity


# ✅ ChatRoom model
class ChatRoom(models.Model):
    CHAT_TYPES = [
        ('course', 'Course Discussion'),
        ('private', 'Private Message'),
        ('study', 'Study Group'),
    ]
    chat_type = models.CharField(max_length=20, choices=CHAT_TYPES)
    subject = models.CharField(max_length=255, blank=True, null=True)
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="chatrooms"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_chat_type_display()} - {self.subject or 'No Subject'}"


# ✅ Message model
class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_messages"
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.sender.username}: {self.content[:20]}"
    
# now


from django.db import models
from django.conf import settings

class BackupProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="backup_profile"
    )
    image = models.ImageField(upload_to="backup_pics/", blank=True, null=True)

    def __str__(self):
        return f"Backup Profile of {self.user.username}"
