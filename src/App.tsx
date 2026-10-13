import React, { useState } from 'react';
import { WorkoutProvider, useWorkout } from './context/WorkoutContext';
import { Navbar } from './components/Navbar';
import { HomeTab } from './components/HomeTab';
import { WorkoutsTab } from './components/WorkoutsTab';
import { StandardModelTab } from './components/StandardModelTab';
import { EvolutionTab } from './components/EvolutionTab';
import { TutorialsTab } from './components/TutorialsTab';
import { RestTimerFloating } from './components/RestTimerFloating';
import { RestTimerModal } from './components/RestTimerModal';
import { ProfileAndBackupModal } from './components/ProfileAndBackupModal';
import { ReplicateModal } from './components/ReplicateModal';
import { TutorialDetailModal } from './components/TutorialDetailModal';
import { ExerciseTutorial } from './types/workout';

function MainApp() {
  const { activeTab, tutorials } = useWorkout();

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isReplicateModalOpen, setIsReplicateModalOpen] = useState(false);
  const [replicateYear, setReplicateYear] = useState<number>(2026);
  const [replicateMonth, setReplicateMonth] = useState<number>(6);

  // Quick tutorial pop-up
  const [quickTutorial, setQuickTutorial] = useState<ExerciseTutorial | null>(null);

  // Desktop view toggle: expanded desktop layout or mobile container
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  const handleOpenReplicate = (year: number = 2026, monthIdx: number = 6) => {
    setReplicateYear(year);
    setReplicateMonth(monthIdx);
    setIsReplicateModalOpen(true);
  };

  const handleOpenTutorialByName = (exerciseName: string) => {
    const targetNorm = exerciseName.trim().toLowerCase();
    const found = tutorials.find(t => t.name.trim().toLowerCase() === targetNorm);
    if (found) {
      setQuickTutorial(found);
    } else {
      // Create temporary view object with default guidelines
      setQuickTutorial({
        id: 'temp-tut',
        name: exerciseName,
        muscleGroup: 'Geral',
        executionNotes: `Exercício cadastrado na sua rotina. Concentre-se na cadência, postura e amplitude completa do movimento.`,
        createdAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-slate-100 antialiased font-sans flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenTimerModal={() => setIsTimerModalOpen(true)}
        isMobilePreview={isMobilePreview}
        setIsMobilePreview={setIsMobilePreview}
      />

      {/* Main Container */}
      <main className="flex-1 w-full flex justify-center">
        <div
          className={`w-full px-3 sm:px-4 pt-4 transition-all ${
            isMobilePreview
              ? 'max-w-md border-x border-[#1a1d26] min-h-[calc(100vh-64px)] shadow-2xl bg-[#0e1015]'
              : 'max-w-4xl'
          }`}
        >
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'workouts' && (
            <WorkoutsTab
              onOpenReplicateModal={handleOpenReplicate}
              onOpenTutorialByName={handleOpenTutorialByName}
            />
          )}
          {activeTab === 'template' && (
            <StandardModelTab
              onOpenReplicateModal={() => handleOpenReplicate(2026, 6)}
              onOpenTutorialByName={handleOpenTutorialByName}
            />
          )}
          {activeTab === 'evolution' && <EvolutionTab />}
          {activeTab === 'tutorials' && <TutorialsTab />}
        </div>
      </main>

      {/* Floating Rest Timer Component (Accessible everywhere) */}
      <RestTimerFloating />

      {/* Modals */}
      <ProfileAndBackupModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <RestTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
      />

      <ReplicateModal
        isOpen={isReplicateModalOpen}
        onClose={() => setIsReplicateModalOpen(false)}
        initialYear={replicateYear}
        initialMonthIndex={replicateMonth}
      />

      {quickTutorial && (
        <TutorialDetailModal
          isOpen={!!quickTutorial}
          onClose={() => setQuickTutorial(null)}
          tutorial={quickTutorial}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <WorkoutProvider>
      <MainApp />
    </WorkoutProvider>
  );
}
