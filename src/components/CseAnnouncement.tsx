// "use client";

// import { motion, AnimatePresence } from "framer-motion";
// import { useState, useEffect } from "react";

// export function CseAnnouncement() {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     // Show after a short delay to feel like a pop-up
//     const timer = setTimeout(() => setIsVisible(true), 1500);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <AnimatePresence>
//       {isVisible && (
//         <motion.div
//           initial={{ x: "100%", opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           exit={{ x: "100%", opacity: 0 }}
//           transition={{ type: "spring", damping: 25, stiffness: 200 }}
//           className="fixed bottom-6 right-6 z-50 w-full max-w-sm"
//         >
//           <div className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-indigo-950/90 via-slate-900/95 to-black p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(34,211,238,0.2)] backdrop-blur-xl">
//             {/* Animated accent line */}
//             <motion.div
//               animate={{
//                 background: ["linear-gradient(90deg, #22d3ee, #818cf8)", "linear-gradient(90deg, #818cf8, #22d3ee)"]
//               }}
//               transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
//               className="absolute top-0 left-0 h-1 w-full"
//             />

//             <button
//               onClick={() => setIsVisible(false)}
//               className="absolute top-3 right-3 text-white/40 transition hover:text-white"
//             >
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                 <line x1="18" y1="6" x2="6" y2="18"></line>
//                 <line x1="6" y1="6" x2="18" y2="18"></line>
//               </svg>
//             </button>

//             <div className="flex flex-col gap-3">
//               <div className="flex items-center gap-2">
//                 <span className="flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
//                 <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">CSE Department Notice</span>
//               </div>

//               <div>
//                 <h3 className="text-lg font-bold text-white">Exit Exam Model</h3>
//                 <p className="mt-1 text-sm text-blue-100/70">
//                   Reminder for <span className="text-cyan-300 font-semibold">CSE Department</span> students: Today's Exit Model Exam is scheduled for <span className="text-white font-bold">2:00 PM – 5:00 PM</span>.
//                 </p>
//               </div>

//               <div className="mt-2 flex items-center justify-between">
//                 {/* <div className="flex -space-x-2">
//                   {[1, 2, 3].map((i) => (
//                     <div key={i} className="h-6 w-6 rounded-full border-2 border-slate-900 bg-gradient-to-br from-cyan-500 to-indigo-500" />
//                   ))}
//                   <div className="flex h-6 items-center justify-center rounded-full bg-slate-800 px-2 text-[10px] text-white/60">
//                     +42
//                   </div>
//                 </div> */}
//                 <a
//                   href="https://t.me/student_Union1/2186"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="rounded-lg bg-cyan-500 px-4 py-1.5 text-xs font-bold text-black transition hover:bg-cyan-400 active:scale-95"
//                 >
//                   Today Session
//                 </a>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }
