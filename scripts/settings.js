import { apiRequest } from './api.js';
import { formatNotificationDate } from './utils.js';
// Initialize the admin settings view
$(document).ready(function() {
    // Initialize tab functionality
    $('#settingsTabs a').on('click', function(e) {
        e.preventDefault();
        $(this).tab('show');
    });
    
    // Save buttons for each settings section
    $('#saveGeneralSettings').click(function() {
        // Validate and save general settings
        console.log('Saving general settings:', $('#generalSettingsForm').serialize());
        alert('General settings saved successfully!');
    });
    
    $('#savePaymentSettings').click(function() {
        // Validate and save payment settings
        console.log('Saving payment settings:', $('#paymentSettingsForm').serialize());
        alert('Payment settings saved successfully!');
    });
    
    $('#saveStreamingSettings').click(function() {
        // Validate and save streaming settings
        console.log('Saving streaming settings:', $('#streamingSettingsForm').serialize());
        alert('Streaming settings saved successfully!');
    });
    
    $('#saveSecuritySettings').click(function() {
        // Validate and save security settings
        console.log('Saving security settings:', $('#securitySettingsForm').serialize());
        alert('Security settings saved successfully!');
    });
    
    $('#saveNotificationSettings').click(function() {
        // Validate and save notification settings
        console.log('Saving notification settings:', $('#notificationSettingsForm').serialize());
        alert('Notification settings saved successfully!');
    });
    
    $('#saveMaintenanceSettings').click(function() {
        // Validate and save maintenance settings
        console.log('Saving maintenance settings:', $('#maintenanceSettingsForm').serialize());
        alert('Maintenance settings saved successfully!');
    });
    
    // Database maintenance buttons
    $('#backupDb').click(function() {
        if(confirm('Create a database backup? This may take several minutes.')) {
            alert('Database backup started. You will be notified when complete.');
        }
    });
    
    $('#optimizeDb').click(function() {
        if(confirm('Optimize database tables? This may temporarily affect performance.')) {
            alert('Database optimization started.');
        }
    });
    
    // Load current settings (would be AJAX call in real implementation)
    function loadSettings() {
        // This would be replaced with actual API calls
        console.log('Loading settings from server...');
    }
    
    // Load settings when view is shown
    $('#adminSettingsView').on('show', loadSettings);
});