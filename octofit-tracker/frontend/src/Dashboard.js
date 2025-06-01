  // Team dashboard state
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamActivities, setTeamActivities] = useState([]);

  // Fetch team members and their activities if user is in a team
  useEffect(() => {
    if (profile && profile.team && token) {
      // Fetch all user profiles in the same team
      fetch('https://special-sniffle-4j77j75qqprf5w7g-8000.app.github.dev/api/userprofiles/', {
        headers: { 'Authorization': `Token ${token}` }
      })
        .then(res => res.json())
        .then(users => {
          const members = users.filter(u => u.team === profile.team);
          setTeamMembers(members);
          // Fetch activities for all team members
          Promise.all(members.map(m =>
            fetch(`https://special-sniffle-4j77j75qqprf5w7g-8000.app.github.dev/api/activitylogs/?user=${m.user.id}`, {
              headers: { 'Authorization': `Token ${token}` }
            }).then(res => res.json())
          )).then(actsArr => {
            setTeamActivities(actsArr.flat());
          });
        });
    } else {
      setTeamMembers([]);
      setTeamActivities([]);
    }
  }, [profile, token]);
      {/* Team Dashboard */}
      {profile && profile.team && (
        <div style={{ marginTop: 30 }}>
          <h4>Your Team Dashboard</h4>
          <div><strong>Members:</strong></div>
          <ul>
            {teamMembers.length > 0 ? teamMembers.map(m => (
              <li key={m.id}>{m.user.username} {m.bio && `- ${m.bio}`}</li>
            )) : <li>No team members found.</li>}
          </ul>
          <div><strong>Team Activities:</strong></div>
          <ul>
            {teamActivities.length > 0 ? teamActivities.map(a => (
              <li key={a.id}>{a.user.username}: {a.activity_type} - {a.duration_minutes} min - {a.distance_km || 0} km on {a.date}</li>
            )) : <li>No team activities yet.</li>}
          </ul>
        </div>
      )}
import React, { useEffect, useState } from 'react';

export default function Dashboard({ user, token }) {
  const [teams, setTeams] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [teamMessage, setTeamMessage] = useState('');
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activityType, setActivityType] = useState('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      fetch('https://special-sniffle-4j77j75qqprf5w7g-8000.app.github.dev/api/userprofiles/me/', {
        headers: { 'Authorization': `Token ${token}` }
      })
        .then(res => res.json())
        .then(setProfile);
      fetch('https://special-sniffle-4j77j75qqprf5w7g-8000.app.github.dev/api/activitylogs/', {
        headers: { 'Authorization': `Token ${token}` }
      })
        .then(res => res.json())
        .then(setActivities);
      fetch('https://special-sniffle-4j77j75qqprf5w7g-8000.app.github.dev/api/teams/', {
        headers: { 'Authorization': `Token ${token}` }
      })
        .then(res => res.json())
        .then(setTeams);
      fetch('https://special-sniffle-4j77j75qqprf5w7g-8000.app.github.dev/api/leaderboards/', {
        headers: { 'Authorization': `Token ${token}` }
      })
        .then(res => res.json())
        .then(setLeaderboard);
    }
  }, [token]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setTeamMessage('');
    const response = await fetch('https://special-sniffle-4j77j75qqprf5w7g-8000.app.github.dev/api/teams/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ name: newTeamName, description: newTeamDesc })
    });
    if (response.ok) {
      setTeamMessage('Team created!');
      setNewTeamName(''); setNewTeamDesc('');
      // Refresh teams
      const ts = await fetch('https://special-sniffle-4j77j75qqprf5w7g-8000.app.github.dev/api/teams/', {
        headers: { 'Authorization': `Token ${token}` }
      }).then(res => res.json());
      setTeams(ts);
    } else {
      const error = await response.text();
      setTeamMessage('Failed to create team: ' + error);
    }
  };

  // Optionally, add join team logic here if you want users to join a team

  const handleLogActivity = async (e) => {
    e.preventDefault();
    setMessage('');
    const response = await fetch('https://special-sniffle-4j77j75qqprf5w7g-8000.app.github.dev/api/activitylogs/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({
        activity_type: activityType,
        duration_minutes: Number(duration),
        distance_km: Number(distance)
      })
    });
    if (response.ok) {
      setMessage('Activity logged!');
      setActivityType(''); setDuration(''); setDistance('');
      // Refresh activities
      const acts = await fetch('https://special-sniffle-4j77j75qqprf5w7g-8000.app.github.dev/api/activitylogs/', {
        headers: { 'Authorization': `Token ${token}` }
      }).then(res => res.json());
      setActivities(acts);
    } else {
      setMessage('Failed to log activity');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Welcome, {user && user.username}!</h2>
      {profile && (
        <div style={{ marginBottom: 20 }}>
          <strong>Profile:</strong>
          <form
            onSubmit={async e => {
              e.preventDefault();
              const response = await fetch(`https://special-sniffle-4j77j75qqprf5w7g-8000.app.github.dev/api/userprofiles/${profile.id}/`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                  grade: profile.grade,
                  bio: profile.bio,
                  avatar: profile.avatar
                })
              });
              if (response.ok) {
                alert('Profile updated!');
              } else {
                alert('Failed to update profile');
              }
            }}
            style={{ marginBottom: 10 }}
          >
            <div>
              Grade: <input value={profile.grade || ''} onChange={e => setProfile({ ...profile, grade: e.target.value })} className="form-control mb-2" />
            </div>
            <div>
              Bio: <input value={profile.bio || ''} onChange={e => setProfile({ ...profile, bio: e.target.value })} className="form-control mb-2" />
            </div>
            <div>
              Avatar URL: <input value={profile.avatar || ''} onChange={e => setProfile({ ...profile, avatar: e.target.value })} className="form-control mb-2" />
            </div>
            <div>Team: {profile.team || 'N/A'}</div>
            <button type="submit" className="btn btn-info mt-2">Update Profile</button>
          </form>
        </div>
      )}
      <form onSubmit={handleLogActivity} style={{ marginBottom: 20 }}>
        <h4>Log Activity</h4>
        <input placeholder="Activity Type" value={activityType} onChange={e => setActivityType(e.target.value)} className="form-control mb-2" />
        <input placeholder="Duration (minutes)" value={duration} onChange={e => setDuration(e.target.value)} className="form-control mb-2" />
        <input placeholder="Distance (km)" value={distance} onChange={e => setDistance(e.target.value)} className="form-control mb-2" />
        <button type="submit" className="btn btn-primary">Log Activity</button>
        <div className="mt-2 text-success">{message}</div>
      </form>
      <div>
        <h4>Your Activities</h4>
        <div className="mb-2">
          <input
            placeholder="Filter by type"
            className="form-control mb-2"
            value={activityTypeFilter || ''}
            onChange={e => setActivityTypeFilter(e.target.value)}
          />
          <input
            type="date"
            className="form-control mb-2"
            value={activityDateFilter || ''}
            onChange={e => setActivityDateFilter(e.target.value)}
          />
        </div>
        <ul>
          {activities && activities.length > 0 ? activities
            .filter(a =>
              (!activityTypeFilter || a.activity_type.toLowerCase().includes(activityTypeFilter.toLowerCase())) &&
              (!activityDateFilter || a.date === activityDateFilter)
            )
            .map(a => (
              <li key={a.id}>{a.activity_type} - {a.duration_minutes} min - {a.distance_km || 0} km on {a.date}</li>
            )) : <li>No activities yet.</li>}
        </ul>
      </div>
