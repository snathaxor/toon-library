const ToonConverter = require('../index');

// Initialize the converter
const converter = new ToonConverter();

// ---------------------------------------------------------
// Example Scenario: Healthcare Data (IIRC Dataset simulation)
// ---------------------------------------------------------

const medicalRecords = [
    {
        "patient_id": "P-101",
        "name": "John Doe",
        "visit_date": "2025-02-15",
        "vitals": {
            "temperature": 98.6,
            "blood_pressure": "120/80"
        },
        "medications": ["Metformin", "Aspirin"]
    },
    {
        "patient_id": "P-102",
        "name": "Jane Smith",
        "visit_date": "2025-02-16",
        "diagnosis": {
            "primary": "Hypertension",
            "status": "Stable"
        }
    }
];

console.log("--- RAW JSON (Verbose) ---");
console.log(JSON.stringify(medicalRecords, null, 2));

console.log("\n--- CONVERTING TO TOON... ---");

// Convert utilizing 'patient_id' as the explicit link
const toonOutput = converter.convert(medicalRecords, 'patient_id');

console.log("\n--- OPTIMIZED TOON STREAM (Output) ---");
console.log(toonOutput);

/*
Expected Output:
#Entity[P-101]|Name:John Doe|VisitDate:2025-02-15|VitalsTemperature:98.6|VitalsBloodPressure:120/80|Medications:[Metformin,Aspirin]
#Entity[P-102]|Name:Jane Smith|VisitDate:2025-02-16|DiagnosisPrimary:Hypertension|DiagnosisStatus:Stable
*/
