const { SHA256 } = require('crypto-js');
const newLeader = {
    first_name: 'test first name',
    last_name: 'test last name',
    username: 'test_leader',
    email: 'notAcc@leader.net',
    job_title: 'System Administrator',
    p1_account: 'admin_acc',
    p1_auth: 'admin_auth',
    type: 2, // leader
    password: SHA256('leader').toString(),
    availability: 'Unavailable',
    experience: 'Leadership,Security,Development',
    languages: 'English',
    operating_systems: 'Linux,Windows',
    avatar_url: 'https://everydaypower.com/wp-content/uploads/2023/01/HAL-9000-Quotes-From-The-Famous-Space-Odyssey-Series.jpg',
    profile_pic: 'default_leader.jpg',
    user_summary: 'System administrator with extensive experience in security and development.',
    time_available: 10,
    is_supracoder: false,
    supradoubloons: 1000
};

module.exports =  newLeader;