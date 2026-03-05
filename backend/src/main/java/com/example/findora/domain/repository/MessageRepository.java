package com.example.findora.domain.repository;

import com.example.findora.domain.entity.Message;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findBySenderId(Long senderId);

    List<Message> findByRecipientId(Long recipientId);

    @Query("SELECT m FROM Message m WHERE (m.sender.id = :senderId AND m.recipient.id = :recipientId) OR (m.sender.id = :recipientId AND m.recipient.id = :senderId) ORDER BY m.createdAt DESC")
    List<Message> findConversation(@Param("senderId") Long senderId, @Param("recipientId") Long recipientId);

    @Query("SELECT m FROM Message m WHERE m.recipient.id = :recipientId AND m.isRead = false")
    List<Message> findUnreadMessagesForUser(@Param("recipientId") Long recipientId);
}
