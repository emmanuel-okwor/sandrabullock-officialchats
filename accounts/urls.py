from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView
from django.contrib.auth import views as auth_views

urlpatterns = [
    # --- Authentication ---
    path("login/", views.CustomLoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(next_page="login"), name="logout"),
    path("signup/", views.SignupView.as_view(), name="signup"),
    path("reset_password/", views.reset_password_view, name="reset_password"),

    # --- User Profile & Dashboard ---
    path("profile/", views.profile_view, name="profile"),
    path("edit_profile/", views.edit_profile_view, name="edit_profile"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("notification/", views.notification_view, name="notification"),


    # --- Backup Profile ---
    path("backup/edit/", views.edit_backup, name="edit_backup"),
    path("backup/view/", views.view_backup, name="view_backup"),

    # --- Static Pages ---
    path("about/", views.about_sandra, name="about"),
    path("more_pic/", views.more_pic_view, name="more_pic"),
    path("sell_card/", views.sell_card_page, name="sell_card"),
    path("still_card/", views.still_card_A, name="still_card"),
    path('setting/', views.settings_view, name='setting'),

    # --- Chat ---
    path("chat/", views.chat_page, name="chat_page"),  # keep only one main chat
    path("chat/create/", views.create_chat, name="create_chat"),
    path("chat/<int:room_id>/messages/", views.get_messages, name="get_messages"),
    path("chat/<int:room_id>/send/", views.send_message, name="send_message"),
    path("chat_one/", views.chat_one_view, name="chat_one"),

    # --- Password Reset (Django built-in) ---
    path("password-reset/", auth_views.PasswordResetView.as_view(), name="password_reset"),
    path("password-reset/done/", auth_views.PasswordResetDoneView.as_view(), name="password_reset_done"),
    path("reset/<uidb64>/<token>/", auth_views.PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path("reset/done/", auth_views.PasswordResetCompleteView.as_view(), name="password_reset_complete"),
]
