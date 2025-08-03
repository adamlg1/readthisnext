import React, { useState } from 'react';
import { bookService } from '../services/bookService';

const TestRecommendations = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const testRecommendations = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Testing recommendations...');

            const data = await bookService.getRecommendations('fiction', 5);
            console.log('Test result:', data);
            setResult(data);
        } catch (err) {
            console.error('Test error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
            <h3>Test Recommendations</h3>
            <button onClick={testRecommendations} disabled={loading}>
                {loading ? 'Testing...' : 'Test Recommendations API'}
            </button>

            {error && <div style={{ color: 'red', marginTop: '10px' }}>Error: {error}</div>}

            {result && (
                <div style={{ marginTop: '10px' }}>
                    <strong>Result:</strong>
                    <pre style={{ background: '#f5f5f5', padding: '10px', fontSize: '12px' }}>
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default TestRecommendations;
