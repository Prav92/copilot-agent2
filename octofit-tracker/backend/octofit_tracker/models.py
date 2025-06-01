from django.db import models
from django.contrib.auth.models import AbstractUser

class OctofitUser(AbstractUser):
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    grade = models.CharField(max_length=10, blank=True)
    avatar = models.URLField(blank=True)
    team = models.ForeignKey('Team', on_delete=models.SET_NULL, null=True, blank=True)

class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Activity(models.Model):
    user = models.ForeignKey(OctofitUser, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=50)
    duration_minutes = models.PositiveIntegerField()
    distance_km = models.FloatField(null=True, blank=True)
    points_earned = models.PositiveIntegerField(default=0)
    date = models.DateField(auto_now_add=True)

class Leaderboard(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    total_points = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

class Workout(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    difficulty = models.CharField(max_length=50)
    duration_minutes = models.PositiveIntegerField()
    created_by = models.ForeignKey(OctofitUser, on_delete=models.SET_NULL, null=True, blank=True)
