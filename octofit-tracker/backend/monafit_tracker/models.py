
from django.db import models
from django.contrib.auth.models import User

# User Profile model
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    grade = models.CharField(max_length=10, blank=True)
    avatar = models.URLField(blank=True)
    team = models.ForeignKey('Team', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.user.username

# Team model
class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# Activity Log model
class ActivityLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=50)
    duration_minutes = models.PositiveIntegerField()
    distance_km = models.FloatField(null=True, blank=True)
    points_earned = models.PositiveIntegerField(default=0)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.activity_type} on {self.date}"

# Leaderboard model
class Leaderboard(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    total_points = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.team.name} - {self.total_points} points"
