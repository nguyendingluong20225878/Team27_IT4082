const express = require('express');
// THAY THẾ DÒNG IMPORT SAU:
// Chúng ta sẽ thử các đường dẫn phổ biến nhất cho instance Sequelize.
// Hầu hết các setup Sequelize sẽ export instance 'sequelize' thông qua đối tượng 'db' từ models/index.js
// HOẶC trực tiếp instance 'sequelize' từ một file nào đó trong thư mục 'models'.
let sequelize;
try {
    // Trường hợp 1: Phổ biến nhất - models/index.js export { sequelize } từ đối tượng db
    const models = require('../models');
    sequelize = models.sequelize;
    if (!sequelize) {
        // Trường hợp 1a: models/index.js export trực tiếp sequelize instance
        sequelize = models;
    }
} catch (error) {
    // Nếu cách trên không tìm thấy, thử các đường dẫn khác
    try {
        // Trường hợp 2: Nếu models/index.js không tồn tại, có thể là một file khác trong models/
        // Ví dụ: models/db.js hoặc models/connection.js
        const connection = require('../models/connection'); // Thay 'connection' bằng tên file phù hợp nếu bạn biết
        sequelize = connection.sequelize || connection; // Hoặc là object {sequelize} hoặc trực tiếp instance
    } catch (err2) {
        // Trường hợp 3: Có thể sequelize được export từ một file config nào đó ngoài models
        // Ví dụ: config/database.js hoặc config/db.js
        try {
            const dbConfig = require('../config/database'); // Thay 'database' bằng tên file phù hợp
            sequelize = dbConfig.sequelize || dbConfig;
        } catch (err3) {
            console.error('Không tìm thấy instance Sequelize ở bất kỳ đường dẫn nào phổ biến.', error.message, err2.message, err3.message);
            // Sẽ báo lỗi nếu không tìm thấy, nhưng ít nhất không crash ngay lập tức
        }
    }
}

// Kiểm tra lại xem sequelize đã được tìm thấy chưa
if (!sequelize || !sequelize.transaction) {
    console.error("LỖI KHỞI TẠO: Không tìm thấy instance Sequelize hoặc nó không có phương thức .transaction().");
    // Bạn có thể muốn throw error hoặc xử lý khác ở đây nếu không thể tiếp tục mà không có sequelize
    // For now, it will crash later when calling sequelize.transaction()
}


const { DotThuPhi, ChiTietThuPhi, DotThuPhiKhoanThu } = require('../models/DotThuPhi');
const KhoanThu = require('../models/KhoanThu');
const HoKhau = require('../models/HoKhau');
const NhanKhau = require('../models/NhanKhau');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeRoles');
const { Op } = require('sequelize');

const router = express.Router();

// Hàm cập nhật trạng thái đợt thu phí
const updateDotThuPhiStatus = async (dotThuPhiId) => {
    try {
        const dotThuPhi = await DotThuPhi.findByPk(dotThuPhiId);
        if (!dotThuPhi) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const ngayBatDau = new Date(dotThuPhi.ngayBatDau);
        ngayBatDau.setHours(0, 0, 0, 0);

        const ngayKetThuc = new Date(dotThuPhi.ngayKetThuc);
        ngayKetThuc.setHours(0, 0, 0, 0);

        let newStatus = dotThuPhi.trangThai;
        if (today < ngayBatDau) {
            newStatus = 'Sắp tới';
        } else if (today >= ngayBatDau && today <= ngayKetThuc) {
            newStatus = 'Đang diễn ra';
        } else if (today > ngayKetThuc) {
            newStatus = 'Đã kết thúc';
        }

        if (newStatus !== dotThuPhi.trangThai) {
            dotThuPhi.trangThai = newStatus;
            await dotThuPhi.save();
        }
    } catch (err) {
        console.error('Lỗi khi cập nhật trạng thái đợt thu phí:', err.message);
    }
};


