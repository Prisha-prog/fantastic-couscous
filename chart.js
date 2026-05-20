
let bloodPressureChart = null;

function renderChart(data) {
    console.log("Creating line chart...");
    
    const canvas = document.getElementById('bloodPressureChart');
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    
    // Clear previous chart
    if (bloodPressureChart) {
        bloodPressureChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    
    // Use the data passed in or use fallback
    let labels = ['Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024', 'Feb 2024', 'Mar 2024'];
    let values = [180, 160, 140, 120, 100, 80];
    
   
    if (data && Array.isArray(data) && data.length > 0) {
        labels = [];
        values = [];
        data.forEach(item => {
            labels.push(item.month || 'Month');
            values.push(item.value || 0);
        });
    }
    

    bloodPressureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Blood Pressure',
                data: values,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#3498db',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Blood Pressure: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 60,
                    max: 200,
                    ticks: {
                        stepSize: 20
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
    
    console.log("Line chart created successfully!");
}

// Create a fallback chart when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("Chart.js loaded");
    
    // Render chart immediately
    renderChart();
});


let bloodPressureChart = null;

// Sample data for different time ranges
const chartData = {
    '3': {
        labels: ['Jan 2024', 'Feb 2024', 'Mar 2024'],
        systolic: [125, 110, 100],
        diastolic: [118, 105, 102],
        pulse: [128, 132, 135]
    },
    '6': {
        labels: ['Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024', 'Feb 2024', 'Mar 2024'],
        systolic: [160, 155, 158, 125, 110, 100],
        diastolic: [138, 130, 162, 118, 105, 102],
        pulse: [105, 115, 120, 128, 132, 135]
    },
    '12': {
        labels: ['Apr 2023', 'May 2023', 'Jun 2023', 'Jul 2023', 'Aug 2023', 'Sep 2023', 
                 'Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024', 'Feb 2024', 'Mar 2024'],
        systolic: [175, 170, 168, 165, 162, 160, 155, 158, 125, 110, 100, 95],
        diastolic: [145, 142, 140, 145, 148, 138, 130, 162, 118, 105, 102, 100],
        pulse: [95, 98, 100, 102, 105, 105, 115, 120, 128, 132, 135, 138]
    }
};

function initChart(months = '6') {
    const canvas = document.getElementById('bloodPressureChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear previous chart
    if (bloodPressureChart) {
        bloodPressureChart.destroy();
    }
    
    const data = chartData[months];
    
    // Create the chart
    bloodPressureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Systolic',
                    data: data.systolic,
                    borderColor: 'pink',
                    backgroundColor: 'rgba(255, 182, 193, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    pointBackgroundColor: 'pink',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Diastolic',
                    data: data.diastolic,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    pointBackgroundColor: '#3498db',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Pulse',
                    data: data.pulse,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    pointBackgroundColor: '#e74c3c',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    hidden: true // Hide pulse by default
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#2c3e50',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: '#3498db',
                    borderWidth: 1,
                    cornerRadius: 6,
                    padding: 10,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y;
                            if (context.dataset.label === 'Pulse') {
                                label += ' bpm';
                            } else {
                                label += ' mmHg';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 60,
                    max: 180,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        stepSize: 20,
                        color: '#7f8c8d',
                        font: {
                            size: 10
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#7f8c8d',
                        font: {
                            size: 10
                        },
                        maxRotation: 45
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
    
  
    const rangeDisplay = document.querySelector('.bp-current-range');
    if (rangeDisplay) {
        rangeDisplay.textContent = `Last ${months} months`;
    }
}

// Setup time filter buttons
function setupTimeFilters() {
    const timeButtons = document.querySelectorAll('.time-btn');
    const rangeDisplay = document.querySelector('.bp-current-range');
    
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            timeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart
            const months = this.getAttribute('data-months');
            initChart(months);
            
            // Update range display
            if (rangeDisplay) {
                rangeDisplay.textContent = `Last ${months} months`;
            }
        });
    });
}

// Make metrics interactive
function setupMetricsInteractivity() {
    const metricCards = document.querySelectorAll('.metric-card.white');
    const chartContainer = document.querySelector('.bp-chart-container');
    
    metricCards.forEach(card => {
        card.addEventListener('click', function() {
            // Highlight the clicked card
            metricCards.forEach(c => c.style.opacity = '0.6');
            this.style.opacity = '1';
            this.style.boxShadow = '0 0 0 2px #3498db';
            
            // Get metric type
            const title = this.querySelector('.metric-title').textContent;
            const chart = bloodPressureChart;
            
            if (!chart) return;
            
            // Show/hide lines based on clicked metric
            if (title.includes('Respiratory') || title.includes('Temperature')) {
                // Show all lines
                chart.data.datasets.forEach(dataset => {
                    dataset.hidden = false;
                });
            } else if (title.includes('Heart')) {
                // Show only pulse line
                chart.data.datasets.forEach((dataset, index) => {
                    dataset.hidden = (index !== 2); 
                });
            }
            
            chart.update();
            
            // Reset after 3 seconds
            setTimeout(() => {
                metricCards.forEach(c => {
                    c.style.opacity = '1';
                    c.style.boxShadow = 'none';
                });
                
              
                chart.data.datasets.forEach((dataset, index) => {
                    dataset.hidden = (index === 2); 
                });
                chart.update();
            }, 3000);
        });
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize chart with 6 months data
    initChart('6');
    
    // Setup time filters
    setupTimeFilters();
    
    // Setup metrics interactivity
    setupMetricsInteractivity();
    
    // Update chart when lab results are clicked
    const labItems = document.querySelectorAll('.lab-item');
    labItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.textContent.toLowerCase();
            const chart = bloodPressureChart;
            
            if (!chart) return;
            
            // Highlight pulse line for heart-related tests
            if (text.includes('heart') || text.includes('pulse') || text.includes('rate')) {
                chart.data.datasets.forEach((dataset, index) => {
                    if (dataset.label === 'Pulse') {
                        dataset.borderWidth = 4;
                        dataset.borderColor = '#c0392b';
                        dataset.pointRadius = 6;
                    } else {
                        dataset.borderWidth = 1;
                        dataset.pointRadius = 4;
                    }
                });
            }
            
            chart.update();
            
            // Reset after 2 seconds
            setTimeout(() => {
                chart.data.datasets.forEach((dataset, index) => {
                    if (dataset.label === 'Systolic') {
                        dataset.borderColor = 'pink';
                        dataset.borderWidth = 2;
                        dataset.pointRadius = 4;
                    } else if (dataset.label === 'Diastolic') {
                        dataset.borderColor = '#3498db';
                        dataset.borderWidth = 2;
                        dataset.pointRadius = 4;
                    } else if (dataset.label === 'Pulse') {
                        dataset.borderColor = '#e74c3c';
                        dataset.borderWidth = 2;
                        dataset.pointRadius = 4;
                    }
                });
                chart.update();
            }, 2000);
        });
    });
});