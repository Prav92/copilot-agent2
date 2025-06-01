from django.core.management.base import BaseCommand
from octofit_tracker.models import OctofitUser, Team, Activity, Leaderboard, Workout
from django.utils import timezone
from django.db import transaction

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data for users, teams, activities, leaderboard, and workouts.'

    def handle(self, *args, **options):
        with transaction.atomic():
            # Clear existing data
            Activity.objects.all().delete()
            Leaderboard.objects.all().delete()
            Workout.objects.all().delete()
            Team.objects.all().delete()
            OctofitUser.objects.all().delete()

            # Create users
            users = [
                OctofitUser(username='thundergod', email='thundergod@mhigh.edu'),
                OctofitUser(username='metalgeek', email='metalgeek@mhigh.edu'),
                OctofitUser(username='zerocool', email='zerocool@mhigh.edu'),
                OctofitUser(username='crashoverride', email='crashoverride@hmhigh.edu'),
                OctofitUser(username='sleeptoken', email='sleeptoken@mhigh.edu'),
            ]
            for user in users:
                user.set_password('testpassword')
                user.save()

            # Create teams
            blue_team = Team.objects.create(name='Blue Team', description='The blue team')
            gold_team = Team.objects.create(name='Gold Team', description='The gold team')

            # Assign users to teams
            users[0].team = blue_team
            users[1].team = blue_team
            users[2].team = gold_team
            users[3].team = gold_team
            users[4].team = gold_team
            for user in users:
                user.save()

            # Create activities
            activities = [
                Activity(user=users[0], activity_type='Cycling', duration_minutes=60, distance_km=20.0, points_earned=100),
                Activity(user=users[1], activity_type='Crossfit', duration_minutes=120, distance_km=None, points_earned=90),
                Activity(user=users[2], activity_type='Running', duration_minutes=90, distance_km=15.0, points_earned=95),
                Activity(user=users[3], activity_type='Strength', duration_minutes=30, distance_km=None, points_earned=85),
                Activity(user=users[4], activity_type='Swimming', duration_minutes=75, distance_km=2.0, points_earned=80),
            ]
            Activity.objects.bulk_create(activities)

            # Create leaderboard entries
            Leaderboard.objects.create(team=blue_team, total_points=190)
            Leaderboard.objects.create(team=gold_team, total_points=260)

            # Create workouts
            workouts = [
                Workout(name='Cycling Training', description='Training for a road cycling event', difficulty='Medium', duration_minutes=60, created_by=users[0]),
                Workout(name='Crossfit', description='Training for a crossfit competition', difficulty='Hard', duration_minutes=120, created_by=users[1]),
                Workout(name='Running Training', description='Training for a marathon', difficulty='Medium', duration_minutes=90, created_by=users[2]),
                Workout(name='Strength Training', description='Training for strength', difficulty='Hard', duration_minutes=30, created_by=users[3]),
                Workout(name='Swimming Training', description='Training for a swimming competition', difficulty='Medium', duration_minutes=75, created_by=users[4]),
            ]
            Workout.objects.bulk_create(workouts)

            self.stdout.write(self.style.SUCCESS('Successfully populated the database with test data.'))
