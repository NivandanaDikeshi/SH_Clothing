'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStoredRoles, saveCustomRole, deleteCustomRole, logAuditEvent } from '@/lib/store';
import { CustomRole, RoleModulePermission } from '@/types';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import {
  ShieldCheck,
  Shield,
  Plus,
  Eye,
  Key,
  Edit2,
  Trash2,
  Check,
  X,
  Lock,
  Search,
  Sparkles,
  Layers,
  ShoppingBag,
  Package,
  Users,
  Settings,
  AlertCircle
} from 'lucide-react';

const SYSTEM_MODULES = [
  { module: 'products', label: 'Garments & Products', actions: ['create', 'read', 'update', 'delete', 'export'] },
  { module: 'orders', label: 'COD Orders & Deliveries', actions: ['create', 'read', 'update', 'delete', 'export'] },
  { module: 'customers', label: 'Customer Directory', actions: ['create', 'read', 'update', 'delete', 'export'] },
  { module: 'inventory', label: 'Inventory & Stock Levels', actions: ['create', 'read', 'update', 'delete', 'export'] },
  { module: 'roles', label: 'Roles & Security Access', actions: ['create', 'read', 'update', 'delete'] },
  { module: 'settings', label: 'Store Settings & Integrations', actions: ['read', 'update'] },
];

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<CustomRole[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<CustomRole | null>(null);
  const [viewingRole, setViewingRole] = useState<CustomRole | null>(null);

  // Delete modal state
  const [roleToDelete, setRoleToDelete] = useState<CustomRole | null>(null);
  const [isDeletingRole, setIsDeletingRole] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Form state
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [roleStatus, setRoleStatus] = useState<'active' | 'inactive'>('active');
  const [isAdminPrivileges, setIsAdminPrivileges] = useState(false);
  const [permissionsState, setPermissionsState] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    loadRoles();
    const handleUpdate = () => loadRoles();
    window.addEventListener('sh_roles_updated', handleUpdate);
    return () => window.removeEventListener('sh_roles_updated', handleUpdate);
  }, []);

  const loadRoles = () => {
    setRoles(getStoredRoles());
  };

  const initPermissionsState = (existingRole?: CustomRole) => {
    const state: Record<string, Record<string, boolean>> = {};
    SYSTEM_MODULES.forEach(mod => {
      state[mod.module] = {};
      mod.actions.forEach(act => {
        if (existingRole) {
          const modPerm = existingRole.permissions.find(p => p.module === mod.module);
          state[mod.module][act] = modPerm ? Boolean((modPerm as any)[act]) : false;
        } else {
          state[mod.module][act] = false;
        }
      });
    });
    return state;
  };

  const handleOpenAdd = () => {
    setEditingRole(null);
    setRoleName('');
    setRoleDescription('');
    setRoleStatus('active');
    setIsAdminPrivileges(false);
    setPermissionsState(initPermissionsState());
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (role: CustomRole) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description || '');
    setRoleStatus(role.status);
    setIsAdminPrivileges(role.isAdminPrivileges);
    setPermissionsState(initPermissionsState(role));
    setIsAddModalOpen(true);
  };

  const handleToggleAction = (module: string, action: string) => {
    setPermissionsState(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module]?.[action]
      }
    }));
  };

  const handleToggleSelectAllModule = (module: string, actions: string[]) => {
    const current = permissionsState[module] || {};
    const allChecked = actions.every(act => current[act]);
    const newState: Record<string, boolean> = {};
    actions.forEach(act => {
      newState[act] = !allChecked;
    });

    setPermissionsState(prev => ({
      ...prev,
      [module]: newState
    }));
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      alert('Please provide a role name.');
      return;
    }

    const compiledPermissions: RoleModulePermission[] = SYSTEM_MODULES.map(mod => {
      const actions = permissionsState[mod.module] || {};
      return {
        module: mod.module,
        label: mod.label,
        create: Boolean(actions.create),
        read: Boolean(actions.read),
        update: Boolean(actions.update),
        delete: Boolean(actions.delete),
        export: Boolean(actions.export)
      };
    });

    const newRole: CustomRole = {
      id: editingRole ? editingRole.id : `role-${Date.now()}`,
      name: roleName.trim(),
      description: roleDescription.trim() || undefined,
      status: roleStatus,
      isAdminPrivileges,
      isSystem: editingRole ? editingRole.isSystem : false,
      permissions: compiledPermissions,
      createdAt: editingRole ? editingRole.createdAt : new Date().toISOString()
    };

    saveCustomRole(newRole, 'Super Admin');
    setIsAddModalOpen(false);
    setEditingRole(null);
    setActionFeedback(`Role "${newRole.name}" saved successfully.`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    setIsDeletingRole(true);
    const success = deleteCustomRole(roleToDelete.id, 'Super Admin');
    setIsDeletingRole(false);
    if (success) {
      setActionFeedback(`Role "${roleToDelete.name}" was permanently deleted.`);
      setRoleToDelete(null);
      setTimeout(() => setActionFeedback(null), 3500);
    }
  };

  const countTotalActions = (role: CustomRole) => {
    if (role.id === 'role-super-admin' || (role.isSystem && role.isAdminPrivileges)) {
      return 'All Permissions';
    }
    let total = 0;
    role.permissions.forEach(p => {
      if (p.create) total += 1;
      if (p.read) total += 1;
      if (p.update) total += 1;
      if (p.delete) total += 1;
      if (p.export) total += 1;
    });
    return `${total} actions`;
  };

  const filteredRoles = roles.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: 0, color: '#111827' }}>
            Roles &amp; Permissions
          </h1>
          <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
            Manage system roles and assign granular permissions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setIsMatrixOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              fontSize: '0.875rem',
              background: '#ffffff',
              border: '1px solid #d1d5db',
              color: '#374151',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <Eye size={16} />
            <span>View Permissions</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.35rem',
              fontSize: '0.875rem',
              background: '#047857',
              borderColor: '#047857'
            }}
          >
            <Plus size={16} />
            <span>Add Role</span>
          </button>
        </div>
      </div>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem' }}>
          <Check size={18} />
          {actionFeedback}
        </div>
      )}

      {/* Search Input */}
      <div style={{ position: 'relative', maxWidth: 400 }}>
        <input
          type="text"
          placeholder="Search role name or privilege..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
        />
        <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sh-text-muted)' }} />
      </div>

      {/* Roles & Permissions Table (Matching Screenshot 3) */}
      <div className="table-responsive" style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid var(--sh-border)', color: '#4b5563', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '0.85rem 1.25rem' }}>Role Name</th>
              <th style={{ padding: '0.85rem 1.25rem' }}>Permissions</th>
              <th style={{ padding: '0.85rem 1.25rem' }}>Status</th>
              <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map(role => (
              <tr key={role.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>
                      {role.name}
                    </span>
                    {role.isSystem && (
                      <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: 4, fontWeight: 800, letterSpacing: '0.05em' }}>
                        SYSTEM
                      </span>
                    )}
                    {role.isAdminPrivileges && (
                      <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: 4, fontWeight: 800, letterSpacing: '0.05em' }}>
                        ADMIN
                      </span>
                    )}
                  </div>
                  {role.description && (
                    <div style={{ fontSize: '0.775rem', color: '#6b7280', marginTop: 3 }}>
                      {role.description}
                    </div>
                  )}
                </td>

                <td style={{ padding: '1rem 1.25rem', color: '#374151', fontSize: '0.85rem' }}>
                  {countTotalActions(role)}
                </td>

                <td style={{ padding: '1rem 1.25rem' }}>
                  <span
                    style={{
                      background: role.status === 'active' ? '#ecfdf5' : '#f3f4f6',
                      color: role.status === 'active' ? '#047857' : '#6b7280',
                      border: `1px solid ${role.status === 'active' ? '#a7f3d0' : '#e5e7eb'}`,
                      padding: '0.2rem 0.65rem',
                      borderRadius: 999,
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    {role.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>

                <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setViewingRole(role)}
                      title="View Permissions Matrix"
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }}
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(role)}
                      title="Edit Role"
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }}
                    >
                      <Edit2 size={14} />
                    </button>

                    {!role.isSystem ? (
                      <button
                        type="button"
                        onClick={() => setRoleToDelete(role)}
                        title="Delete Role"
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem', color: '#dc2626' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <span title="System roles cannot be deleted" style={{ padding: '0.35rem 0.55rem', color: '#9ca3af', display: 'inline-flex', alignItems: 'center' }}>
                        <Lock size={14} />
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT ROLE MODAL (Matching Screenshot 2) */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem 1rem'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false);
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 640,
              maxHeight: '90vh',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid #e5e7eb'
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
                  {editingRole ? 'Edit Role' : 'Add Role'}
                </h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                  {editingRole ? 'Modify role privileges and assign granular permissions.' : 'Create a new role for system users.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveRole} style={{ overflowY: 'auto', padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Role Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#111827', marginBottom: '0.35rem' }}>
                  Role Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Store Manager, Quality Auditor"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '0.9rem' }}
                />
              </div>

              {/* Status and Admin Privileges Toggles (Matching Screenshot 2) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '0.85rem 1rem', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#111827' }}>Status</div>
                    <div style={{ fontSize: '0.725rem', color: '#6b7280' }}>Determine if this role is active</div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={roleStatus === 'active'}
                      onChange={(e) => setRoleStatus(e.target.checked ? 'active' : 'inactive')}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: roleStatus === 'active' ? '#047857' : '#d1d5db',
                        borderRadius: 24,
                        transition: 'background 0.2s ease'
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          height: 18,
                          width: 18,
                          left: roleStatus === 'active' ? 22 : 3,
                          bottom: 3,
                          background: '#ffffff',
                          borderRadius: '50%',
                          transition: 'left 0.2s ease'
                        }}
                      />
                    </span>
                  </label>
                </div>

                <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '0.85rem 1rem', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#111827' }}>Admin Privileges</div>
                    <div style={{ fontSize: '0.725rem', color: '#6b7280' }}>Grant admin-level system access</div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isAdminPrivileges}
                      onChange={(e) => setIsAdminPrivileges(e.target.checked)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: isAdminPrivileges ? '#047857' : '#d1d5db',
                        borderRadius: 24,
                        transition: 'background 0.2s ease'
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          height: 18,
                          width: 18,
                          left: isAdminPrivileges ? 22 : 3,
                          bottom: 3,
                          background: '#ffffff',
                          borderRadius: '50%',
                          transition: 'left 0.2s ease'
                        }}
                      />
                    </span>
                  </label>
                </div>
              </div>

              {/* Permissions Header */}
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827' }}>Permissions</div>
                <div style={{ fontSize: '0.775rem', color: '#6b7280' }}>Select the features this role can access.</div>
              </div>

              {/* Granular Module Permission Matrix (Matching Screenshot 2) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {SYSTEM_MODULES.map(mod => {
                  const currentActions = permissionsState[mod.module] || {};
                  const allSelected = mod.actions.every(act => currentActions[act]);

                  return (
                    <div key={mod.module} style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '0.85rem 1rem', background: '#ffffff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>
                          {mod.label}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleSelectAllModule(mod.module, mod.actions)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: allSelected ? '#dc2626' : '#047857',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {allSelected ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem' }}>
                        {mod.actions.map(act => (
                          <label key={act} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#374151', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={Boolean(currentActions[act])}
                              onChange={() => handleToggleAction(mod.module, act)}
                              style={{ accentColor: '#047857', width: 16, height: 16 }}
                            />
                            <span style={{ textTransform: 'capitalize' }}>{act}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '0.65rem 1.5rem', fontSize: '0.875rem', background: '#047857', borderColor: '#047857' }}
                >
                  {editingRole ? 'Save Changes' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ROLE DETAILS MODAL */}
      {viewingRole && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem 1rem'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewingRole(null);
          }}
        >
          <div style={{ width: '100%', maxWidth: 560, background: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
                  {viewingRole.name} Privileges
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Granular system permission summary</span>
              </div>
              <button onClick={() => setViewingRole(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem 1.75rem', maxHeight: '70vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {viewingRole.permissions.map(p => (
                <div key={p.module} style={{ border: '1px solid #f3f4f6', borderRadius: '8px', padding: '0.75rem 1rem', background: '#fafafa' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                    {p.label}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {p.create && <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: 4, fontWeight: 700 }}>CREATE</span>}
                    {p.read && <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: 4, fontWeight: 700 }}>READ</span>}
                    {p.update && <span style={{ background: '#fffbeb', color: '#b45309', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: 4, fontWeight: 700 }}>UPDATE</span>}
                    {p.delete && <span style={{ background: '#fff1f2', color: '#be123c', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: 4, fontWeight: 700 }}>DELETE</span>}
                    {p.export && <span style={{ background: '#f5f3ff', color: '#6d28d9', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: 4, fontWeight: 700 }}>EXPORT</span>}
                    {!p.create && !p.read && !p.update && !p.delete && !p.export && (
                      <span style={{ color: '#9ca3af', fontSize: '0.725rem' }}>No access</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '1rem 1.75rem', background: '#f9fafb', borderTop: '1px solid #f3f4f6', textAlign: 'right' }}>
              <button onClick={() => setViewingRole(null)} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALL ROLES PERMISSIONS MATRIX MODAL */}
      {isMatrixOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem 1rem'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMatrixOpen(false);
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 960,
              maxHeight: '90vh',
              background: '#ffffff',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid #e5e7eb',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            {/* Header */}
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
                  All System Permissions Matrix
                </h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                  Comprehensive matrix of granted actions across all configured roles and modules.
                </p>
              </div>
              <button onClick={() => setIsMatrixOpen(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Matrix Table */}
            <div style={{ padding: '1.25rem 1.75rem', overflowY: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#374151' }}>Role</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#374151' }}>Products</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#374151' }}>Orders</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#374151' }}>Customers</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#374151' }}>Inventory</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#374151' }}>Roles</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#374151' }}>Settings</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map(r => {
                    const getModuleActions = (modKey: string) => {
                      if (r.id === 'role-super-admin') return ['All'];
                      const perm = r.permissions.find(p => p.module === modKey);
                      if (!perm) return [];
                      const acts: string[] = [];
                      if (perm.create) acts.push('C');
                      if (perm.read) acts.push('R');
                      if (perm.update) acts.push('U');
                      if (perm.delete) acts.push('D');
                      if (perm.export) acts.push('E');
                      return acts;
                    };

                    return (
                      <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#111827' }}>
                          <div>{r.name}</div>
                          <div style={{ fontSize: '0.675rem', color: '#6b7280', marginTop: 2 }}>
                            {r.isSystem ? 'System Defined' : 'Custom'}
                          </div>
                        </td>
                        {['products', 'orders', 'customers', 'inventory', 'roles', 'settings'].map(modKey => {
                          const acts = getModuleActions(modKey);
                          return (
                            <td key={modKey} style={{ padding: '0.85rem 1rem' }}>
                              {acts.length === 0 ? (
                                <span style={{ color: '#d1d5db' }}>—</span>
                              ) : acts.includes('All') ? (
                                <span style={{ background: '#ecfdf5', color: '#047857', padding: '0.15rem 0.4rem', borderRadius: 4, fontWeight: 700, fontSize: '0.7rem' }}>
                                  Full Access
                                </span>
                              ) : (
                                <div style={{ display: 'flex', gap: '0.2rem', flexWrap: 'wrap' }}>
                                  {acts.map(a => (
                                    <span
                                      key={a}
                                      style={{
                                        background: a === 'D' ? '#fef2f2' : a === 'C' ? '#ecfdf5' : '#eff6ff',
                                        color: a === 'D' ? '#dc2626' : a === 'C' ? '#047857' : '#2563eb',
                                        padding: '0.1rem 0.35rem',
                                        borderRadius: 3,
                                        fontWeight: 800,
                                        fontSize: '0.675rem'
                                      }}
                                      title={a === 'C' ? 'Create' : a === 'R' ? 'Read' : a === 'U' ? 'Update' : a === 'D' ? 'Delete' : 'Export'}
                                    >
                                      {a}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px', fontSize: '0.725rem', color: '#6b7280', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600 }}>Legend:</span>
                <span><strong style={{ color: '#047857' }}>C</strong> = Create</span>
                <span><strong style={{ color: '#2563eb' }}>R</strong> = Read</span>
                <span><strong style={{ color: '#d97706' }}>U</strong> = Update</span>
                <span><strong style={{ color: '#dc2626' }}>D</strong> = Delete</span>
                <span><strong style={{ color: '#7c3aed' }}>E</strong> = Export</span>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '1rem 1.75rem', background: '#f9fafb', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setIsMatrixOpen(false)} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                Close Overview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Role Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(roleToDelete)}
        title="Delete System Role"
        itemName={roleToDelete?.name || ''}
        itemType="Role"
        warningMessage="Are you sure you want to permanently delete this role? Any staff members currently assigned to this role will lose their custom permissions."
        isDeleting={isDeletingRole}
        onConfirm={handleConfirmDelete}
        onCancel={() => setRoleToDelete(null)}
      />
    </div>
  );
}
