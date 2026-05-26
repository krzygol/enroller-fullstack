package com.company.enroller.persistence;

import com.company.enroller.model.Meeting;
import com.company.enroller.model.Participant;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Optional;

@Component("meetingService")
public class MeetingService {

    Session session;

    @Autowired
    private ParticipantService participantService;

    public MeetingService() {
        session = DatabaseConnector.getInstance().getSession();
    }

    public Collection<Meeting> getAll() {
        String hql = "FROM Meeting";
        Query query = this.session.createQuery(hql);
        return query.list();
    }

//    public Meeting findById(long id) {
//
//        System.out.println("Searching meeting id = " + id);
//
//        Meeting meeting =  this.session.get(Meeting.class, id);
//
//        System.out.println("Found = " + meeting);
//
//        return meeting;
//    }

    public Meeting findById(long id) {

        String hql = "FROM Meeting WHERE id = :id";

        Query query = this.session.createQuery(hql);

        query.setParameter("id", id);

        return (Meeting) query.uniqueResult();
    }

    public Collection<Meeting> findMeetings(String title, String description, Participant participant, String sortMode) {
        String hql = "FROM Meeting as meeting WHERE title LIKE :title AND description LIKE :description ";
        if (participant != null) {
            hql += " AND :participant in elements(participants)";
        }
        if (sortMode.equals("title")) {
            hql += " ORDER BY title";
        }
        Query query = this.session.createQuery(hql);
        query.setParameter("title", "%" + title + "%").setParameter("description", "%" + description + "%");
        if (participant != null) {
            query.setParameter("participant", participant);
        }
        return query.list();
    }

//    public void delete(Meeting meeting) {
//        Transaction transaction = this.session.beginTransaction();
//        this.session.delete(meeting);
//        transaction.commit();
//    }

    public boolean deleteMeeting(long id) {

        Meeting meeting = this.findById(id);

        if (meeting == null) {
            return false;
        }

        if (!meeting.getParticipants().isEmpty()) {
            return false;
        }

        Transaction transaction = session.beginTransaction();

        session.delete(meeting);

        transaction.commit();

        return true;
    }

    public void add(Meeting meeting) {
        Transaction transaction = this.session.beginTransaction();
        this.session.save(meeting);
        transaction.commit();
    }

    public void update(Meeting meeting) {
        Transaction transaction = this.session.beginTransaction();
        this.session.merge(meeting);
        transaction.commit();
    }

    public boolean alreadyExist(Meeting meeting) {
        String hql = "FROM Meeting WHERE title=:title AND date=:date";
        Query query = this.session.createQuery(hql);
        Collection resultList = query.setParameter("title", meeting.getTitle()).setParameter("date", meeting.getDate())
                .list();
        return query.list().size() != 0;
    }

    public Meeting joinMeeting(long meetingId, String login) {

        System.out.println("LOGIN = " + login);
        System.out.println("meetingId = " + meetingId);

        Meeting meeting = this.findById(meetingId);

        System.out.println("MEETING = " + meeting);

        if (meeting == null) {
            return null;
        }

        Participant participant =
                participantService.findByLogin(login);

        System.out.println("PARTICIPANT = " + participant);

        if (participant == null) {
            return null;
        }

        meeting.addParticipant(participant);

        Transaction transaction = session.beginTransaction();

        session.saveOrUpdate(meeting);

        transaction.commit();

        return meeting;
    }

    public Meeting leaveMeeting(long meetingId, String login) {

        Meeting meeting = this.findById(meetingId);

        if (meeting == null) {
            return null;
        }

        Participant participant =
                participantService.findByLogin(login);

        if (participant == null) {
            return null;
        }

        meeting.removeParticipant(participant);

        Transaction transaction = session.beginTransaction();

        session.saveOrUpdate(meeting);

        transaction.commit();

        return meeting;
    }
}
