const { SHA256 } = require('crypto-js');
const newAdmin = {
    first_name: 'test first name',
    last_name: 'test last name',
    username: 'test_admin',
    email: 'notAcc2@admin.net',
    job_title: 'System Administrator',
    p1_account: 'admin_acc',
    p1_auth: 'admin_auth',
    type: 4, // admin
    password: SHA256('admin').toString(),
    availability: 'Unavailable',
    experience: 'Leadership,Security,Development',
    languages: 'English',
    operating_systems: 'Linux,Windows',
    avatar_url: 'https://everydaypower.com/wp-content/uploads/2023/01/HAL-9000-Quotes-From-The-Famous-Space-Odyssey-Series.jpg',
    profile_pic: 'default_admin.jpg',
    user_summary: 'System administrator with extensive experience in security and development.',
    time_available: 10,
    is_supracoder: false,
    supradoubloons: 1000
};

module.exports =  newAdmin;