'use client';

import React from 'react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  itemType?: 'Product' | 'Order' | 'Customer' | 'Role' | 'Item';
  warningMessage?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  itemName,
  itemType = 'Item',
  warningMessage,
  isDeleting = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.15s ease'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onCancel();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #fee2e2',
          overflow: 'hidden',
          animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem 1rem 1.75rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <AlertTriangle size={24} />
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#111827', fontFamily: 'var(--font-sans)' }}>
              {title}
            </h3>
            <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete{' '}
              <strong style={{ color: '#111827', wordBreak: 'break-word' }}>&ldquo;{itemName}&rdquo;</strong>?
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              padding: 4
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Warning Banner */}
        <div style={{ padding: '0 1.75rem 1.25rem 1.75rem' }}>
          <div
            style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              fontSize: '0.8rem',
              color: '#9f1239',
              lineHeight: 1.5
            }}
          >
            {warningMessage || (
              <>
                ⚠️ <strong>Irreversible Action:</strong> This record will be permanently deleted from your local store
                and Cloud Firestore database. This action cannot be recovered.
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            padding: '1rem 1.75rem 1.5rem 1.75rem',
            background: '#f9fafb',
            borderTop: '1px solid #f3f4f6',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem'
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              background: '#ffffff',
              color: '#374151',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s ease'
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              padding: '0.65rem 1.35rem',
              borderRadius: '8px',
              border: 'none',
              background: '#dc2626',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)',
              transition: 'opacity 0.15s ease'
            }}
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Deleting {itemType}...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(12px) scale(0.97); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

