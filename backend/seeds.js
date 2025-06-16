const bcrypt = require('bcrypt'); // Vẫn cần cho bcrypt.compare ở chỗ khác, hoặc nếu bạn dùng nó trong seeds cho mục đích khác
const { User, Apartment, Fee } = require('./src/models');
const sequelize = require('./src/database');

async function seedDatabase() {
    try {
        console.log('Attempting to connect to database...');
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');

        // --- BỎ DÒNG NÀY ĐI HOÀN TOÀN ---
        // const hashedPassword = await bcrypt.hash('123456', 10);
        // console.log('Password hashed (This line is now illustrative if model handles hashing).');
        // ----------------------------------

        // --- Seed Users ---
        console.log('Attempting to seed Users...');
        const users = [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: '123456', // <-- TRUYỀN PASSWORD THÔ Ở ĐÂY
                role: 'admin',
                is_active: '1',
            },
            {
                name: 'Accountant User',
                email: 'accountant@example.com',
                password: '123456', // <-- TRUYỀN PASSWORD THÔ Ở ĐÂY
                role: 'accountant',
                is_active: '1',
            },
        ];

        for (const user of users) {
            // `findOrCreate` sẽ tạo user nếu chưa có. Khi tạo, `beforeCreate` hook trong model User sẽ tự động hash password này.
            const [seededUser, created] = await User.findOrCreate({
                where: { email: user.email },
                defaults: user,
            });
            if (created) {
                console.log(`- Created user: ${seededUser.email}`);
            } else {
                console.log(`- Found existing user: ${seededUser.email}`);
            }
        }
        console.log('✅ Users seeding process finished.');

        // ... (Giữ nguyên phần seed Apartments và Fees)
        // --- Seed Apartments ---
        console.log('Attempting to seed Apartments...');
        const [seededApartment, createdApartment] = await Apartment.findOrCreate({
            where: { id: 1 },
            defaults: {
                address_number: 101,
                area: 80.5,
                status: 'Resident',
                owner_id: null,
                owner_phone_number: null,
                number_of_members: 2,
                created_at: new Date(),
                updated_at: new Date()
            }
        });
        if (createdApartment) {
            console.log(`- Created apartment: ${seededApartment.address_number} (ID: ${seededApartment.id})`);
        } else {
            console.log(`- Found existing apartment: ${seededApartment.address_number} (ID: ${seededApartment.id})`);
        }
        console.log('✅ Apartments seeding process finished.');

        // --- Seed Fees ---
        console.log('Attempting to seed Fees...');
        const feesToSeed = [
            { name: 'Motorbike Parking Fee', amount: 100000, description: 'Phí gửi xe máy hàng tháng', type: 'monthly', due_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), status: 'active', created_at: new Date(), updated_at: new Date() },
            { name: 'Car Parking Fee', amount: 500000, description: 'Phí gửi ô tô hàng tháng', type: 'monthly', due_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), status: 'active', created_at: new Date(), updated_at: new Date() },
            { name: 'Bicycle Parking Fee', amount: 20000, description: 'Phí gửi xe đạp hàng tháng', type: 'monthly', due_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), status: 'active', created_at: new Date(), updated_at: new Date() }
        ];

        for (const fee of feesToSeed) {
            const [seededFee, createdFee] = await Fee.findOrCreate({
                where: { name: fee.name },
                defaults: fee,
            });
            if (createdFee) {
                console.log(`- Created fee: ${seededFee.name}`);
            } else {
                console.log(`- Found existing fee: ${seededFee.name}`);
            }
        }
        console.log('✅ Fees seeding process finished.');

        console.log('✅ All initial data seeding complete!');

    } catch (err) {
        console.error('❌ Error during database seeding:', err);
    } finally {
        console.log('Closing database connection...');
        await sequelize.close();
        console.log('Database connection closed.');
    }
}

seedDatabase();