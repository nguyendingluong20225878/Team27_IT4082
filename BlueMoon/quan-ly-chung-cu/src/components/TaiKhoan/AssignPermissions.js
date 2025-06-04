// quan-ly-chung-cu/src/components/TaiKhoan/AssignPermissions.js
import React from 'react';

const AssignPermissions = ({ onCancel }) => {
    return (
        <div className="form-container">
            <h3>Phân quyền Tài khoản</h3>
            <p>Chức năng phân quyền được thực hiện thông qua việc chỉnh sửa vai trò trong mục "Chỉnh sửa tài khoản".</p>
            <button onClick={onCancel} className="btn btn-secondary">Quay lại</button>
        </div>
    );
};

export default AssignPermissions;