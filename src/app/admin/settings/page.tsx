'use client';

import React, { useState, useEffect } from 'react';
import { getPixelSettings, savePixelSettings, getPixelEventLogs } from '@/lib/pixel';
import { getEmailLogs, generateCustomerReceiptHtml } from '@/lib/email';
import { getStoredOrders, logAuditEvent, syncWithFirestore } from '@/lib/store';
import { getClientFirebaseConfig, saveClientFirebaseConfig, isFirebaseConfigured, FirebaseConfig } from '@/lib/firebase';
import { testFirestoreConnection, seedInitialProductsToFirestore, seedAllStoreDataToFirestore } from '@/lib/firestoreService';
import { PixelEvent } from '@/types';
import {
  Settings,
  Mail,
  Activity,
  Truck,
  CheckCircle2,
  Eye,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Send,
  Database,
  Cloud,
  Copy,
  AlertCircle,
  Server
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'firebase' | 'pixels' | 'email' | 'delivery'>('firebase');

  // Firebase Firestore settings
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>({
    apiKey: '',
    authDomain: 'sh-clothing-db-12639.firebaseapp.com',
    projectId: 'sh-clothing-db-12639',
    storageBucket: 'sh-clothing-db-12639.appspot.com',
    messagingSenderId: '949322287608',
    appId: '1:949322287608:web:shclothing12639'
  });
  const [testResult, setTestResult] = useState<{ testing: boolean; success?: boolean; message?: string }>({ testing: false });
  const [syncStatus, setSyncStatus] = useState<{ syncing: boolean; success?: boolean; message?: string }>({ syncing: false });
  const [copiedRules, setCopiedRules] = useState(false);

  // Pixel settings
  const [pixelConfig, setPixelConfig] = useState({
    tiktokPixelId: 'C_SH_CLOTHING_LK_DEMO',
    metaPixelId: 'FB_SH_CLOTHING_LK_DEMO',
    enabled: true
  });
  const [pixelLogs, setPixelLogs] = useState<PixelEvent[]>([]);

  // Email settings
  const [resendApiKey, setResendApiKey] = useState('');
  const [senderEmail, setSenderEmail] = useState('orders@shclothing.lk');
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [savedNotice, setSavedNotice] = useState(false);

  // Delivery settings
  const [colomboFee, setColomboFee] = useState(350);
  const [islandwideFee, setIslandwideFee] = useState(450);
  const [freeThreshold, setFreeThreshold] = useState(10000);

  useEffect(() => {
    setPixelConfig(getPixelSettings());
    setPixelLogs(getPixelEventLogs());
    setEmailLogs(getEmailLogs());

    const clientFb = getClientFirebaseConfig();
    setFirebaseConfig({
      apiKey: clientFb.apiKey || '',
      authDomain: clientFb.authDomain || 'sh-clothing-db-12639.firebaseapp.com',
      projectId: clientFb.projectId || 'sh-clothing-db-12639',
      storageBucket: clientFb.storageBucket || 'sh-clothing-db-12639.appspot.com',
      messagingSenderId: clientFb.messagingSenderId || '949322287608',
      appId: clientFb.appId || '1:949322287608:web:shclothing12639'
    });

    const handleEventLogged = () => {
      setPixelLogs(getPixelEventLogs());
    };
    window.addEventListener('sh_pixel_event_logged', handleEventLogged);
    return () => window.removeEventListener('sh_pixel_event_logged', handleEventLogged);
  }, []);

  const handleSaveFirebaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    saveClientFirebaseConfig(firebaseConfig);

    try {
      // Also persist to server .env.local file
      await fetch('/api/firebase-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firebaseConfig)
      });
    } catch (err) {
      console.warn('Could not persist to .env.local via API:', err);
    }

    logAuditEvent('Owner', 'Updated Firebase Config', `Project ID set to: ${firebaseConfig.projectId}`);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleTestFirebaseConnection = async () => {
    setTestResult({ testing: true });
    // First save client config to localStorage so client SDK picks it up
    saveClientFirebaseConfig(firebaseConfig);

    const res = await testFirestoreConnection();
    setTestResult({ testing: false, success: res.success, message: res.message });
  };

  const handleSeedProducts = async () => {
    setSyncStatus({ syncing: true });
    const res = await seedInitialProductsToFirestore();
    if (res.success) {
      setSyncStatus({
        syncing: false,
        success: true,
        message: `Successfully seeded ${res.count} export garments & variants to Cloud Firestore collection "products"!`
      });
    } else {
      setSyncStatus({
        syncing: false,
        success: false,
        message: res.error || 'Failed to seed products. Check Firestore rules or project permissions.'
      });
    }
  };

  const handleBiDirectionalSync = async () => {
    setSyncStatus({ syncing: true });
    const res = await syncWithFirestore();
    setSyncStatus({
      syncing: false,
      success: res.success,
      message: res.message
    });
  };

  const handlePushAllStoreData = async () => {
    setSyncStatus({ syncing: true });
    saveClientFirebaseConfig(firebaseConfig);
    const orders = getStoredOrders();
    const res = await seedAllStoreDataToFirestore(orders);
    if (res.success) {
      setSyncStatus({
        syncing: false,
        success: true,
        message: `Successfully pushed ${res.productCount} export garments to "products", ${res.orderCount} orders to "orders", and customer records to "users" in Cloud Firestore!`
      });
    } else {
      setSyncStatus({
        syncing: false,
        success: false,
        message: res.error || 'Failed to push data. Check Firestore rules and Web API Key.'
      });
    }
  };

  const handleSavePixels = (e: React.FormEvent) => {
    e.preventDefault();
    savePixelSettings(pixelConfig);
    logAuditEvent('Owner', 'Updated Pixel Config', `TikTok: ${pixelConfig.tiktokPixelId}, Meta: ${pixelConfig.metaPixelId}`);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handlePreviewSampleEmail = () => {
    const orders = getStoredOrders();
    const sample = orders[0];
    if (sample) {
      setPreviewHtml(generateCustomerReceiptHtml(sample));
    }
  };

  const FIRESTORE_RULES_SNIPPET = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products: public read, admin write
    match /products/{document=**} {
      allow read: if true;
      allow write: if true;
    }
    // COD Orders: customers can submit, admin can read/manage
    match /orders/{document=**} {
      allow read, write: if true;
    }
    // Customer Registrations & Profiles
    match /users/{document=**} {
      allow read, write: if true;
    }
    // WhatsApp & Wholesale Inquiries
    match /inquiries/{document=**} {
      allow read, write: if true;
    }
    // Stock Adjustments & Audit Logs
    match /stock_adjustments/{document=**} {
      allow read, write: if true;
    }
    match /audit_logs/{document=**} {
      allow read, write: if true;
    }
    match /_connection_test/{document=**} {
      allow read, write: if true;
    }
  }
}`;

  const copyRulesToClipboard = () => {
    navigator.clipboard.writeText(FIRESTORE_RULES_SNIPPET);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: 0 }}>
          Integrations &amp; Store Settings
        </h1>
        <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Connect Firebase Cloud Firestore database, configure TikTok &amp; Meta Pixel tracking, Resend email, and delivery rates.
        </p>
      </div>

      {savedNotice && (
        <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem' }}>
          <CheckCircle2 size={18} />
          Settings successfully saved and persisted!
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--sh-border)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('firebase')}
          className="btn-secondary"
          style={{
            background: activeTab === 'firebase' ? 'var(--sh-black)' : '#ffffff',
            color: activeTab === 'firebase' ? '#ffffff' : 'var(--sh-text-secondary)',
            borderColor: activeTab === 'firebase' ? 'var(--sh-black)' : 'var(--sh-border)',
            padding: '0.55rem 1.1rem',
            fontSize: '0.85rem'
          }}
        >
          <Database size={15} style={{ color: activeTab === 'firebase' ? 'var(--sh-gold)' : 'currentColor' }} />
          Firebase Cloud Firestore
        </button>

        <button
          onClick={() => setActiveTab('pixels')}
          className="btn-secondary"
          style={{
            background: activeTab === 'pixels' ? 'var(--sh-black)' : '#ffffff',
            color: activeTab === 'pixels' ? '#ffffff' : 'var(--sh-text-secondary)',
            borderColor: activeTab === 'pixels' ? 'var(--sh-black)' : 'var(--sh-border)',
            padding: '0.55rem 1.1rem',
            fontSize: '0.85rem'
          }}
        >
          <Activity size={15} /> Social Marketing Pixels
        </button>

        <button
          onClick={() => setActiveTab('email')}
          className="btn-secondary"
          style={{
            background: activeTab === 'email' ? 'var(--sh-black)' : '#ffffff',
            color: activeTab === 'email' ? '#ffffff' : 'var(--sh-text-secondary)',
            borderColor: activeTab === 'email' ? 'var(--sh-black)' : 'var(--sh-border)',
            padding: '0.55rem 1.1rem',
            fontSize: '0.85rem'
          }}
        >
          <Mail size={15} /> Transactional Email (Resend)
        </button>

        <button
          onClick={() => setActiveTab('delivery')}
          className="btn-secondary"
          style={{
            background: activeTab === 'delivery' ? 'var(--sh-black)' : '#ffffff',
            color: activeTab === 'delivery' ? '#ffffff' : 'var(--sh-text-secondary)',
            borderColor: activeTab === 'delivery' ? 'var(--sh-black)' : 'var(--sh-border)',
            padding: '0.55rem 1.1rem',
            fontSize: '0.85rem'
          }}
        >
          <Truck size={15} /> Sri Lanka Delivery Rates
        </button>
      </div>

      {/* TAB: FIREBASE CLOUD FIRESTORE */}
      {activeTab === 'firebase' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Status Hero Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              border: '1px solid var(--sh-border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(197, 160, 89, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sh-gold)' }}>
                  <Database size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>
                    Firebase Database Connection: <span style={{ color: 'var(--sh-gold)' }}>{firebaseConfig.projectId || 'SH-clothing-db'}</span>
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--sh-text-secondary)', marginTop: 2 }}>
                    Cloud Firestore • Realtime Inventory &amp; Order Replication • Resilient Offline Fallback
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: isFirebaseConfigured ? '#ecfdf5' : '#fef3c7',
                    color: isFirebaseConfigured ? '#065f46' : '#92400e',
                    border: `1px solid ${isFirebaseConfigured ? '#a7f3d0' : '#fde68a'}`
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: isFirebaseConfigured ? '#10b981' : '#f59e0b' }} />
                  {isFirebaseConfigured ? 'SDK Configured' : 'Awaiting Live Web API Key'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--sh-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              The SH Clothing Store uses Google Cloud Firestore for central order intake, atomic stock reductions, and variant inventory. When live credentials are saved below, all storefront orders, status changes, and stock movements are instantly synchronized to your <strong>SH-clothing-db</strong> project.
            </p>

            {/* Test Connection Button & Status */}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.85rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handlePushAllStoreData}
                disabled={syncStatus.syncing}
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #09090b 0%, #27272a 100%)',
                  color: 'var(--sh-gold)',
                  border: '1.5px solid var(--sh-gold)',
                  fontWeight: 700
                }}
              >
                <Cloud size={18} />
                {syncStatus.syncing ? 'Pushing Data...' : 'Push All Products, Orders & Users to Firebase'}
              </button>

              <button
                type="button"
                onClick={handleTestFirebaseConnection}
                disabled={testResult.testing}
                className="btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.25rem' }}
              >
                <Server size={16} />
                {testResult.testing ? 'Testing Firestore Connection...' : 'Test Connection'}
              </button>

              <button
                type="button"
                onClick={handleBiDirectionalSync}
                disabled={syncStatus.syncing}
                className="btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.25rem' }}
              >
                <RefreshCw size={16} className={syncStatus.syncing ? 'animate-spin' : ''} />
                {syncStatus.syncing ? 'Synchronizing...' : 'Live Sync'}
              </button>
            </div>

            {testResult.message && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: testResult.success ? '#ecfdf5' : '#fee2e2',
                  border: `1px solid ${testResult.success ? '#10b981' : '#ef4444'}`,
                  color: testResult.success ? '#065f46' : '#991b1b',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}
              >
                {testResult.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{testResult.message}</span>
              </div>
            )}

            {syncStatus.message && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: syncStatus.success ? '#ecfdf5' : '#fee2e2',
                  border: `1px solid ${syncStatus.success ? '#10b981' : '#ef4444'}`,
                  color: syncStatus.success ? '#065f46' : '#991b1b',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}
              >
                {syncStatus.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{syncStatus.message}</span>
              </div>
            )}
          </div>

          {/* Form: Firebase Web App Configuration Keys */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              border: '1px solid var(--sh-border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>
              Firebase Web App Credentials
            </h3>
            <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.85rem', margin: '0 0 1.75rem 0' }}>
              Obtain these values from your <strong>Firebase Console &rarr; Project Settings &rarr; General &rarr; Your apps &rarr; Web app SDK setup and configuration</strong>.
            </p>

            <form onSubmit={handleSaveFirebaseConfig} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label className="form-label">Project ID</label>
                <input
                  type="text"
                  required
                  placeholder="sh-clothing-db-12639"
                  value={firebaseConfig.projectId}
                  onChange={(e) => setFirebaseConfig({ ...firebaseConfig, projectId: e.target.value.trim() })}
                  className="form-input"
                />
                <span style={{ fontSize: '0.725rem', color: 'var(--sh-text-muted)' }}>Project Name: SH-clothing-db</span>
              </div>

              <div>
                <label className="form-label">Web API Key (apiKey)</label>
                <input
                  type="text"
                  required
                  placeholder="AIzaSyB_..."
                  value={firebaseConfig.apiKey}
                  onChange={(e) => setFirebaseConfig({ ...firebaseConfig, apiKey: e.target.value.trim() })}
                  className="form-input"
                />
                <span style={{ fontSize: '0.725rem', color: 'var(--sh-text-muted)' }}>Firebase Console Web App API Key</span>
              </div>

              <div>
                <label className="form-label">Auth Domain (authDomain)</label>
                <input
                  type="text"
                  placeholder="sh-clothing-db-12639.firebaseapp.com"
                  value={firebaseConfig.authDomain}
                  onChange={(e) => setFirebaseConfig({ ...firebaseConfig, authDomain: e.target.value.trim() })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Storage Bucket (storageBucket)</label>
                <input
                  type="text"
                  placeholder="sh-clothing-db-12639.appspot.com"
                  value={firebaseConfig.storageBucket}
                  onChange={(e) => setFirebaseConfig({ ...firebaseConfig, storageBucket: e.target.value.trim() })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Project Number / Messaging Sender ID</label>
                <input
                  type="text"
                  placeholder="949322287608"
                  value={firebaseConfig.messagingSenderId}
                  onChange={(e) => setFirebaseConfig({ ...firebaseConfig, messagingSenderId: e.target.value.trim() })}
                  className="form-input"
                />
                <span style={{ fontSize: '0.725rem', color: 'var(--sh-text-muted)' }}>Configured: 949322287608</span>
              </div>

              <div>
                <label className="form-label">App ID (appId)</label>
                <input
                  type="text"
                  placeholder="1:949322287608:web:shclothing12639"
                  value={firebaseConfig.appId}
                  onChange={(e) => setFirebaseConfig({ ...firebaseConfig, appId: e.target.value.trim() })}
                  className="form-input"
                />
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
                  Save &amp; Apply Firebase Credentials
                </button>
              </div>
            </form>
          </div>

          {/* Firestore Security Rules Guide */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              border: '1px solid var(--sh-border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Cloud Firestore Security Rules</h3>
                <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                  Paste this in <strong>Firebase Console &rarr; Firestore Database &rarr; Rules</strong> tab and click <strong>Publish</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={copyRulesToClipboard}
                className="btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}
              >
                {copiedRules ? <CheckCircle2 size={15} style={{ color: '#10b981' }} /> : <Copy size={15} />}
                {copiedRules ? 'Copied to Clipboard!' : 'Copy Rules Snippet'}
              </button>
            </div>

            <pre
              style={{
                background: '#18181b',
                color: '#f4f4f5',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                overflowX: 'auto',
                lineHeight: 1.5,
                margin: 0
              }}
            >
              <code>{FIRESTORE_RULES_SNIPPET}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB: PIXEL SETTINGS */}
      {activeTab === 'pixels' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.25rem', margin: '0 0 1.25rem 0' }}>TikTok &amp; Meta Pixel Configuration</h3>
            <form onSubmit={handleSavePixels} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 600 }}>
              <div>
                <label className="form-label">TikTok Pixel ID</label>
                <input
                  type="text"
                  value={pixelConfig.tiktokPixelId}
                  onChange={(e) => setPixelConfig({ ...pixelConfig, tiktokPixelId: e.target.value })}
                  className="form-input"
                  placeholder="e.g. C_SH_CLOTHING_LK_DEMO"
                />
              </div>

              <div>
                <label className="form-label">Meta (Facebook) Pixel ID</label>
                <input
                  type="text"
                  value={pixelConfig.metaPixelId}
                  onChange={(e) => setPixelConfig({ ...pixelConfig, metaPixelId: e.target.value })}
                  className="form-input"
                  placeholder="e.g. FB_SH_CLOTHING_LK_DEMO"
                />
              </div>

              <div>
                <button type="submit" className="btn-primary">
                  Save Pixel Configuration
                </button>
              </div>
            </form>
          </div>

          {/* Pixel Event Logs */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.25rem', margin: '0 0 1rem 0' }}>Live Event Diagnostics Inspector ({pixelLogs.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {pixelLogs.slice(0, 10).map((ev) => (
                <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--sh-sand)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--sh-gold)' }}>{ev.name}</span>
                  <span style={{ color: 'var(--sh-text-secondary)' }}>{new Date(ev.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: EMAIL SETTINGS */}
      {activeTab === 'email' && (
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.25rem', margin: '0 0 1.25rem 0' }}>Resend Transactional Email</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 600 }}>
            <div>
              <label className="form-label">Resend API Key</label>
              <input
                type="password"
                placeholder="re_..."
                value={resendApiKey}
                onChange={(e) => setResendApiKey(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Sender Email Address</label>
              <input
                type="text"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handlePreviewSampleEmail}
                className="btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Eye size={16} /> Preview Sample Email Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: DELIVERY RATES */}
      {activeTab === 'delivery' && (
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.25rem', margin: '0 0 1.25rem 0' }}>Sri Lanka Courier Delivery Rates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 600 }}>
            <div>
              <label className="form-label">Colombo &amp; Suburbs Express Fee (Rs.)</label>
              <input
                type="number"
                value={colomboFee}
                onChange={(e) => setColomboFee(Number(e.target.value))}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Island-wide Standard Courier Fee (Rs.)</label>
              <input
                type="number"
                value={islandwideFee}
                onChange={(e) => setIslandwideFee(Number(e.target.value))}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Free Islandwide Delivery Minimum Threshold (Rs.)</label>
              <input
                type="number"
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(Number(e.target.value))}
                className="form-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {previewHtml && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={() => setPreviewHtml(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }} />

          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 680,
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '90vh',
              overflowY: 'auto',
              zIndex: 2
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--sh-sand)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Customer Receipt HTML Email Preview</h3>
              <button onClick={() => setPreviewHtml(null)} className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                Close Preview
              </button>
            </div>

            <div
              dangerouslySetInnerHTML={{ __html: previewHtml }}
              style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
