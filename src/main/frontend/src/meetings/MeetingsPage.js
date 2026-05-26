import {useEffect, useState} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";

export default function MeetingsPage({username}) {
    const [meetings, setMeetings] = useState([]);
    const [addingNewMeeting, setAddingNewMeeting] = useState(false);

    // const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        const fetchMeetings = async () => {
            const response = await fetch(`/api/meetings`);
            if (response.ok) {
                const meetings = await response.json();
                setMeetings(meetings);
            }
        };
        fetchMeetings();
    }, [/*refresh*/]);

    // function handleNewMeeting(meeting) {
    //     const nextMeetings = [...meetings, meeting];
    //     setMeetings(nextMeetings);
    //     setAddingNewMeeting(false);
    // }

    async function handleNewMeeting(meeting) {
        const response = await fetch('/api/meetings', {
            method: 'POST',
            body: JSON.stringify(meeting),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const savedMeeting = await response.json();
            const nextMeetings = [...meetings, savedMeeting];
            setMeetings(nextMeetings);
            setAddingNewMeeting(false);
            // setRefresh(r => r + 1);
        }
    }

    async function handleDeleteMeeting(meeting) {

        const response = await fetch(`/api/meetings/${meeting.id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            const nextMeetings = meetings.filter(m => m !== meeting);
            setMeetings(nextMeetings);
        }
    }

    // function handleDeleteMeeting(meeting) {
    //     const nextMeetings = meetings.filter(m => m !== meeting);
    //     setMeetings(nextMeetings);
    // }

    async function handleJoinMeeting(meeting) {

        const response = await fetch(`/api/meetings/${meeting.id}/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: username
            })
        });

        if (response.ok) {

            const updatedMeeting = await response.json();

            const nextMeetings = meetings.map(m =>
                m.id === updatedMeeting.id ? updatedMeeting : m
            );

            setMeetings(nextMeetings);
        }
    }

    async function handleLeaveMeeting(meeting) {

        const response = await fetch(`/api/meetings/${meeting.id}/leave`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: username
            })
        });

        if (response.ok) {

            const updatedMeeting = await response.json();

            const nextMeetings = meetings.map(m =>
                m.id === updatedMeeting.id ? updatedMeeting : m
            );

            setMeetings(nextMeetings);
        }
    }

    return (
        <div>
            <h2>Zajęcia ({meetings.length})</h2>
            {
                addingNewMeeting
                    ? <NewMeetingForm onSubmit={(meeting) => handleNewMeeting(meeting)}/>
                    : <button onClick={() => setAddingNewMeeting(true)}>Dodaj nowe spotkanie</button>
            }
            {meetings.length > 0 &&
                <MeetingsList
                    meetings={meetings}
                    username={username}
                    onDelete={handleDeleteMeeting}
                    onJoin={handleJoinMeeting}
                    onLeave={handleLeaveMeeting}
                />
            }

        </div>
    )
}
