from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, null=True)
    country = models.CharField(max_length=255, blank=True, null=True)
    is_online = models.BooleanField(default=False)

    def __str__(self):
        return self.email

class Interest(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(CustomUser, related_name='interests', on_delete=models.CASCADE)

    def __str__(self):
        return self.name