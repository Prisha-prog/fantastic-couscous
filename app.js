
let chartInstance = null;

async function fetchPatientData() {
    try {
        console.log("Fetching data from API...");
        const response = await fetch("https://fedskillstest.coalitiontechnologies.workers.dev/", {
            headers: {
                'Authorization': 'skillstest'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API Response:", data);
        
      
        const jessica = data.find(patient => patient.name === "Jessica Taylor");
        
        if (jessica) {
            console.log("Found Jessica Taylor:", jessica);
            updateUI(jessica);
        } else {
            console.warn("Jessica Taylor not found in API response");
            useFallbackData();
        }
        
    } catch (error) {
        console.error("Error fetching patient data:", error);
        useFallbackData();
    }
}

function updateUI(patient) {
  
    document.getElementById("patient-name").textContent = patient.name || "Jessica Taylor";
    document.getElementById("patient-name-header").textContent = patient.name || "Jessica Taylor";
    document.getElementById("patient-dob").textContent = patient.date_of_birth || "August 23, 1996";
    document.getElementById("patient-gender").textContent = patient.gender || "Female";
    document.getElementById("patient-contact").textContent = patient.contact_info || "(415) 555-1234";
    document.getElementById("patient-emergency").textContent = patient.emergency_contact || "(415) 555-5678";
    document.getElementById("patient-insurance").textContent = patient.insurance_provider || "Sunrise Health Assurance";
    
   
    if (patient.diagnosis && patient.diagnosis.length > 0) {
        renderDiagnostics(patient.diagnosis);
    } else {
        renderDiagnostics(getFallbackDiagnostics());
    }
    

    if (patient.lab_results && patient.lab_results.length > 0) {
        renderLabResults(patient.lab_results);
    } else {
        renderLabResults(getFallbackLabResults());
    }
}

function renderDiagnostics(diagnosisList) {
    const tableBody = document.getElementById("diagnostic-table-body");
    
    let html = '';
    diagnosisList.forEach(diagnosis => {
        let statusClass = '';
        if (diagnosis.status === 'Under Observation') statusClass = 'status-observation';
        else if (diagnosis.status === 'Inactive' || diagnosis.status === 'Cured inactive') statusClass = 'status-inactive';
        else if (diagnosis.status === 'Lower than Average' || diagnosis.status === 'Lover than Average') statusClass = 'status-low';
        
        html += `
            <tr>
                <td>${diagnosis.name || diagnosis.problem}</td>
                <td>${diagnosis.description || ''}</td>
                <td><span class="status-badge ${statusClass}">${diagnosis.status}</span></td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

function renderLabResults(results) {
    const labGrid = document.getElementById("lab-results-grid");
    
    let html = '';
    results.forEach(result => {
        html += `
            <div class="lab-item">
                <div style="font-weight: 500; margin-bottom: 5px;">${result.test || result.name || result}</div>
                <div style="font-size: 0.85rem; color: #7f8c8d;">${result.date || 'Recent'}</div>
            </div>
        `;
    });
    
  
    if (results.length < 4) {
        const additionalItems = ['Blood Tests', 'CT Scans', 'Radiology Reports', 'X-Rays'];
        additionalItems.slice(results.length).forEach(item => {
            html += `
                <div class="lab-item">
                    <div style="font-weight: 500; margin-bottom: 5px;">${item}</div>
                    <div style="font-size: 0.85rem; color: #7f8c8d;">Recent</div>
                </div>
            `;
        });
    }
    
    labGrid.innerHTML = html;
}

function useFallbackData() {
    console.log("Using fallback data...");
    
    const fallbackPatient = {
        name: "Jessica Taylor",
        gender: "Female",
        age: 28,
        date_of_birth: "August 23, 1996",
        contact_info: "(415) 555-1234",
        emergency_contact: "(415) 555-5678",
        insurance_provider: "Sunrise Health Assurance"
    };
    
    updateUI(fallbackPatient);
}

function getFallbackDiagnostics() {
    return [
        {
            name: "Hypertension",
            description: "Chronic high blood pressure",
            status: "Under Observation"
        },
        {
            name: "Type 2 Diabetes",
            description: "Insulin resistance and elevated blood sugar",
            status: "Inactive"
        },
        {
            name: "Asthma",
            description: "Recurrent episodes of bronchial constriction",
            status: "Lower than Average"
        }
    ];
}

function getFallbackLabResults() {
    return [
        { test: "Blood Tests", date: "Mar 2024" },
        { test: "CT Scans", date: "Feb 2024" }
    ];
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded, fetching data...");
    fetchPatientData();
});


function setupChartInteractivity() {
    const labItems = document.querySelectorAll('.lab-item');
    const dataPoints = document.querySelectorAll('.data-point');
    
    labItems.forEach(labItem => {
        labItem.addEventListener('click', function() {
            const labType = this.textContent.trim();
            
            // Reset all points
            dataPoints.forEach(point => {
                point.style.opacity = '0.3';
                point.style.transform = 'translate(-50%, -50%) scale(0.8)';
            });
            
            // Highlight relevant points based on lab type
            if (labType.includes('Blood') || labType.includes('Pressure')) {
                // Highlight blood pressure points (systolic and diastolic)
                document.querySelectorAll('.data-point.systolic, .data-point.diastolic').forEach(point => {
                    point.style.opacity = '1';
                    point.style.transform = 'translate(-50%, -50%) scale(1.2)';
                    point.style.boxShadow = '0 0 10px rgba(52, 152, 219, 0.5)';
                });
            } else if (labType.includes('Heart') || labType.includes('Pulse')) {
                // Highlight pulse points
                document.querySelectorAll('.data-point.pulse').forEach(point => {
                    point.style.opacity = '1';
                    point.style.transform = 'translate(-50%, -50%) scale(1.2)';
                    point.style.boxShadow = '0 0 10px rgba(231, 76, 60, 0.5)';
                });
            } else {
                // Highlight all points for other tests
                dataPoints.forEach(point => {
                    point.style.opacity = '1';
                    point.style.transform = 'translate(-50%, -50%) scale(1)';
                    point.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                });
            }
        });
    });
    
    // Add hover effects to data points
    dataPoints.forEach(point => {
        point.addEventListener('mouseenter', function() {
            const type = this.classList[1]; // systolic, diastolic, or pulse
            const value = this.getAttribute('data-value');
            const month = this.getAttribute('data-month');
            
            // Update patient details with hovered point info
            const detailElement = document.createElement('div');
            detailElement.className = 'chart-hover-info';
            detailElement.innerHTML = `
                <strong>${type.toUpperCase()}:</strong> ${value} 
                <strong>Month:</strong> ${month}
            `;
            
            // Add to patient details or show in a tooltip
            console.log(`Hovering over ${type}: ${value} in ${month}`);
        });
    });
}

// Call this function after renderLabResults
function renderLabResults(results) {
    const labGrid = document.getElementById("lab-results-grid");
    
    let html = '';
    results.forEach(result => {
        html += `
            <div class="lab-item">
                <div style="font-weight: 500; margin-bottom: 5px;">${result.test || result.name || result}</div>
                <div style="font-size: 0.85rem; color: #7f8c8d;">${result.date || 'Recent'}</div>
            </div>
        `;
    });
    
    // Add more lab items if needed
    if (results.length < 4) {
        const additionalItems = ['Blood Tests', 'CT Scans', 'Radiology Reports', 'X-Rays'];
        additionalItems.slice(results.length).forEach(item => {
            html += `
                <div class="lab-item">
                    <div style="font-weight: 500; margin-bottom: 5px;">${item}</div>
                    <div style="font-size: 0.85rem; color: #7f8c8d;">Recent</div>
                </div>
            `;
        });
    }
    
    labGrid.innerHTML = html;
    
    // Setup chart interactivity AFTER lab results are rendered
    setTimeout(setupChartInteractivity, 100);
}

// Add interactivity to the multi-line chart
function setupChartInteractivity() {
    console.log("Setting up chart interactivity...");
    
    // Get all data points
    const dataPoints = document.querySelectorAll('.data-point');
    const labItems = document.querySelectorAll('.lab-item');
    
    // Add hover effects to data points
    dataPoints.forEach(point => {
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'chart-tooltip';
        
        point.addEventListener('mouseenter', function(e) {
            const type = this.classList[1];
            const value = this.getAttribute('data-value');
            const month = this.getAttribute('data-month');
            
            // Create tooltip
            tooltip.textContent = `${type}: ${value} (${month})`;
            tooltip.style.position = 'absolute';
            tooltip.style.left = e.clientX + 'px';
            tooltip.style.top = e.clientY - 40 + 'px';
            document.body.appendChild(tooltip);
            
            // Highlight corresponding line
            const lineType = type + '-line';
            const line = document.querySelector('.' + lineType);
            if (line) {
                line.style.strokeWidth = '4';
                line.style.filter = 'drop-shadow(0 0 5px rgba(0,0,0,0.2))';
            }
        });
        
        point.addEventListener('mouseleave', function() {
            // Remove tooltip
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
            
            // Reset line
            const type = this.classList[1];
            const lineType = type + '-line';
            const line = document.querySelector('.' + lineType);
            if (line) {
                line.style.strokeWidth = '3';
                line.style.filter = 'none';
            }
        });
    });
    
    // Make chart interactive with lab results
    labItems.forEach(labItem => {
        labItem.addEventListener('click', function() {
            const labText = this.textContent.toLowerCase();
            
            // Reset all points and lines
            dataPoints.forEach(point => {
                point.style.opacity = '0.3';
            });
            
            document.querySelectorAll('.line').forEach(line => {
                line.style.opacity = '0.3';
            });
            
            // Highlight based on lab type
            if (labText.includes('blood')) {
                // Highlight blood pressure lines (systolic and diastolic)
                document.querySelectorAll('.systolic, .diastolic').forEach(point => {
                    point.style.opacity = '1';
                });
                document.querySelectorAll('.systolic-line, .diastolic-line').forEach(line => {
                    line.style.opacity = '1';
                    line.style.strokeWidth = '4';
                });
            } else if (labText.includes('heart') || labText.includes('pulse')) {
                // Highlight pulse line
                document.querySelectorAll('.pulse').forEach(point => {
                    point.style.opacity = '1';
                });
                document.querySelector('.pulse-line').style.opacity = '1';
                document.querySelector('.pulse-line').style.strokeWidth = '4';
            } else if (labText.includes('x-ray') || labText.includes('scan')) {
                // Highlight all points
                dataPoints.forEach(point => {
                    point.style.opacity = '1';
                });
                document.querySelectorAll('.line').forEach(line => {
                    line.style.opacity = '1';
                });
            }
            
            // Reset after 2 seconds
            setTimeout(() => {
                dataPoints.forEach(point => {
                    point.style.opacity = '1';
                });
                document.querySelectorAll('.line').forEach(line => {
                    line.style.opacity = '1';
                    line.style.strokeWidth = '3';
                });
            }, 2000);
        });
    });
}

// Update the renderLabResults function to call setupChartInteractivity
function renderLabResults(results) {
    const labGrid = document.getElementById("lab-results-grid");
    
    let html = '';
    results.forEach(result => {
        html += `
            <div class="lab-item">
                <div style="font-weight: 500; margin-bottom: 5px;">${result.test || result.name || result}</div>
                <div style="font-size: 0.85rem; color: #7f8c8d;">${result.date || 'Recent'}</div>
            </div>
        `;
    });
    
  
    if (results.length < 4) {
        const additionalItems = ['Blood Tests', 'Heart Rate Monitor', 'CT Scans', 'X-Rays'];
        additionalItems.slice(results.length).forEach(item => {
            html += `
                <div class="lab-item">
                    <div style="font-weight: 500; margin-bottom: 5px;">${item}</div>
                    <div style="font-size: 0.85rem; color: #7f8c8d;">Recent</div>
                </div>
            `;
        });
    }
    
    labGrid.innerHTML = html;
 
    setTimeout(setupChartInteractivity, 100);
}

// Make the chart interactive with the REAL data
function setupChartInteractivity() {
    console.log("Setting up chart interactivity with real data...");
    
    const dataPoints = document.querySelectorAll('.data-point');
    const labItems = document.querySelectorAll('.lab-item');
    const tableRows = document.querySelectorAll('.mini-data-table tbody tr');
    
    // Create a tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    document.body.appendChild(tooltip);
    
    // Show tooltip on point hover
    dataPoints.forEach(point => {
        point.addEventListener('mouseenter', function(e) {
            const type = this.classList[1];
            const value = this.getAttribute('data-value');
            const month = this.getAttribute('data-month');
            
            // Update tooltip content and position
            tooltip.textContent = `${type}: ${value} (${month})`;
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY - 40 + 'px';
            tooltip.style.display = 'block';
            
            // Highlight corresponding table row
            const monthIndex = getMonthIndex(month);
            if (monthIndex >= 0) {
                tableRows.forEach(row => row.classList.remove('highlight'));
                tableRows[monthIndex].classList.add('highlight');
            }
        });
        
        point.addEventListener('mouseleave', function() {
            tooltip.style.display = 'none';
            tableRows.forEach(row => row.classList.remove('highlight'));
        });
    });
    
    // Make chart respond to lab item clicks
    labItems.forEach(item => {
        item.addEventListener('click', function() {
            const labText = this.textContent.toLowerCase();
            
            // Reset all points and lines
            dataPoints.forEach(point => {
                point.style.opacity = '0.5';
                point.style.transform = 'scale(0.8)';
            });
            
            // Highlight based on lab type
            if (labText.includes('blood')) {
                // Highlight blood pressure points
                document.querySelectorAll('.data-point.systolic, .data-point.diastolic').forEach(point => {
                    point.style.opacity = '1';
                    point.style.transform = 'scale(1.2)';
                });
            } else if (labText.includes('heart') || labText.includes('pulse')) {
                // Highlight pulse points
                document.querySelectorAll('.data-point.pulse').forEach(point => {
                    point.style.opacity = '1';
                    point.style.transform = 'scale(1.2)';
                });
            } else {
                // Highlight all points
                dataPoints.forEach(point => {
                    point.style.opacity = '1';
                    point.style.transform = 'scale(1)';
                });
            }
            
            // Reset after 3 seconds
            setTimeout(() => {
                dataPoints.forEach(point => {
                    point.style.opacity = '1';
                    point.style.transform = 'scale(1)';
                });
            }, 3000);
        });
    });
    
    // Make table rows interactive
    tableRows.forEach((row, index) => {
        row.addEventListener('mouseenter', function() {
            // Highlight corresponding chart points for this month
            const points = document.querySelectorAll(`[data-month="${row.cells[0].textContent.trim()}"]`);
            points.forEach(point => {
                point.style.filter = 'drop-shadow(0 0 8px rgba(0,0,0,0.3))';
                point.style.transform = 'scale(1.3)';
            });
        });
        
        row.addEventListener('mouseleave', function() {
            const points = document.querySelectorAll(`[data-month="${row.cells[0].textContent.trim()}"]`);
            points.forEach(point => {
                point.style.filter = 'none';
                point.style.transform = 'scale(1)';
            });
        });
    });
}

// Helper function to get month index
function getMonthIndex(month) {
    const months = ['Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024', 'Feb 2024', 'Mar 2024'];
    return months.indexOf(month);
}

// Add to your renderLabResults function
function renderLabResults(results) {
    const labGrid = document.getElementById("lab-results-grid");
    
    let html = '';
    results.forEach(result => {
        html += `
            <div class="lab-item">
                <div style="font-weight: 500; margin-bottom: 5px;">${result.test || result.name || result}</div>
                <div style="font-size: 0.85rem; color: #7f8c8d;">${result.date || 'Recent'}</div>
            </div>
        `;
    });
    
    // Add more lab items if needed
    if (results.length < 4) {
        const additionalItems = ['Blood Pressure Test', 'Heart Rate Monitor', 'CT Scans', 'X-Rays'];
        additionalItems.slice(results.length).forEach(item => {
            html += `
                <div class="lab-item">
                    <div style="font-weight: 500; margin-bottom: 5px;">${item}</div>
                    <div style="font-size: 0.85rem; color: #7f8c8d;">Recent</div>
                </div>
            `;
        });
    }
    
    labGrid.innerHTML = html;
    
  
    setTimeout(setupChartInteractivity, 100);
}

// Add this CSS for table highlighting
const style = document.createElement('style');
style.textContent = `
    .mini-data-table tr.highlight {
        background: #e8f4fc !important;
        box-shadow: 0 0 0 1px #3498db;
    }
    
    .mini-data-table tr.highlight td {
        font-weight: 600;
        color: #2c3e50;
    }
`;
document.head.appendChild(style);