// Add state for activity filtering
const [activityTypeFilter, setActivityTypeFilter] = useState('');
const [activityDateFilter, setActivityDateFilter] = useState('');
      <div style={{ marginTop: 30 }}>
        <h4>Teams</h4>
        <form onSubmit={handleCreateTeam} style={{ marginBottom: 10 }}>
          <input placeholder="Team Name" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} className="form-control mb-2" />
          <input placeholder="Description" value={newTeamDesc} onChange={e => setNewTeamDesc(e.target.value)} className="form-control mb-2" />
          <button type="submit" className="btn btn-secondary">Create Team</button>
          <div className="mt-2 text-success">{teamMessage}</div>
        </form>
        <ul>
          {teams && teams.length > 0 ? teams.map(t => (
            <li key={t.id}>
              {t.name} - {t.description}
              {profile && (!profile.team || profile.team !== t.id) && (
                <button
                  className="btn btn-sm btn-outline-primary ms-2"
                  onClick={async () => {
                    setTeamMessage('');
                    const response = await fetch(`https://special-sniffle-4j77j75qqprf5w7g-8000.app.github.dev/api/userprofiles/${profile.id}/`, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                      },
                      body: JSON.stringify({ team: t.id })
                    });
                    if (response.ok) {
                      setTeamMessage('Joined team!');
                      // Refresh profile
                      const prof = await fetch('https://special-sniffle-4j77j75qqprf5w7g-8000.app.github.dev/api/userprofiles/me/', {
                        headers: { 'Authorization': `Token ${token}` }
                      }).then(res => res.json());
                      setProfile(prof);
                    } else {
                      setTeamMessage('Failed to join team');
                    }
                  }}
                >Join</button>
              )}
              {profile && profile.team === t.id && <span className="ms-2 text-success">(Your team)</span>}
            </li>
          )) : <li>No teams yet.</li>}
        </ul>
      </div>
      <div style={{ marginTop: 30 }}>
        <h4>Leaderboard</h4>
        <ul>
          {leaderboard && leaderboard.length > 0 ? leaderboard.map(l => (
            <li key={l.id}>{l.team?.name || 'Unknown'} - {l.total_points} points</li>
          )) : <li>No leaderboard data yet.</li>}
        </ul>
      </div>
    </div>
  );
}
