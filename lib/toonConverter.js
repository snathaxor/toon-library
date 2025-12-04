/**
 * Universal TOON Converter Library
 * Author: Syed Naseeb Ali Tirmizi
 * Thesis: Adaptive RAG for Real-Time Conversational AI
 * 
 * Implements Algorithm 3.1: Universal JSON-to-TOON Conversion
 */

const crypto = require('crypto'); // For generating UUIDs if ID is missing

class ToonConverter {
    constructor() {
        this.delimiter = '|';
        this.headerPrefix = '#';
    }

    /**
     * Main Conversion Function
     * @param {Array|Object} jsonData - The input JSON data (nested or flat)
     * @param {String} primaryKeyField - The field name to use as the Entity ID (e.g., 'id', 'patient_id')
     * @returns {String} - The optimized TOON stream
     */
    convert(jsonData, primaryKeyField = 'id') {
        // Step 1: Normalize Input (Ensure it's an array)
        const dataList = Array.isArray(jsonData) ? jsonData : [jsonData];
        const entityRecords = [];

        // Step 2: Iterate and Process Each Record
        dataList.forEach(record => {
            // Extract or Generate Entity ID
            let entityID = record[primaryKeyField];
            
            if (!entityID) {
                // Fallback: Generate UUID if primary key is missing (as per Thesis Algo)
                entityID = crypto.randomUUID().substring(0, 8);
            }

            // Create the Entity Tag (Explicit Entity Linking)
            // Example: #Patient[P-101]
            const entityPrefix = `${this.headerPrefix}Entity[${entityID}]`;

            // Step 3: Flatten and Link Attributes
            const flatAttributes = this._flattenObject(record);
            
            let recordString = entityPrefix;

            // Append attributes to the stream
            for (const [key, value] of Object.entries(flatAttributes)) {
                // Optimization: Skip the ID field itself to save tokens
                if (key === primaryKeyField) continue;

                // Syntax: |Key:Value
                recordString += `${this.delimiter}${this._toCamelCase(key)}:${value}`;
            }

            entityRecords.push(recordString);
        });

        // Step 4: Build Final Stream
        return entityRecords.join('\n');
    }

    /**
     * Helper: Recursively flattens nested JSON objects
     * Input: { vitals: { temp: 98.6 } } -> Output: { "vitalsTemp": 98.6 }
     */
    _flattenObject(obj, parentKey = '', res = {}) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                const propName = parentKey ? parentKey + this._capitalize(key) : key;
                
                if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                    this._flattenObject(obj[key], propName, res);
                } else if (Array.isArray(obj[key])) {
                    // Simple joining for arrays to save space
                    res[propName] = `[${obj[key].join(',')}]`;
                } else {
                    res[propName] = obj[key];
                }
            }
        }
        return res;
    }

    /**
     * Helper: Convert string to CamelCase for token efficiency
     * "visit_date" -> "VisitDate"
     */
    _toCamelCase(str) {
        return str
            .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''))
            .replace(/^[a-z]/, (first) => first.toUpperCase());
    }

    _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

module.exports = ToonConverter;
