from rest_framework import serializers
from .models import OctofitUser, Team, Activity, Leaderboard, Workout

class OctofitUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = OctofitUser
        fields = ['id', 'username', 'email', 'bio', 'grade', 'avatar', 'team']

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'created_at']

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'user', 'activity_type', 'duration_minutes', 'distance_km', 'points_earned', 'date']

class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leaderboard
        fields = ['id', 'team', 'total_points', 'last_updated']

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'difficulty', 'duration_minutes', 'created_by']
