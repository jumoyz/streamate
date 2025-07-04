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