// Settings Management
class SettingsManager {
    constructor() {
        this.roles = [];
        this.currentEditRoleId = null;
        this.allPermissions = [
            'dashboard', 'customers', 'tasks', 'employees', 'documents', 
            'reports', 'chat', 'internal', 'settings', 'user_management',
            'financial_management', 'system_config', 'create_form_link', 'view_all_customers',
            'view_all_tasks', 'view_all_documents', 'manage_roles', 'manage_settings'
        ];
        this.init();
    }

    init() {
        console.log('SettingsManager initialized');
        // Add any initial setup here
    }

    // --- Role Management --- 
    async openRoleManagement() {
        document.getElementById('roleManagementModal').style.display = 'flex';
        await this.loadRoles();
        this.populatePermissionsCheckboxes();
        document.getElementById('roleForm').addEventListener('submit', (e) => this.handleRoleFormSubmit(e));
    }

    closeRoleModal() {
        document.getElementById('roleManagementModal').style.display = 'none';
        this.closeAddEditRoleModal();
    }

    async loadRoles() {
        try {
            const snapshot = await db.collection('settings').doc('roles').collection('definitions').get();
            this.roles = [];
            snapshot.forEach(doc => {
                this.roles.push({ id: doc.id, ...doc.data() });
            });
            this.renderRoles();
        } catch (error) {
            console.error('Error loading roles:', error);
            alert('Lỗi khi tải vai trò: ' + error.message);
        }
    }

    renderRoles() {
        const tbody = document.getElementById('rolesTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (this.roles.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" class="empty-state">Chưa có vai trò nào.</td></tr>`;
            return;
        }

        this.roles.forEach(role => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${role.id}</td>
                <td>${role.displayName}</td>
                <td>
                    <button class="btn btn-sm btn-edit" onclick="settingsManager.editRole('${role.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-delete" onclick="settingsManager.deleteRole('${role.id}')"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    populatePermissionsCheckboxes(selectedPermissions = []) {
        const container = document.getElementById('permissionsCheckboxes');
        if (!container) return;
        container.innerHTML = '';

        this.allPermissions.forEach(perm => {
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'checkbox-item';
            checkboxDiv.innerHTML = `
                <input type="checkbox" id="perm-${perm}" value="${perm}" ${selectedPermissions.includes(perm) ? 'checked' : ''}>
                <label for="perm-${perm}">${perm.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
            `;
            container.appendChild(checkboxDiv);
        });
    }

    openAddEditRoleModal(roleId = null) {
        this.currentEditRoleId = roleId;
        document.getElementById('addEditRoleForm').style.display = 'block';
        document.getElementById('roleForm').reset();
        document.getElementById('formTitle').textContent = roleId ? 'Sửa' : 'Thêm';
        document.getElementById('roleId').readOnly = roleId ? true : false;

        if (roleId) {
            const role = this.roles.find(r => r.id === roleId);
            if (role) {
                document.getElementById('roleId').value = role.id;
                document.getElementById('roleDisplayName').value = role.displayName;
                this.populatePermissionsCheckboxes(role.permissions || []);
            }
        } else {
            this.populatePermissionsCheckboxes([]);
        }
    }

    closeAddEditRoleModal() {
        document.getElementById('addEditRoleForm').style.display = 'none';
        document.getElementById('roleForm').reset();
        this.currentEditRoleId = null;
    }

    async handleRoleFormSubmit(e) {
        e.preventDefault();
        const roleId = document.getElementById('roleId').value.toLowerCase();
        const displayName = document.getElementById('roleDisplayName').value;
        const selectedPermissions = Array.from(document.querySelectorAll('#permissionsCheckboxes input:checked')).map(cb => cb.value);

        if (!roleId || !displayName) {
            alert('Vui lòng điền đầy đủ ID và Tên hiển thị.');
            return;
        }

        try {
            const roleRef = db.collection('settings').doc('roles').collection('definitions').doc(roleId);
            await roleRef.set({
                displayName: displayName,
                permissions: selectedPermissions
            }, { merge: true });

            alert('Lưu vai trò thành công!');
            this.closeAddEditRoleModal();
            this.loadRoles();
        } catch (error) {
            console.error('Error saving role:', error);
            alert('Lỗi khi lưu vai trò: ' + error.message);
        }
    }

    async editRole(roleId) {
        this.openAddEditRoleModal(roleId);
    }

    async deleteRole(roleId) {
        if (!confirm('Bạn có chắc chắn muốn xóa vai trò này? Thao tác này không thể hoàn tác và có thể ảnh hưởng đến người dùng đang có vai trò này.')) return;

        try {
            await db.collection('settings').doc('roles').collection('definitions').doc(roleId).delete();
            alert('Xóa vai trò thành công!');
            this.loadRoles();
        } catch (error) {
            console.error('Error deleting role:', error);
            alert('Lỗi khi xóa vai trò: ' + error.message);
        }
    }

    // --- Placeholder functions for other sections --- 
    openStatusManagement() {
        alert('Quản lý Trạng thái đang được phát triển!');
    }

    openProductManagement() {
        alert('Quản lý Sản phẩm đang được phát triển!');
    }

    openGeneralSettings() {
        alert('Cài đặt Chung đang được phát triển!');
    }
}

// Initialize settings manager
let settingsManager;
document.addEventListener('DOMContentLoaded', () => {
    settingsManager = new SettingsManager();
});
