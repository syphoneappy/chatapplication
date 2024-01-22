from django.urls import path 
from . import views

urlpatterns = [
   path("users-names/",views.OtherUsersListView.as_view()),
   path('simple_chat/', views.simple_chat),
   path('messages/<str:current_user>/<str:other_user>/', views.MessageHistoryView.as_view(), name='message_history'),
]
