import React, { useState, useEffect } from 'react';
import shreveportData from '../data/shreveportIngestionQueue.json';
import dfwData from '../data/dfwIngestionQueue.json';

type QueueType = 'DFW' | 'SHREVEPORT';

export const SwarmCommandPortal: React.FC = () => {
  const [activeQueue, setActiveQueue] = useState<QueueType>('SHREVEPORT');
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const data = activeQueue === 'SHREVEPORT' ? shreveportData : dfwData;

  const executeBlitz = () => {
    setIsExecuting(true);
    setLogs(prev => [...prev, `[SYSTEM] Initiating Evolve Now Outreach Blitz on ${activeQueue} Queue...`]);
    
    // Simulate staggered execution for visual feedback
    data.forEach((prospect, idx) => {
      setTimeout(() => {
        setLogs(prev => [
          ...prev, 
          `[MANUS] Targeting: ${prospect.contractorName} (${prospect.domain})`,
          `[SHIELD] Auditing payload for ${prospect.contractorName}... PASSED.`,
          `[TIANA] Dispatching Exhaustion Protocol to ${prospect.phone}...`
        ]);
      }, (idx + 1) * 1500);
    });

    setTimeout(() => {
      setIsExecuting(false);
      setLogs(prev => [...prev, `[SYSTEM] Blitz complete. ${data.length} targets processed.`]);
    }, (data.length + 1) * 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-end border-b border-zinc-800 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter uppercase text-red-500">Ignitus Swarm Command</h1>
            <p className="text-zinc-500 text-sm mt-2">SECURE PORTAL // STATUS: ONLINE</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveQueue('SHREVEPORT')}
              className={`px-4 py-2 text-sm font-bold border transition-colors ${activeQueue === 'SHREVEPORT' ? 'border-red-500 text-red-500 bg-red-950/20' : 'border-zinc-800 text-zinc-500 hover:text-white'}`}
            >
              SHREVEPORT (5)
            </button>
            <button 
              onClick={() => setActiveQueue('DFW')}
              className={`px-4 py-2 text-sm font-bold border transition-colors ${activeQueue === 'DFW' ? 'border-red-500 text-red-500 bg-red-950/20' : 'border-zinc-800 text-zinc-500 hover:text-white'}`}
            >
              DFW (10)
            </button>
          </div>
        </header>

        {/* Matrix & Logs Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Capture Matrix */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold tracking-wide text-zinc-300">CAPTURE MATRIX: {activeQueue}</h2>
              <button 
                onClick={executeBlitz}
                disabled={isExecuting}
                className={`px-6 py-2 font-bold uppercase tracking-wider border ${isExecuting ? 'border-zinc-800 text-zinc-600 cursor-not-allowed' : 'border-red-500 bg-red-600 text-white hover:bg-red-700 hover:border-red-600'} transition-all`}
              >
                {isExecuting ? 'Executing...' : 'Execute Blitz'}
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {data.map((prospect: any) => (
                <div key={prospect.id} className="border border-zinc-800 bg-zinc-950 p-5 hover:border-zinc-700 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{prospect.contractorName}</h3>
                      <p className="text-zinc-500 text-sm">{prospect.trade} | {prospect.domain}</p>
                    </div>
                    <span className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-xs text-zinc-400">
                      {prospect.dispatchStatus}
                    </span>
                  </div>
                  
                  {activeQueue === 'SHREVEPORT' ? (
                    <div className="space-y-2 mt-4 text-sm">
                      <div className="grid grid-cols-12 gap-2">
                        <span className="col-span-2 text-zinc-500 font-semibold">INTENT</span>
                        <span className="col-span-10 text-zinc-300">{prospect.intent}</span>
                      </div>
                      <div className="grid grid-cols-12 gap-2">
                        <span className="col-span-2 text-zinc-500 font-semibold">CAPACITY</span>
                        <span className="col-span-10 text-zinc-300">{prospect.capacity}</span>
                      </div>
                      <div className="grid grid-cols-12 gap-2">
                        <span className="col-span-2 text-red-900 font-semibold">LANE</span>
                        <span className="col-span-10 text-red-400">{prospect.lane}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 mt-4 text-sm">
                      <div className="grid grid-cols-12 gap-2">
                        <span className="col-span-3 text-zinc-500 font-semibold">VULNERABILITY</span>
                        <span className="col-span-9 text-red-400">{prospect.primaryVulnerability}</span>
                      </div>
                      <div className="grid grid-cols-12 gap-2">
                        <span className="col-span-3 text-zinc-500 font-semibold">INCUMBENT</span>
                        <span className="col-span-9 text-zinc-300">{prospect.competitorIncumbent}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Terminal / Telemetry Log */}
          <div className="lg:col-span-1 flex flex-col h-full max-h-[70vh]">
            <h2 className="text-xl font-semibold tracking-wide text-zinc-300 mb-4">SWARM TELEMETRY</h2>
            <div className="flex-1 bg-black border border-zinc-800 p-4 font-mono text-xs overflow-y-auto space-y-2">
              {logs.length === 0 ? (
                <div className="text-zinc-600 animate-pulse">Waiting for directive...</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={
                    log.includes('PASSED') ? 'text-green-500' :
                    log.includes('ERROR') || log.includes('FAILED') ? 'text-red-500' :
                    log.includes('SYSTEM') ? 'text-blue-400' :
                    'text-zinc-400'
                  }>
                    <span className="text-zinc-600 mr-2">{new Date().toLocaleTimeString().split(' ')[0]}</span>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
