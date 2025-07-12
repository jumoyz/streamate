/**
 * Charts Module
 * Handles all chart-related functionality
 */
function initCharts() {
    if (window.revenueChart && typeof window.revenueChart.destroy === 'function') {
        window.revenueChart.destroy();
    }
    
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    window.revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
            datasets: [{
                label: 'Monthly Revenue',
                data: [1200, 1900, 1500, 2000, 2200, 2500, 2800, 3000, 3200, 3500, 3800],
                borderColor: '#6c5ce7',
                backgroundColor: 'rgba(108, 92, 231, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // ... other chart initialization
}

export function initRevenueChart(ctx, data) {
    if (window.revenueChart && typeof window.revenueChart.destroy === 'function') {
        window.revenueChart.destroy();
    }
    window.revenueChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: { responsive: true }
    });
}

export function initServiceChart(ctx, data) {
    if (window.serviceChart && typeof window.serviceChart.destroy === 'function') {
        window.serviceChart.destroy();
    }
    window.serviceChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: { responsive: true }
    });
}

export function initReportChart(ctx, data) {
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: { responsive: true }
    });
}

export {
    initCharts
    // ... other exports
};