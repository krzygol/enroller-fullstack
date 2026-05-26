import "./MeetingsList.css";

export default function MeetingsList({
                                         meetings,
                                         username,
                                         onDelete,
                                         onJoin,
                                         onLeave
                                     }) {

    return (
        <table>
            <thead>
            <tr>
                <th>Nazwa spotkania</th>
                <th>Opis</th>
                <th>Uczestnicy</th>
                <th>Akcja</th>
            </tr>
            </thead>

            <tbody>

            {
                meetings.map((meeting, index) => {

                    const isParticipant =
                        meeting.participants?.some(
                            participant => participant.login === username
                        );

                    return (
                        <tr key={index}>

                            <td>{meeting.title}</td>

                            <td>{meeting.description}</td>

                            <td>
                                {meeting.participants?.length || 0}
                            </td>

                            <td>

                                {
                                    isParticipant
                                        ? (
                                            <button
                                                type="button"
                                                onClick={() => onLeave(meeting)}
                                            >
                                                Opuść
                                            </button>
                                        )
                                        : (
                                            <button
                                                type="button"
                                                onClick={() => onJoin(meeting)}
                                            >
                                                Dołącz
                                            </button>
                                        )
                                }

                                <button
                                    type="button"
                                    className="button button-outline button-red"
                                    disabled={meeting.participants?.length > 0}
                                    onClick={() => onDelete(meeting)}
                                >
                                    Usuń
                                </button>

                            </td>

                        </tr>
                    );
                })
            }

            </tbody>
        </table>
    );
}