// @route   GET /api/dot-thu-phi
// @desc    Lấy tất cả đợt thu phí
// @access  Private (Chỉ Kế toán)
router.get('/', [auth, authorize('Kế toán')], async (req, res) => {
    try {
        const dotThuPhis = await DotThuPhi.findAll({
            include: [{
                model: KhoanThu,
                as: 'khoanThus',
                through: { attributes: ['giaTriApDung'] },
                attributes: ['id', 'tenKhoanThu', 'mucPhi', 'donVi', 'batBuoc']
            }],
            order: [['ngayBatDau', 'DESC']]
        });

        for (const dot of dotThuPhis) {
            await updateDotThuPhiStatus(dot.id);
        }
        const updatedDotThuPhis = await DotThuPhi.findAll({
            include: [{
                model: KhoanThu,
                as: 'khoanThus',
                through: { attributes: ['giaTriApDung'] },
                attributes: ['id', 'tenKhoanThu', 'mucPhi', 'donVi', 'batBuoc']
            }],
            order: [['ngayBatDau', 'DESC']]
        });
        res.json(updatedDotThuPhis);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   GET /api/dot-thu-phi/:id
// @desc    Lấy một đợt thu phí theo ID (bao gồm các khoản thu)
// @access  Private (Chỉ Kế toán)
router.get('/:id', [auth, authorize('Kế toán')], async (req, res) => {
    try {
        const dotThuPhi = await DotThuPhi.findByPk(req.params.id, {
            include: [{
                model: KhoanThu,
                as: 'khoanThus',
                through: { attributes: ['giaTriApDung'] },
                attributes: ['id', 'tenKhoanThu', 'mucPhi', 'donVi', 'batBuoc']
            }]
        });
        if (!dotThuPhi) {
            return res.status(404).json({ msg: 'Đợt thu phí không tìm thấy' });
        }
        await updateDotThuPhiStatus(dotThuPhi.id);
        res.json(dotThuPhi);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   POST /api/dot-thu-phi
// @desc    Tạo mới đợt thu phí
// @access  Private (Chỉ Kế toán)
router.post('/', [auth, authorize('Kế toán')], async (req, res) => {
    const { tenDotThu, moTa, ngayBatDau, ngayKetThuc, khoanThusIds } = req.body;

    try {
        let dotThu = await DotThuPhi.findOne({ where: { tenDotThu } });
        if (dotThu) {
            return res.status(400).json({ msg: 'Tên đợt thu đã tồn tại' });
        }

        const newDotThuPhi = await DotThuPhi.create({
            tenDotThu, moTa, ngayBatDau, ngayKetThuc,
            trangThai: 'Sắp tới',
            tongTienDuKien: 0
        });

        if (khoanThusIds && khoanThusIds.length > 0) {
            const selectedKhoanThus = await KhoanThu.findAll({ where: { id: khoanThusIds } });
            if (selectedKhoanThus.length !== khoanThusIds.length) {
                return res.status(400).json({ msg: 'Một hoặc nhiều khoản thu không hợp lệ' });
            }

            const bulkInsertData = selectedKhoanThus.map(kt => ({
                dotThuPhiId: newDotThuPhi.id,
                khoanThuId: kt.id,
                giaTriApDung: kt.mucPhi
            }));
            await DotThuPhiKhoanThu.bulkCreate(bulkInsertData);
        }

        await updateDotThuPhiStatus(newDotThuPhi.id);
        const createdDotThuPhi = await DotThuPhi.findByPk(newDotThuPhi.id, {
            include: [{
                model: KhoanThu,
                as: 'khoanThus',
                through: { attributes: ['giaTriApDung'] }
            }]
        });

        res.status(201).json(createdDotThuPhi);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   PUT /api/dot-thu-phi/:id
// @desc    Cập nhật đợt thu phí (bao gồm chỉnh sửa khoản thu liên quan)
// @access  Private (Chỉ Kế toán)
router.put('/:id', [auth, authorize('Kế toán')], async (req, res) => {
    const { tenDotThu, moTa, ngayBatDau, ngayKetThuc, khoanThusIds, trangThai } = req.body;
    const dotThuPhiId = req.params.id;

    try {
        let dotThuPhi = await DotThuPhi.findByPk(dotThuPhiId);
        if (!dotThuPhi) {
            return res.status(404).json({ msg: 'Đợt thu phí không tìm thấy' });
        }

        if (tenDotThu && tenDotThu !== dotThuPhi.tenDotThu) {
            const existingDotThu = await DotThuPhi.findOne({ where: { tenDotThu } });
            if (existingDotThu) {
                return res.status(400).json({ msg: 'Tên đợt thu đã tồn tại' });
            }
        }

        dotThuPhi.tenDotThu = tenDotThu || dotThuPhi.tenDotThu;
        dotThuPhi.moTa = moTa !== undefined ? moTa : dotThuPhi.moTa;
        dotThuPhi.ngayBatDau = ngayBatDau || dotThuPhi.ngayBatDau;
        dotThuPhi.ngayKetThuc = ngayKetThuc || dotThuPhi.ngayKetThuc;
        dotThuPhi.trangThai = trangThai || dotThuPhi.trangThai;

        await dotThuPhi.save();

        if (khoanThusIds !== undefined) {
            await DotThuPhiKhoanThu.destroy({ where: { dotThuPhiId } });

            if (khoanThusIds.length > 0) {
                const selectedKhoanThus = await KhoanThu.findAll({ where: { id: khoanThusIds } });
                if (selectedKhoanThus.length !== khoanThusIds.length) {
                    return res.status(400).json({ msg: 'Một hoặc nhiều khoản thu không hợp lệ' });
                }
                const bulkInsertData = selectedKhoanThus.map(kt => ({
                    dotThuPhiId: dotThuPhi.id,
                    khoanThuId: kt.id,
                    giaTriApDung: kt.mucPhi
                }));
                await DotThuPhiKhoanThu.bulkCreate(bulkInsertData);
            }
        }

        await updateDotThuPhiStatus(dotThuPhi.id);
        const updatedDotThuPhi = await DotThuPhi.findByPk(dotThuPhi.id, {
            include: [{
                model: KhoanThu,
                as: 'khoanThus',
                through: { attributes: ['giaTriApDung'] }
            }]
        });

        res.json(updatedDotThuPhi);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   DELETE /api/dot-thu-phi/:id
// @desc    Xóa đợt thu phí
// @access  Private (Chỉ Kế toán)
router.delete('/:id', [auth, authorize('Kế toán')], async (req, res) => {
    const dotThuPhiId = req.params.id;

    try {
        const dotThuPhi = await DotThuPhi.findByPk(dotThuPhiId);
        if (!dotThuPhi) {
            return res.status(404).json({ msg: 'Đợt thu phí không tìm thấy' });
        }
        await dotThuPhi.destroy();
        res.json({ msg: 'Đợt thu phí đã được xóa' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});


// @route   POST /api/dot-thu-phi/:id/generate-receipts
// @desc    Lập danh sách chi tiết thu phí cho từng hộ khẩu trong đợt thu
// @access  Private (Chỉ Kế toán)
router.post('/:id/generate-receipts', [auth, authorize('Kế toán')], async (req, res) => {
    const dotThuPhiId = req.params.id;
    // Kiểm tra và sử dụng instance sequelize đã được tìm thấy ở trên cùng file
    if (!sequelize || !sequelize.transaction) {
        console.error("Lỗi: Instance Sequelize chưa được khởi tạo hoặc không có phương thức .transaction(). Không thể thực hiện transaction.");
        return res.status(500).send('Lỗi Server: Lỗi cấu hình database.');
    }
    const t = await sequelize.transaction();

    try {
        const dotThuPhi = await DotThuPhi.findByPk(dotThuPhiId, {
            include: [{
                model: KhoanThu,
                as: 'khoanThus',
                through: { attributes: ['giaTriApDung'] }
            }],
            transaction: t
        });

        if (!dotThuPhi) {
            await t.rollback();
            return res.status(404).json({ msg: 'Đợt thu phí không tìm thấy' });
        }

        if (dotThuPhi.trangThai === 'Đã kết thúc') {
            await t.rollback();
            return res.status(400).json({ msg: 'Không thể lập danh sách thu cho đợt đã kết thúc.' });
        }

        await ChiTietThuPhi.destroy({ where: { dotThuPhiId }, transaction: t });

        const hoKhaus = await HoKhau.findAll({
            include: [{ model: NhanKhau, as: 'nhanKhaus' }],
            transaction: t
        });
        let totalAmountDue = 0;
        const chiTietThuPhiData = [];

        for (const hoKhau of hoKhaus) {
            let hoKhauTotalDue = 0;
            for (const khoanThu of dotThuPhi.khoanThus) {
                let amountForThisKhoanThu = 0;
                const giaTriApDung = parseFloat(khoanThu.DotThuPhiKhoanThu.giaTriApDung);

                switch (khoanThu.donVi) {
                    case '/hộ':
                        amountForThisKhoanThu = giaTriApDung;
                        break;
                    case '/người':
                        amountForThisKhoanThu = giaTriApDung * (hoKhau.soThanhVien || hoKhau.nhanKhaus.length);
                        break;
                    default:
                        amountForThisKhoanThu = giaTriApDung;
                        break;
                }

                chiTietThuPhiData.push({
                    dotThuPhiId: dotThuPhi.id,
                    hoKhauId: hoKhau.id,
                    khoanThuId: khoanThu.id,
                    soTienPhaiDong: amountForThisKhoanThu,
                    soTienDaDong: 0,
                    trangThaiDong: 'Chưa đóng'
                });
                hoKhauTotalDue += amountForThisKhoanThu;
            }
            totalAmountDue += hoKhauTotalDue;
        }

        await ChiTietThuPhi.bulkCreate(chiTietThuPhiData, { transaction: t });

        dotThuPhi.tongTienDuKien = totalAmountDue;
        await dotThuPhi.save({ transaction: t });

        await t.commit();
        res.json({ msg: 'Danh sách thu phí đã được lập thành công!', totalAmountDue, chiTietThuPhiCount: chiTietThuPhiData.length });
    } catch (err) {
        if (t) {
            await t.rollback();
        }
        console.error('Lỗi khi lập danh sách thu:', err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   GET /api/dot-thu-phi/:id/chi-tiet-thu-phi
// @desc    Lấy chi tiết thu phí của một đợt thu phí (cho tất cả hộ khẩu)
// @access  Private (Chỉ Kế toán)
router.get('/:id/chi-tiet-thu-phi', [auth, authorize('Kế toán')], async (req, res) => {
    try {
        const dotThuPhiId = req.params.id;
        const chiTiet = await ChiTietThuPhi.findAll({
            where: { dotThuPhiId },
            include: [
                { model: HoKhau, as: 'hoKhau', attributes: ['maHoKhau', 'chuHo', 'diaChi'] },
                { model: KhoanThu, as: 'khoanThu', attributes: ['tenKhoanThu', 'donVi', 'mucPhi'] }
            ],
            order: [[{ model: HoKhau, as: 'hoKhau' }, 'maHoKhau', 'ASC']]
        });
        res.json(chiTiet);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   PUT /api/dot-thu-phi/chi-tiet/:id
// @desc    Cập nhật trạng thái đóng tiền của một chi tiết thu phí
// @access  Private (Chỉ Kế toán)
router.put('/chi-tiet/:id', [auth, authorize('Kế toán')], async (req, res) => {
    const chiTietId = req.params.id;
    const { soTienDaDong, trangThaiDong, ngayDong, ghiChu } = req.body;

    try {
        let chiTiet = await ChiTietThuPhi.findByPk(chiTietId);
        if (!chiTiet) {
            return res.status(404).json({ msg: 'Chi tiết thu phí không tìm thấy' });
        }

        chiTiet.soTienDaDong = soTienDaDong !== undefined ? soTienDaDong : chiTiet.soTienDaDong;
        chiTiet.trangThaiDong = trangThaiDong || chiTiet.trangThaiDong;
        chiTiet.ngayDong = ngayDong !== undefined ? ngayDong : chiTiet.ngayDong;
        chiTiet.ghiChu = ghiChu !== undefined ? ghiChu : chiTiet.ghiChu;

        await chiTiet.save();
        res.json(chiTiet);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

module.exports = router;