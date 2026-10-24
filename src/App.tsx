/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  StudentProfile,
  QuizAttempt,
  Lesson,
  TopicId,
} from './types';
import { StorageService } from './services/storage';
import { DeterministicRecommendationEngine } from './services/recommendationEngine';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { QuizPage } from './components/quiz/QuizPage';
import { QuizResultsPage } from './components/quiz/QuizResultsPage';
import { LearningPathPage } from './components/learning/LearningPathPage';
import { AIAssistantPage } from './components/assistant/AIAssistantPage';
import { ProgressPage } from './components/progress/ProgressPage';
import { SettingsPage } from './components/settings/SettingsPage';
import {
  LayoutDashboard,
  CheckSquare,
  Compass,
  Sparkles,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [profile, setProfile] = useState<StudentProfile>(() => StorageService.getProfile());
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => StorageService.getQuizAttempts());
  const [lessons, setLessons] = useState<Lesson[]>(() => StorageService.getLessons());
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ml'>(
    () => StorageService.getProfile().preferredLanguage || 'en'
  );
  const [selectedQuizTopicId, setSelectedQuizTopicId] = useState<TopicId>('data-structures');
  const [latestAttempt, setLatestAttempt] = useState<QuizAttempt | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Compute recommendations and topic performances dynamically from stored attempts
  const engineOutput = useMemo(() => {
    return DeterministicRecommendationEngine.generateRecommendations(attempts);
  }, [attempts]);

  const {
    topicPerformances,
    recommendations,
    primaryRecommendation,
    overallAccuracy,
  } = engineOutput;

  // Language change handler
  const handleLanguageChange = (lang: 'en' | 'ml') => {
    setCurrentLanguage(lang);
    const updated = { ...profile, preferredLanguage: lang };
    setProfile(updated);
    StorageService.saveProfile(updated);
  };

  // Profile update handler
  const handleProfileUpdated = (updated: StudentProfile) => {
    setProfile(updated);
  };

  // Start quiz handler
  const handleStartQuiz = (topicId?: TopicId) => {
    if (topicId) {
      setSelectedQuizTopicId(topicId);
    }
    setCurrentPage('quiz');
    setMobileMenuOpen(false);
  };

  // Quiz submission completed
  const handleQuizComplete = (attempt: QuizAttempt) => {
    setLatestAttempt(attempt);
    // Reload attempts from storage to ensure state freshness
    const updatedAttempts = StorageService.getQuizAttempts();
    setAttempts(updatedAttempts);
    setCurrentPage('results');
  };

  // Open specific lesson
  const handleOpenLesson = (lessonIdOrTopicId: string) => {
    // Check if it's a topicId or lessonId
    const matchingLesson =
      lessons.find((l) => l.id === lessonIdOrTopicId) ||
      lessons.find((l) => l.topicId === lessonIdOrTopicId);

    if (matchingLesson) {
      setActiveLessonId(matchingLesson.id);
    }
    setCurrentPage('learning');
    setMobileMenuOpen(false);
  };

  // Reset data handler
  const handleResetData = (mode: 'seed' | 'clear') => {
    if (mode === 'seed') {
      StorageService.resetToSeed();
    } else {
      StorageService.clearAllAttempts();
    }
    setAttempts(StorageService.getQuizAttempts());
    setLessons(StorageService.getLessons());
    setProfile(StorageService.getProfile());
    setLatestAttempt(null);
    setCurrentPage('dashboard');
  };

  const navItemsMobile = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quiz', label: 'Diagnostic Quiz', icon: CheckSquare },
    { id: 'learning', label: 'Learning Path', icon: Compass },
    { id: 'assistant', label: 'AI Tutor', icon: Sparkles },
    { id: 'progress', label: 'Progress & Trends', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        profile={profile}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onNavigate={(page) => {
          setCurrentPage(page);
          setMobileMenuOpen(false);
        }}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
      />

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex">
          <div className="w-72 bg-slate-900 text-white p-5 flex flex-col justify-between h-full shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-sm text-slate-200">SkillBridge AI Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navItemsMobile.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
              <p className="font-bold text-slate-200">SDG 4: Quality Education</p>
              <p className="text-[11px] mt-0.5">Bilingual AI Adaptive Learning</p>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-[100vw]">
        {/* Desktop Left Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            currentPage={currentPage}
            onNavigate={(page) => setCurrentPage(page)}
            primaryRecommendation={primaryRecommendation}
            onSelectTopicForQuiz={(topicId) => {
              setSelectedQuizTopicId(topicId as TopicId);
            }}
          />
        </div>

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentPage === 'dashboard' && (
            <DashboardPage
              profile={profile}
              attempts={attempts}
              topicPerformances={topicPerformances}
              recommendations={recommendations}
              primaryRecommendation={primaryRecommendation}
              overallAccuracy={overallAccuracy}
              lessons={lessons}
              onStartQuiz={handleStartQuiz}
              onOpenLesson={handleOpenLesson}
              onNavigate={(page) => setCurrentPage(page)}
              currentLanguage={currentLanguage}
            />
          )}

          {currentPage === 'quiz' && (
            <QuizPage
              initialTopicId={selectedQuizTopicId}
              onQuizComplete={handleQuizComplete}
              currentLanguage={currentLanguage}
            />
          )}

          {currentPage === 'results' && latestAttempt && (
            <QuizResultsPage
              attempt={latestAttempt}
              topicPerformance={topicPerformances[latestAttempt.topicId]}
              onRetryQuiz={(topicId) => handleStartQuiz(topicId as TopicId)}
              onOpenLesson={handleOpenLesson}
              onGoToDashboard={() => setCurrentPage('dashboard')}
              currentLanguage={currentLanguage}
            />
          )}

          {currentPage === 'learning' && (
            <LearningPathPage
              recommendations={recommendations}
              lessons={lessons}
              onLessonsUpdated={(updated) => setLessons(updated)}
              onTakeQuizForTopic={handleStartQuiz}
              activeLessonId={activeLessonId}
              onCloseActiveLesson={() => setActiveLessonId(undefined)}
              currentLanguage={currentLanguage}
            />
          )}

          {currentPage === 'assistant' && (
            <AIAssistantPage
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
              activeTopicContext={primaryRecommendation?.topicId || 'data-structures'}
            />
          )}

          {currentPage === 'progress' && (
            <ProgressPage
              attempts={attempts}
              topicPerformances={topicPerformances}
              lessons={lessons}
              onTakeQuiz={handleStartQuiz}
              onOpenLesson={handleOpenLesson}
              currentLanguage={currentLanguage}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              profile={profile}
              onProfileUpdated={handleProfileUpdated}
              onResetData={handleResetData}
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
          )}
        </main>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
