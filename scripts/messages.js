/**
 * Messaging Module
 * Handles user feedback and support messages
 */
import { apiRequest } from './api.js';
import { formatNotificationDate } from './utils.js';

async function handleFeedbackSubmit(e) {
    e.preventDefault();
    
    const form = document.getElementById('feedbackForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
        
        const feedbackData = {
            name: document.getElementById('feedbackFirstName').value,
            email: document.getElementById('feedbackEmail').value,
            subject: document.getElementById('feedbackSubject').value,
            message: document.getElementById('feedbackMessage').value,
            user_id: currentUser?.id || null
        };
        
        const response = await apiRequest('submit_feedback', 'POST', feedbackData);
        
        if (response.success) {
            alert('Thank you for your feedback! We will get back to you soon.');
            form.reset();
        } else {
            throw new Error(response.message || 'Failed to submit feedback');
        }
    } catch (error) {
        console.error('Feedback submission error:', error);
        alert('Failed to submit feedback. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

$(document).ready(function() {
    // Initialize select2 for recipient selection
    $('.select2').select2({
        placeholder: "Select recipients",
        allowClear: true
    });
    
    // Handle view message button click
    $('.view-message').click(function() {
        var messageId = $(this).data('id');
        // In a real application, you would fetch the message details via AJAX
        // For this example, we'll use dummy data
        $('#viewMessageModal').modal('show');
    });
    
    // Handle send message button
    $('#sendMessageBtn').click(function() {
        // Validate and send message
        if ($('#messageForm')[0].checkValidity()) {
            // AJAX call to send message would go here
            alert('Message sent successfully!');
            $('#sendMessageModal').modal('hide');
            $('#messageForm')[0].reset();
        } else {
            $('#messageForm')[0].reportValidity();
        }
    });
    
    // Handle send bulk message button
    $('#sendBulkMessageBtn').click(function() {
        // Validate and send bulk message
        if ($('#bulkMessageForm')[0].checkValidity()) {
            // AJAX call to send bulk message would go here
            alert('Bulk message sent successfully!');
            $('#bulkMessageModal').modal('hide');
            $('#bulkMessageForm')[0].reset();
        } else {
            $('#bulkMessageForm')[0].reportValidity();
        }
    });
    
    // Handle send reply button
    $('#sendReplyBtn').click(function() {
        // Validate and send reply
        if ($('#replyMessageForm')[0].checkValidity()) {
            // AJAX call to send reply would go here
            alert('Reply sent successfully!');
            $('#viewMessageModal').modal('hide');
            $('#replyMessageForm')[0].reset();
        } else {
            $('#replyMessageForm')[0].reportValidity();
        }
    });
});


export {
    handleFeedbackSubmit
    // ... other exports
};
