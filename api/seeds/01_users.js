/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const { SHA256 } = require('crypto-js');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex.schema.raw('TRUNCATE user_table CASCADE');
  await knex('user_table').del();
  await knex('user_table').insert([
    {
      fname: 'Not Accepted',
      lname: 'Not Accepted',
      email: 'notAcc@admin.net',
      p1_account: 'admin_acc',
      p1_auth: 'admin_auth',
      type: 1, // Example: 1 for Admin
      password: SHA256('admin').toString(),
      availability: 'Unavailable',
      experience: 'Leadership,Security,Development',
      languages: 'English',
      operating_systems: 'Linux,Windows',
      avatar_url: 'https://everydaypower.com/wp-content/uploads/2023/01/HAL-9000-Quotes-From-The-Famous-Space-Odyssey-Series.jpg',
      time_available: '00:00:00',
      is_supracoder: false
    },
    {
      fname: 'Jamel',
      lname: 'Sanders',
      email: 'JSandz@user.org',
      p1_account: 'mel_sandz_acc',
      p1_auth: 'mel_sandz_auth',
      type: 2, // Example: 2 for Supra Coder
      password: SHA256('P@ssw0rd').toString(),
      availability: 'Weekdays 9AM-5PM',
      experience: 'Node.js,React,PostgreSQL',
      languages: 'English,Spanish',
      operating_systems: 'Linux,macOS',
      avatar_url: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2209/7421344/1000w_q95.jpg',
      time_available: '09:00:00',
      is_supracoder: true
    },
    {
      fname: 'Bodie',
      lname: 'Stodie',
      email: 'BStodie@user.org',
      p1_account: 'bodie_acc',
      p1_auth: 'bodie_auth',
      type: 3, // Example: 3 for IT Rep
      password: SHA256('P@ssw0rd').toString(),
      availability: 'Weekdays 10AM-6PM',
      experience: 'Troubleshooting,Networking,Security',
      languages: 'English',
      operating_systems: 'Windows,macOS',
      avatar_url: 'https://e7.pngegg.com/pngimages/136/22/png-clipart-user-profile-computer-icons-girl-customer-avatar-angle-heroes-thumbnail.png',
      time_available: '10:00:00',
      is_supracoder: false
    },
    {
      fname: 'Remi',
      lname: 'Stemi',
      email: 'RStemi@user.org',
      p1_account: 'remi_acc',
      p1_auth: 'remi_auth',
      type: 4, // Example: 4 for Operator
      password: SHA256('P@ssw0rd').toString(),
      availability: 'Weekends 8AM-4PM',
      experience: 'Operations,Flight Control',
      languages: 'English,French',
      operating_systems: 'Linux',
      avatar_url: 'https://as1.ftcdn.net/v2/jpg/02/85/15/18/1000_F_285151855_XaVw4eFq1QufklRbMFDxdAJos1OadAD1.jpg',
      time_available: '08:00:00',
      is_supracoder: false
    },
    {
      fname: 'Harley',
      lname: 'Quinn',
      email: 'harls93@antihero.org',
      p1_account: 'harls_acc',
      p1_auth: 'harls_auth',
      type: 2, // Example: 2 for Supra Coder
      password: SHA256('ives').toString(),
      availability: 'Evenings',
      experience: 'Software Development,Psychology',
      languages: 'English',
      operating_systems: 'Windows',
      avatar_url: 'https://lh3.googleusercontent.com/I29quGiEZq6W7xSBXssYej2xQvTLQaSIvgF5XkTDCGZeaP2ZJN_FPfIcWqGWK97pIGM',
      time_available: '18:00:00',
      is_supracoder: true
    },
    {
      fname: 'Misato',
      lname: 'Katsuragi',
      email: 'misatoK95@nerv.org',
      p1_account: 'misato_acc',
      p1_auth: 'misato_auth',
      type: 4, // Example: 4 for Ops Director
      password: SHA256('eva').toString(),
      availability: 'Anytime',
      experience: 'Leadership,Operations,Strategy',
      languages: 'Japanese,English',
      operating_systems: 'Linux',
      avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRDIrswYVBFlvEI-7lrWALPKIGQCo2n46BbjmJBcuSgkhw2R-1m-knYmVM1WVEavvij6E&usqp=CAU',
      time_available: '12:00:00',
      is_supracoder: false
    },
    {
      fname: 'Bruce',
      lname: 'Wayne',
      email: 'bwayne39@hero.org',
      p1_account: 'bwayne_acc',
      p1_auth: 'bwayne_auth',
      type: 2, // Example: 2 for Supra Coder
      password: SHA256('batman').toString(),
      availability: 'Evenings and Weekends',
      experience: 'Business,Software Development,Security',
      languages: 'English',
      operating_systems: 'Linux,Windows',
      avatar_url: 'https://i.pinimg.com/736x/98/72/73/9872732415e47ec3ed6c1cece23cfc86.jpg',
      time_available: '20:00:00',
      is_supracoder: true
    }
  ]);
};
