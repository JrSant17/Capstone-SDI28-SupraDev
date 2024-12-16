/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  const hashedPassword = await bcrypt.hash('password', 10);
  
  await knex.schema.raw('TRUNCATE user_table CASCADE');
  await knex('user_table').del();
  await knex('user_table').insert([
    {
      first_name: 'Not Accepted',
      last_name: 'Not Accepted',
      username: 'admin_user',
      email: 'notAcc@admin.net',
      job_title: 'System Administrator',
      p1_account: 'admin_acc',
      p1_auth: 'admin_auth',
      type: 4, // admin
      password: hashedPassword,
      availability: 'Unavailable',
      experience: 'Leadership,Security,Development',
      languages: 'English',
      operating_systems: 'Linux,Windows',
      avatar_url: 'https://everydaypower.com/wp-content/uploads/2023/01/HAL-9000-Quotes-From-The-Famous-Space-Odyssey-Series.jpg',
      profile_pic: 'default_admin.jpg',
      user_summary: 'System administrator with extensive experience in security and development.',
      time_available: 10,
      is_supracoder: false,
      supradoubloons: 1000,
      command: "SPOC"
    },
    {
      first_name: 'Bodie',
      last_name: 'Stodie',
      username: 'BStodie',
      email: 'BStodie@user.org',
      job_title: 'IT Representative',
      p1_account: 'bodie_acc',
      p1_auth: 'bodie_auth',
      type: 3, // normal user
      password: hashedPassword,
      availability: 'Weekdays 10AM-6PM',
      experience: 'Troubleshooting,Networking,Security',
      languages: 'English',
      operating_systems: 'Windows,macOS',
      avatar_url: 'https://e7.pngegg.com/pngimages/136/22/png-clipart-user-profile-computer-icons-girl-customer-avatar-angle-heroes-thumbnail.png',
      profile_pic: 'bodie_profile.jpg',
      user_summary: 'IT professional with expertise in troubleshooting and network security.',
      time_available: 10,
      is_supracoder: false,
      supradoubloons: 250,
      command: "SPOC"
    },
    {
      first_name: 'Remi',
      last_name: 'Stemi',
      username: 'RStemi',
      email: 'RStemi@user.org',
      job_title: 'Operations Specialist',
      p1_account: 'remi_acc',
      p1_auth: 'remi_auth',
      type: 1, 
      password: hashedPassword,
      availability: 'Weekends 8AM-4PM',
      experience: 'Operations,Flight Control',
      languages: 'English,French',
      operating_systems: 'Linux',
      avatar_url: 'https://as1.ftcdn.net/v2/jpg/02/85/15/18/1000_F_285151855_XaVw4eFq1QufklRbMFDxdAJos1OadAD1.jpg',
      profile_pic: 'remi_profile.jpg',
      user_summary: 'Operations specialist with experience in flight control systems.',
      time_available: 10,
      is_supracoder: false,
      supradoubloons: 300,
      command: "SPOC"
    },
    {
      first_name: 'Harley',
      last_name: 'Quinn',
      username: 'harls93',
      email: 'harls93@antihero.org',
      job_title: 'Software Developer',
      p1_account: 'harls_acc',
      p1_auth: 'harls_auth',
      type: 1,
      password: hashedPassword,
      availability: 'Evenings',
      experience: 'Software Development,Psychology',
      languages: 'English',
      operating_systems: 'Windows',
      avatar_url: 'https://lh3.googleusercontent.com/I29quGiEZq6W7xSBXssYej2xQvTLQaSIvgF5XkTDCGZeaP2ZJN_FPfIcWqGWK97pIGM',
      profile_pic: 'harley_profile.jpg',
      user_summary: 'Eccentric developer with a unique blend of software and psychology expertise.',
      time_available: 10,
      is_supracoder: true,
      supradoubloons: 450,
      command: "SPOC"
    },
    {
      first_name: 'Misato',
      last_name: 'Katsuragi',
      username: 'misatoK95',
      email: 'misatoK95@nerv.org',
      job_title: 'Operations Director',
      p1_account: 'misato_acc',
      p1_auth: 'misato_auth',
      type: 1, 
      password: hashedPassword,
      availability: 'Anytime',
      experience: 'Leadership,Operations,Strategy',
      languages: 'Japanese,English',
      operating_systems: 'Linux',
      avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRDIrswYVBFlvEI-7lrWALPKIGQCo2n46BbjmJBcuSgkhw2R-1m-knYmVM1WVEavvij6E&usqp=CAU',
      profile_pic: 'misato_profile.jpg',
      user_summary: 'Experienced operations director with strong leadership and strategic planning skills.',
      time_available: 10,
      is_supracoder: false,
      supradoubloons: 750,
      command: "SPOC"
    },
    {
      first_name: 'Bruce',
      last_name: 'Wayne',
      username: 'bwayne39',
      email: 'bwayne3kdfd9@hero.org',
      job_title: 'CEO / Developer',
      p1_account: 'bwayne_acc',
      p1_auth: 'bwayne_auth',
      type: 2, // leader
      password: hashedPassword,
      availability: 'Evenings and Weekends',
      experience: 'Business,Software Development,Security',
      languages: 'English',
      operating_systems: 'Linux,Windows',
      avatar_url: 'https://i.pinimg.com/736x/98/72/73/9872732415e47ec3ed6c1cece23cfc86.jpg',
      profile_pic: 'bruce_profile.jpg',
      user_summary: 'Multifaceted professional with expertise in business, software development, and security.',
      time_available: 10,
      is_supracoder: true,
      supradoubloons: 1000,
      command: "SPOC"
    },
    {
      first_name: 'test',
      last_name: 'test',
      username: 'testsupra',
      email: 'bwaynefgdf39@hero.org',
      job_title: 'CEO / Developer',
      p1_account: 'bwayne_acc',
      p1_auth: 'bwayne_auth',
      type: 1, // Supra Coder
      password: hashedPassword,
      availability: 'Evenings and Weekends',
      experience: 'Business,Software Development,Security',
      languages: 'English',
      operating_systems: 'Linux,Windows',
      avatar_url: 'https://i.pinimg.com/736x/98/72/73/9872732415e47ec3ed6c1cece23cfc86.jpg',
      profile_pic: 'bruce_profile.jpg',
      user_summary: 'Multifaceted professional with expertise in business, software development, and security.',
      time_available: 10,
      is_supracoder: true,
      supradoubloons: 1000,
      command: "SSC"
    },
    {
      first_name: 'test',
      last_name: 'test',
      username: 'testleader',
      email: 'bwayne32229@hero.org',
      job_title: 'CEO / Developer',
      p1_account: 'bwayne_acc',
      p1_auth: 'bwayne_auth',
      type: 2, // leader
      password: hashedPassword,
      availability: 'Evenings and Weekends',
      experience: 'Business,Software Development,Security',
      languages: 'English',
      operating_systems: 'Linux,Windows',
      avatar_url: 'https://i.pinimg.com/736x/98/72/73/9872732415e47ec3ed6c1cece23cfc86.jpg',
      profile_pic: 'bruce_profile.jpg',
      user_summary: 'Multifaceted professional with expertise in business, software development, and security.',
      time_available: 10,
      is_supracoder: false,
      supradoubloons: 1000,
      command: "STARCOM"
    },
    {
      first_name: 'test',
      last_name: 'test',
      username: 'testuser',
      email: 'bwayne3439@hero.org',
      job_title: 'CEO / Developer',
      p1_account: 'bwayne_acc',
      p1_auth: 'bwayne_auth',
      type: 3, // user
      password: hashedPassword,
      availability: 'Evenings and Weekends',
      experience: 'Business,Software Development,Security',
      languages: 'English',
      operating_systems: 'Linux,Windows',
      avatar_url: 'https://i.pinimg.com/736x/98/72/73/9872732415e47ec3ed6c1cece23cfc86.jpg',
      profile_pic: 'bruce_profile.jpg',
      user_summary: 'Multifaceted professional with expertise in business, software development, and security.',
      time_available: 10,
      is_supracoder: false,
      supradoubloons: 1000,
      command: "SPOC"
    },
    {
      first_name: 'test',
      last_name: 'test',
      username: 'testadmin',
      email: 'bwayne319@hero.org',
      job_title: 'CEO / Developer',
      p1_account: 'bwayne_acc',
      p1_auth: 'bwayne_auth',
      type: 4, // leader
      password: hashedPassword,
      availability: 'Evenings and Weekends',
      experience: 'Business,Software Development,Security',
      languages: 'English',
      operating_systems: 'Linux,Windows',
      avatar_url: 'https://i.pinimg.com/736x/98/72/73/9872732415e47ec3ed6c1cece23cfc86.jpg',
      profile_pic: 'bruce_profile.jpg',
      user_summary: 'Multifaceted professional with expertise in business, software development, and security.',
      time_available: 10,
      is_supracoder: false,
      supradoubloons: 1000,
      command: "STARCOM"
    },
  ]);
};
