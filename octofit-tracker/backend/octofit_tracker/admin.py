from django.contrib import admin
from .models import OctofitUser, Team, Activity, Leaderboard, Workout

admin.site.register(OctofitUser)
admin.site.register(Team)
admin.site.register(Activity)
admin.site.register(Leaderboard)
admin.site.register(Workout)
