'use client';

import { useState } from 'react';
import TimeLogs from './my-data/time-logs';
import Timesheets from './my-data/timesheets';
import Jobs from './my-data/jobs';
import Projects from './my-data/projects';
import JobSchedule from './my-data/job-schedule';
import TeamJobs from './team/jobs';
import TeamProjects from './team/projects';
import ProjectMembers from './team/project-members';

export default function TimesheetTracker() {
  const [activeSection, setActiveSection] = useState('my-data');
  const [activeTab, setActiveTab] = useState('time-logs');

  const renderMyDataTabs = () => (
    <div className="flex gap-8 px-6 border-b">
      <button
        className={`py-4 ${activeTab === 'time-logs' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
        onClick={() => setActiveTab('time-logs')}
      >
        Time Logs
      </button>
      <button
        className={`py-4 ${activeTab === 'timesheets' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
        onClick={() => setActiveTab('timesheets')}
      >
        Timesheets
      </button>
      <button
        className={`py-4 ${activeTab === 'jobs' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
        onClick={() => setActiveTab('jobs')}
      >
        Jobs
      </button>
      <button
        className={`py-4 ${activeTab === 'projects' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
        onClick={() => setActiveTab('projects')}
      >
        Projects
      </button>
      <button
        className={`py-4 ${activeTab === 'job-schedule' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
        onClick={() => setActiveTab('job-schedule')}
      >
        Job Schedule
      </button>
    </div>
  );

  const renderTeamTabs = () => (
    <div className="flex gap-8 px-6 border-b">
      <button
        className={`py-4 ${activeTab === 'project-members' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
        onClick={() => setActiveTab('project-members')}
      >
        Project Members
      </button>
      <button
        className={`py-4 ${activeTab === 'team-jobs' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
        onClick={() => setActiveTab('team-jobs')}
      >
        Jobs
      </button>
      <button
        className={`py-4 ${activeTab === 'team-projects' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
        onClick={() => setActiveTab('team-projects')}
      >
        Projects
      </button>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'time-logs':
        return <TimeLogs />;
      case 'timesheets':
        return <Timesheets />;
      case 'jobs':
        return <Jobs />;
      case 'projects':
        return <Projects />;
      case 'job-schedule':
        return <JobSchedule />;
      case 'project-members':
        return <ProjectMembers />;
      case 'team-jobs':
        return <TeamJobs />;
      case 'team-projects':
        return <TeamProjects />;
      default:
        return <TimeLogs />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <div className="bg-[#2B3674] text-white p-4 flex justify-between items-center">
        <div className="flex gap-8">
          <button
            className={`font-medium ${activeSection === 'my-data' ? 'text-white' : 'text-gray-300'}`}
            onClick={() => {
              setActiveSection('my-data');
              setActiveTab('time-logs');
            }}
          >
            My Data
          </button>
          <button
            className={`${activeSection === 'team' ? 'text-white' : 'text-gray-300'}`}
            onClick={() => {
              setActiveSection('team');
              setActiveTab('project-members');
            }}
          >
            Team
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] rounded-full px-1.5">
              99+
            </span>
            <button className="text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Navigation Tabs */}
      {activeSection === 'my-data' ? renderMyDataTabs() : renderTeamTabs()}

      {/* Content Area */}
      {renderContent()}
    </div>
  );
}


