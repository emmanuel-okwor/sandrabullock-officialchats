from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, UserProfile  # ✅ only import the models you actually have

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        # Create a UserProfile when a new User is created
        UserProfile.objects.create(user=instance)
    else:
        # Save the existing UserProfile whenever the User is updated
        instance.userprofile.save()
