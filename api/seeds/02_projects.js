/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex.schema.raw('TRUNCATE project_table CASCADE');
  await knex('project_table').del();

  // Inserts seed entries
  await knex('project_table').insert([
    {name: 'Smart Energy Management System', problem_statement: "We need a system that can monitor energy consumption patterns in real-time and suggest automated adjustments to optimize energy usage and reduce costs.", requirements: "The system should be able to collect data from various energy-consuming devices, process the data to detect usage patterns, and provide real-time recommendations. It should also support integration with smart devices for automated control and optimization.", url: "https://www.networkedenergy.com/uploads/footer_banner/555x295/1583402451.jpg", submitter_id: 7, is_approved: true, is_accepted: false, accepted_by_id: 1, is_completed: false, bounty_payout: 200, github_url: '', coders_needed: 4, program_languages: 'Ruby, JavaScript, Python', date_created: knex.fn.now(), end_date: '2025-6-30',
      last_updated:  knex.fn.now()
    },
    {name: 'Healthcare Appointment Scheduler', problem_statement: "The current appointment scheduling process in our healthcare facility is inefficient. We require software that can streamline scheduling, send reminders, and manage patient appointments seamlessly.", requirements: "The system should be able to handle appointment booking, send reminders via email or SMS, and allow for easy rescheduling and cancellations. Additionally, it should integrate with the healthcare facility's existing patient database and support user roles (patients, doctors, and admins).", url: "https://itfrontdesk.com/wp-content/uploads/2022/12/appointment-scheduling.jpg", submitter_id: 2, is_approved: true, is_accepted: false, accepted_by_id: 1, is_completed: false, bounty_payout: 100, github_url: '', coders_needed: 2, program_languages: 'Ruby', date_created: knex.fn.now(), end_date: '2024-04-16',
      last_updated: new Date().toISOString()
    },
    {name: 'Inventory Optimization Platform', problem_statement: "Our inventory management is becoming increasingly complex. We need a software solution that can predict demand, optimize stock levels, and reduce carrying costs.", submitter_id: 3, is_approved: true, is_accepted: true, accepted_by_id: 1, is_completed: false, bounty_payout: 300, github_url: 'https://github.com/',coders_needed: 2, program_languages: 'Ruby', date_created: knex.fn.now(), end_date: '2024-12-31',
      last_updated:  knex.fn.now()
    },
    {name: 'Environmental Monitoring Dashboard', problem_statement: "Environmental data collection is vital, but our current systems are outdated. We need a modern dashboard that can aggregate and visualize data from various sensors for better decision-making in environmental management.", submitter_id: 1, is_approved: true, is_accepted: true, accepted_by_id: 1, is_completed: false, bounty_payout: 500, github_url: 'https://github.com/', coders_needed: 1, program_languages: 'Ruby', date_created: knex.fn.now(), end_date: '2024-12-31',
      last_updated:  knex.fn.now()
    },
    {name: 'Close approach alert software', problem_statement: "The current timeline for close approach is too long given the current process. Looking for an app that can pull in information from spacetrack, compare it to our state vector, and send automated alerts if a close approach is within a certian time period", submitter_id: 6, is_approved: true, is_accepted: true, accepted_by_id: 1, is_completed: false, bounty_payout: 700, github_url: 'https://github.com/', coders_needed: 1, program_languages: 'Ruby', date_created: knex.fn.now(), end_date: '2024-12-31',
      last_updated:  knex.fn.now()
    },
    {name: 'Financial Wellness Tracker', problem_statement: "Financial well-being is a priority for our employees. We're searching for a tool that can provide personalized financial advice, track expenses, and offer budgeting recommendations.", requirements: "The tool should provide personalized financial advice based on the user’s financial profile and goals. It must track income, expenses, and investments, and generate detailed reports on spending habits. Additionally, it should offer budgeting recommendations, help set savings goals, and provide reminders for bill payments. The system should support integration with bank accounts and credit cards to automatically import transactions and offer data security features for sensitive financial information.", url: "https://employee.hr.lacounty.gov/wp-content/uploads/2015/10/financ.wellness.jpg", submitter_id: 6, is_approved: true, is_accepted: true, accepted_by_id: 2, is_completed: false, bounty_payout: 200, github_url: 'https://github.com/', coders_needed: 1, program_languages: 'Ruby', date_created: knex.fn.now(), end_date: '2024-12-31',
      last_updated:  knex.fn.now()
    },
    {name: 'Remote Team Collaboration Hub', problem_statement: "As remote work becomes the norm, we need a centralized platform that seamlessly integrates video conferencing, document collaboration, and task management to enhance team productivity and communication.", requirements: "The platform should integrate video conferencing, document collaboration, and task management into a single interface. It must support real-time messaging and file sharing, provide secure video meeting rooms, and allow for seamless document editing and commenting. The task management system should allow for creating, assigning, and tracking project tasks with deadlines. The platform must be mobile-friendly, provide user authentication and role-based access controls, and integrate with third-party services like Google Drive and Trello for enhanced functionality.", url: "https://www.cloudways.com/blog/wp-content/uploads/Remote-Team-Collaboration.jpg",submitter_id: 4, is_approved: true, is_accepted: false, accepted_by_id: 1, is_completed: false, bounty_payout: 500, github_url: 'https://github.com/', coders_needed: 5, program_languages: 'Ruby', date_created: knex.fn.now(), end_date: '2025-07-04',
      last_updated:  knex.fn.now()
    }
  ]);
};
