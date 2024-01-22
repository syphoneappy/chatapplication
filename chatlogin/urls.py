from django.urls import path 
from . import views
urlpatterns = [
   path("create/",views.CustomUserAndInterestView.as_view()),
   path("login/", views.CustomUserLoginView.as_view()),
   path("validate-token/", views.validate_token), 
   
]
