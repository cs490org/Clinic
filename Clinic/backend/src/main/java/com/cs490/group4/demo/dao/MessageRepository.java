package com.cs490.group4.demo.dao;

import com.cs490.group4.demo.dao.Message;
import com.cs490.group4.demo.security.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findByFromUserIdAndToUserIdOrderBySentTimestampDesc(User fromUserId, User toUserId);
    List<Message> findByAppointmentIdOrderBySentTimestampDesc(Integer appointmentId);

    @Query("from Message where fromUserId.userId = :userId")
    List<Message> findByUserIdGroupByAppointment(Integer userId);
}