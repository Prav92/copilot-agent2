from django.test import TestCase
from .models import OctofitUser, Team, Activity, Leaderboard, Workout

class OctofitUserModelTest(TestCase):
    def test_create_user(self):
        user = OctofitUser.objects.create(username='testuser', email='test@example.com')
        self.assertEqual(user.username, 'testuser')

class TeamModelTest(TestCase):
    def test_create_team(self):
        team = Team.objects.create(name='Test Team')
        self.assertEqual(team.name, 'Test Team')

class ActivityModelTest(TestCase):
    def test_create_activity(self):
        user = OctofitUser.objects.create(username='testuser2', email='test2@example.com')
        activity = Activity.objects.create(user=user, activity_type='run', duration_minutes=30)
        self.assertEqual(activity.activity_type, 'run')

class LeaderboardModelTest(TestCase):
    def test_create_leaderboard(self):
        team = Team.objects.create(name='Test Team 2')
        leaderboard = Leaderboard.objects.create(team=team, total_points=100)
        self.assertEqual(leaderboard.total_points, 100)

class WorkoutModelTest(TestCase):
    def test_create_workout(self):
        user = OctofitUser.objects.create(username='testuser3', email='test3@example.com')
        workout = Workout.objects.create(name='Pushups', created_by=user, duration_minutes=10, difficulty='Easy')
        self.assertEqual(workout.name, 'Pushups')
