from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Team, ActivityLog, Leaderboard

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'bio', 'grade', 'avatar', 'team']

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'created_at']

class ActivityLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = ActivityLog
        fields = ['id', 'user', 'activity_type', 'duration_minutes', 'distance_km', 'points_earned', 'date']

class LeaderboardSerializer(serializers.ModelSerializer):
    team = TeamSerializer(read_only=True)
    class Meta:
        model = Leaderboard
        fields = ['id', 'team', 'total_points', 'last_updated']
