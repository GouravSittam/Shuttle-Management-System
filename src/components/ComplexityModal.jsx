import React from 'react';
import { X, Cpu } from 'lucide-react';
import { COMPLEXITY_ANALYSIS } from '../utils/complexityAnalysis.js';

export const ComplexityModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={20} color="var(--brand-primary)" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                Algorithmic Complexity & Architecture Analysis
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Evaluation Criteria Analysis (Time & Space Complexity, Scalability, and Optimization)
              </p>
            </div>
          </div>

          <button type="button" className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Frontend Engine</div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--brand-blue)' }}>React 18 + JavaScript</div>
            </div>

            <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Backend Service</div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#10b981' }}>Java 8 REST Server</div>
            </div>

            <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Concurrency Model</div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#8b5cf6' }}>FixedThreadPool (16 Threads)</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
            {COMPLEXITY_ANALYSIS.map((item, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {item.module}
                  </h4>
                  <span style={{ fontSize: '0.75rem', background: 'var(--bg-hover)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)' }}>
                    {item.algorithm}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong>Operation:</strong> {item.operation}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--bg-card-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Time Complexity</span>
                    <code style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 700 }}>{item.timeComplexity}</code>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Space Complexity</span>
                    <code style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>{item.spaceComplexity}</code>
                  </div>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <strong>Design Rationale:</strong> {item.rationale}
                </p>

                <div style={{ fontSize: '0.75rem', color: '#047857', background: '#ecfdf5', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                  <strong>Scaling Strategy:</strong> {item.scalingRecommendation}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
