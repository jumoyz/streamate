// File: scripts/messages.js
import { apiRequest } from './api.js';
import { formatNotificationDate } from './utils.js';

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
