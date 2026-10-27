import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useAnimationControls, useInView, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, AtSign, BadgeCheck, BookOpen, CalendarDays, Check, Clock3, Code2, DollarSign, GraduationCap, Laptop, Mail, Menu, MessageCircle, PenTool, Phone, Play, Search, Send, Sparkles, Star, TrendingUp, Users, X, Globe2, ChevronDown, CircleHelp } from 'lucide-react';
import { BrowserRouter, Link as RouterLink, useLocation, useRoutes } from 'react-router-dom';
import { courses, crisisCourseLessons, photoshopCourseLessons, financeCourseLessons, angularCourseLessons, operationsCourseLessons, imageUrl } from './data.js';

const Arrow = ({ className = '' }) => <ArrowUpRight aria-hidden="true" className={`inline size-4 ${className}`} strokeWidth={2.2} />;
const EASE = [0.22, 1, 0.36, 1];
const hoverTransition = { type: 'spring', stiffness: 180, damping: 24, mass: .8 };
const courseCardTransition = { y: { duration: .38, ease: EASE }, layout: { duration: .32, ease: EASE } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: .6, ease: EASE } } };
const cardVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: .62, ease: EASE } } };
const slideIn = { hidden: { opacity: 0, x: 14 }, show: { opacity: 1, x: 0, transition: { duration: .58, ease: EASE } } };
const staggerParent = (staggerChildren = .08, delayChildren = .05) => ({ hidden: {}, show: { transition: { staggerChildren, delayChildren } } });
const hoverLift = { y: -4, transition: hoverTransition };
const hoverButton = { y: -1, scale: 1.01, transition: hoverTransition };
const tapButton = { scale: .985, transition: { duration: .16, ease: EASE } };
const MotionLink = motion.create(RouterLink);

function AppLink({ href, children, ...props }) {
  if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
    return <RouterLink to={href} {...props}>{children}</RouterLink>;
  }
  return <a href={href} {...props}>{children}</a>;
}

function ButtonLink({ href, children, className = '', ...props }) {
  return <MotionLink to={href} whileHover={hoverButton} whileTap={tapButton} className={className} {...props}>{children}</MotionLink>;
}

function Reveal({ children, className = '', delay = 0, y = 28, x = 0, once = true, amount = 0.08, duration = .68, as: Tag = 'div', ...rest }) {
  const reduceMotion = useReducedMotion();
  const Component = motion[Tag] || motion.div;
  return <Component {...rest} className={className} initial={{ opacity: 0, y: reduceMotion ? 0 : y, x: reduceMotion ? 0 : x }} whileInView={{ opacity: 1, y: 0, x: 0 }} viewport={{ once, amount, margin: '0px 0px -6% 0px' }} transition={{ duration: reduceMotion ? .38 : duration, delay, ease: EASE }}>{children}</Component>;
}

function Stagger({ children, className = '', amount = 0.08, once = true, stagger = .1, delayChildren = .04, as: Tag = 'div', ...rest }) {
  const reduceMotion = useReducedMotion();
  const Component = motion[Tag] || motion.div;
  const variants = reduceMotion
    ? { hidden: {}, show: { transition: { staggerChildren: .04, delayChildren: 0 } } }
    : staggerParent(stagger, delayChildren);
  return <Component {...rest} className={className} variants={variants} initial="hidden" whileInView="show" viewport={{ once, amount, margin: '0px 0px -6% 0px' }}>{children}</Component>;
}

function StaggerItem({ children, className = '', variants = cardVariants, as: Tag = 'div', ...rest }) {
  const Component = motion[Tag] || motion.div;
  return <Component {...rest} className={className} variants={variants}>{children}</Component>;
}

function RollingDigit({ digit, delay, play }) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (!play) return;
    controls.start({
      y: `-${20 + digit * 2}%`,
      transition: { duration: 1.6, delay, ease: [.16, 1, .3, 1] },
    });
  }, [controls, digit, delay, play]);

  return <span aria-hidden="true" className="inline-block h-[1em] overflow-hidden align-top tabular-nums">
    <motion.span initial={{ y: '-58%' }} animate={controls} className="flex flex-col leading-none">
      {Array.from({ length: 50 }, (_, reelIndex) => <span key={reelIndex} className="block h-[1em] shrink-0">{reelIndex % 10}</span>)}
    </motion.span>
  </span>;
}

function RollingNumber({ value, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: .08 });
  return <MotionConfig reducedMotion="never"><span ref={ref} className="inline-flex align-top" aria-label={value}>
    {String(value).split('').map((character, index) => /\d/.test(character)
      ? <RollingDigit key={`${index}-${character}`} digit={Number(character)} delay={delay + index * .08} play={isInView} />
      : <span key={`${index}-${character}`} aria-hidden="true">{character}</span>)}
  </span></MotionConfig>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [['Home', '/'], ['Courses', '/courses'], ['About', '/about'], ['Blog', '/blog'], ['Pricing', '/pricing'], ['Contact', '/contact']];
  const current = useLocation().pathname.replace(/\/$/, '') || '/';
  const homeHeader = current === '/';
  const isActive = (href) => current === href || (href !== '/' && current.startsWith(href));
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);
  return <motion.header initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .5, ease: 'easeOut' }} className={`z-40 border-b border-white/10 text-white ${homeHeader ? 'absolute inset-x-0 top-0 bg-transparent' : 'relative bg-[#10292b]'}`}>
    <div className="container-page flex h-[78px] items-center justify-between">
      <AppLink href="/" aria-label="Elearn home" className="inline-flex shrink-0 items-center"><img src="/elearn-logo.png" alt="Elearn" className="h-9 w-auto object-contain" /></AppLink>
      <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
        {links.map(([label, href]) => <MotionLink key={label} to={href} whileHover={{ y: -1 }} transition={hoverTransition} className={`relative text-sm font-semibold transition hover:text-brand ${isActive(href) ? 'text-brand' : 'text-white/90'}`}>{label}{isActive(href) && <motion.span layoutId="nav-active" transition={{ type: 'spring', stiffness: 240, damping: 30 }} className="absolute inset-x-0 -bottom-2 mx-auto h-0.5 w-4 rounded-full bg-accent" />}</MotionLink>)}
      </nav>
      <div className="hidden items-center gap-4 md:flex"><AppLink href="/pricing" className="text-xs font-semibold text-white/85 transition hover:text-accent">Log in</AppLink><ButtonLink href="/courses" className="inline-flex min-h-11 items-center gap-4 rounded-md bg-accent px-4 text-xs font-bold text-[#142e30] transition hover:bg-[#efa900]">Get started <Arrow /></ButtonLink></div>
      <motion.button whileTap={{ scale: .92 }} onClick={() => setOpen(value => !value)} className="grid h-10 w-10 place-items-center rounded-md border border-white/20 md:hidden" aria-label="Toggle navigation" aria-expanded={open} aria-controls="mobile-menu">
        <AnimatePresence mode="wait" initial={false}>{open ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: .18 }}><X size={19}/></motion.span> : <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: .18 }}><Menu size={19}/></motion.span>}</AnimatePresence>
      </motion.button>
    </div>
    <AnimatePresence>
      {open && <motion.div id="mobile-menu" key="mobile-menu" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .32, ease: EASE }} className="absolute inset-x-0 top-full z-40 overflow-hidden border-b border-white/10 bg-[#10292b]/95 shadow-2xl backdrop-blur-md md:hidden">
        <motion.nav initial="hidden" animate="show" exit="exit" variants={{ hidden: {}, show: { transition: { staggerChildren: .055, delayChildren: .08 } }, exit: { transition: { staggerChildren: .03, staggerDirection: -1 } } }} className="container-page flex flex-col gap-1 py-4" aria-label="Mobile navigation">
          {links.map(([label, href]) => <motion.div key={label} variants={{ hidden: { opacity: 0, x: -18 }, show: { opacity: 1, x: 0, transition: { duration: .3, ease: EASE } }, exit: { opacity: 0, x: -12, transition: { duration: .16 } } }}><MotionLink to={href} onClick={() => setOpen(false)} className={`flex items-center justify-between rounded-md px-3 py-3 text-sm font-semibold transition ${isActive(href) ? 'bg-white/10 text-brand' : 'text-white/90 hover:bg-white/5'}`}>{label}<ArrowUpRight size={14} className={isActive(href) ? 'text-accent' : 'text-white/30'} /></MotionLink></motion.div>)}
        </motion.nav>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: .16, duration: .25 }} className="container-page flex items-center gap-4 border-t border-white/10 py-4">
          <AppLink href="/pricing" onClick={() => setOpen(false)} className="text-xs font-semibold text-white/85 transition hover:text-accent">Log in</AppLink>
          <ButtonLink href="/courses" onClick={() => setOpen(false)} className="inline-flex min-h-11 flex-1 items-center justify-center gap-3 rounded-md bg-accent px-4 text-xs font-bold text-[#142e30]">Get started <Arrow /></ButtonLink>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </motion.header>;
}

function Footer() {
  return <Reveal as="footer" className="bg-[#20212c] text-white">
    <Stagger className="container-page grid gap-10 py-12 md:grid-cols-[1.15fr_2fr] md:py-16" amount={.1} stagger={.12}>
      <StaggerItem><AppLink href="/" aria-label="Elearn home" className="inline-flex items-center"><img src="/elearn-logo.png" alt="Elearn" className="h-9 w-auto object-contain" /></AppLink><p className="mt-4 max-w-52 text-sm leading-6 text-white/60">Learn today. Make tomorrow yours.</p><div className="mt-5 flex gap-2">{[[Globe2,'Community'],[AtSign,'Email'],[MessageCircle,'Messages']].map(([Icon,label])=><motion.a key={label} whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: .97 }} transition={hoverTransition} className="grid size-8 place-items-center rounded-full border border-white/20 text-white/70 transition hover:bg-white/10 hover:text-white" aria-label={label} href="#"><Icon size={14}/></motion.a>)}</div></StaggerItem>
      <StaggerItem className="grid grid-cols-2 gap-8 sm:grid-cols-3">
        <div><h3 className="text-sm font-bold">Quick links</h3><AppLink className="footer-link" href="/">Home</AppLink><AppLink className="footer-link" href="/about">About</AppLink><AppLink className="footer-link" href="/blog">Blog</AppLink><AppLink className="footer-link" href="/pricing">Pricing</AppLink><AppLink className="footer-link" href="/contact">Contact</AppLink></div>
        <div><h3 className="text-sm font-bold">Popular courses</h3><AppLink className="footer-link" href="/courses">Finance</AppLink><AppLink className="footer-link" href="/courses">Design</AppLink><AppLink className="footer-link" href="/courses">Web development</AppLink></div>
        <div><h3 className="text-sm font-bold">Get in touch</h3><AppLink className="footer-link" href="mailto:hello@elearna.com">hello@elearna.com</AppLink><AppLink className="footer-link" href="tel:+18881234567">(888) 123-4567</AppLink></div>
      </StaggerItem>
    </Stagger>
    <div className="border-t border-white/10"><div className="container-page flex flex-col gap-2 py-4 text-[11px] text-white/50 sm:flex-row sm:justify-between"><span>© 2026 Elearna Learning Co.</span><span>Made for lifelong learners.</span></div></div>
  </Reveal>;
}

function CourseCard({ course }) {
  const freeCourseRoutes = {
    'Crisis management and problem-solving strategies': '/courses/crisis-management-and-problem-solving-strategies/curriculum',
    'Advanced Photoshop techniques for designers': '/courses/advanced-photoshop-techniques-for-designers/curriculum',
    'Understanding corporate finance and investments': '/courses/understanding-corporate-finance-and-investments/curriculum',
    'Building single page applications with Angular': '/courses/building-single-page-applications-with-angular/curriculum',
    'Operations management and process improvement': '/courses/operations-management-and-process-improvement/curriculum',
  };
  const courseHref = course.price === 'Free' ? freeCourseRoutes[course.title] || '/contact' : '/contact';
  return <motion.article layout variants={cardVariants} exit={{ opacity: 0, transition: { duration: .2, ease: EASE } }} whileHover={{ y: -3 }} transition={courseCardTransition} className="course-card group overflow-hidden rounded-lg border border-[#e9e9e4] bg-white shadow-[0_3px_12px_#25243a06] hover:shadow-[0_12px_30px_#25243a12]">
    <AppLink className="relative block h-[190px] overflow-hidden bg-[#e7e7e2]" href={courseHref} aria-label={`Learn about ${course.title}`}><img className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" src={imageUrl(course.image, 800)} alt="" loading="lazy"/><span className="absolute left-3 top-3 rounded bg-white px-2.5 py-1 text-[10px] font-bold text-brand">{course.category}</span></AppLink>
    <div className="p-4"><div className="flex items-center justify-between text-[10px] text-muted"><span className="inline-flex items-center gap-1"><Star size={12} fill="currentColor" className="text-[#d39724]"/><b className="text-ink">{course.rating}</b> ({course.reviews})</span><span className="inline-flex items-center gap-1"><BookOpen size={12}/>{course.lessons} lessons</span></div><AppLink href={courseHref}><h3 className="mt-2 min-h-11 font-display text-[14px] font-bold leading-5 tracking-[-.3px] text-ink">{course.title}</h3></AppLink><div className="mt-4 flex items-center justify-between border-t border-line pt-3"><span className="text-sm font-bold text-brand">{course.price}</span><span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted"><Users size={12}/>{course.enrolled}</span><AppLink href={courseHref} className="inline-flex items-center text-[11px] font-bold text-ink">Details <Arrow className="ml-1 text-brand"/></AppLink></div></div>
  </motion.article>;
}

const freeCourseDetails = {
  crisis: {
    title: 'Crisis management and problem-solving strategies', lessons: crisisCourseLessons,
    overview: 'Build a practical foundation for recognizing challenging situations, preparing for uncertainty, and choosing thoughtful ways to respond. Move through the lessons at your own pace and use the videos to guide your learning.',
    outcomes: ['Recognize common crisis situations and their impact.', 'Explore preparation and response strategies.', 'Practice structured problem-solving and negotiation concepts.'],
  },
  photoshop: {
    title: 'Advanced Photoshop techniques for designers', lessons: photoshopCourseLessons,
    overview: 'Explore advanced Photoshop workflows for creating, refining, and preparing visual designs. The lesson videos provide a paced path through techniques designers can apply to their own projects.',
    outcomes: ['Explore efficient image editing workflows.', 'Practice refining visual compositions.', 'Build confidence applying Photoshop techniques to design work.'],
  },
  finance: {
    title: 'Understanding corporate finance and investments', lessons: financeCourseLessons,
    overview: 'Get introduced to core ideas behind corporate finance and investment decisions. The course lessons are organized to help you work through financial concepts one step at a time.',
    outcomes: ['Review foundational corporate finance concepts.', 'Explore how businesses assess financial decisions.', 'Build familiarity with investment principles and terminology.'],
  },
  angular: {
    title: 'Building single page applications with Angular', lessons: angularCourseLessons,
    overview: 'Follow a video based introduction to building single page applications with Angular. Work through the lessons in sequence to learn the concepts and development workflow behind an Angular application.',
    outcomes: ['Understand the structure of an Angular application.', 'Explore the building blocks used in single page apps.', 'Follow a sequence for developing an application interface.'],
  },
  operations: {
    title: 'Operations management and process improvement', lessons: operationsCourseLessons,
    overview: 'Explore how operations management helps organizations improve processes and coordinate day to day work. The curriculum is ready for lesson videos to be added.',
    outcomes: ['Understand core operations management concepts.', 'Explore process improvement approaches.', 'Consider how teams can make workflows more effective.'],
  },
};

function CourseCurriculumPage({ title, lessons, overview, outcomes }) {
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const activeLesson = lessons[activeLessonIndex];
  const activeLessonTitle = activeLesson.title || `Lesson ${activeLessonIndex + 1}`;
  const course = courses.find(item => item.title === title);
  return <main className="bg-[#f3f4f0] pb-12 md:pb-16">
    <section className="relative isolate overflow-hidden bg-[#10292b] text-white">
      <img aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover" src={imageUrl(course?.image || 'photo-1454165804606-c3d57bc86b40', 1600)} alt="" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0c2022]/90 via-[#10292b]/75 to-[#10292b]/45" />
      <Reveal className="container-page py-12 md:py-20"><AppLink href="/courses" className="text-xs font-bold text-white/85 transition hover:text-accent">← All courses</AppLink><span className="eyebrow mt-7 block !text-white/80">{course?.category || 'FREE COURSE'} · CURRICULUM</span><h1 className="font-display mt-4 max-w-4xl text-[clamp(2.25rem,5.4vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-.055em] text-white">{title}</h1><p className="mt-5 max-w-2xl text-sm leading-6 text-white/75">Review the course overview or choose a lesson from the curriculum.</p></Reveal>
    </section>
    <Reveal className="container-page relative z-10 -mt-7 md:-mt-10" delay={.1} amount={.05}>
      <div className="grid gap-4 rounded-lg bg-white p-5 shadow-[0_12px_38px_#122d3012] sm:grid-cols-3 sm:p-6">
        <div className="flex items-center gap-3 border-line sm:border-r"><span className="inline-flex items-center gap-0.5 text-accent">{Array.from({length:5},(_,i)=><Star key={i} size={14} fill="currentColor"/>)}</span><span className="text-xs font-semibold text-ink">{course?.rating || 'Free'} {course?.reviews ? `(${course.reviews} reviews)` : 'course'}</span></div>
        <div className="flex items-center gap-3 text-sm text-ink sm:justify-center sm:border-r"><BookOpen size={18} className="text-brand"/><span><b>{lessons.length}</b> lessons</span></div>
        <div className="flex items-center gap-3 text-sm text-ink sm:justify-center"><Users size={18} className="text-brand"/><span>{course?.enrolled || 'Self-paced'}{course?.enrolled ? ' learners' : ''}</span></div>
      </div>
    </Reveal>
    <div className="container-page pt-8 md:pt-10">
    <div className="mb-8 flex max-w-xl rounded-md bg-[#e5e9e5] p-1" role="tablist" aria-label="Course information">
      {[['overview', 'Overview'], ['curriculum', 'Curriculum']].map(([tab, label]) => <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className={`min-h-11 flex-1 rounded px-4 text-sm font-semibold transition ${activeTab === tab ? 'bg-[#10292b] text-white' : 'text-ink hover:bg-white/70'}`}>{label}</button>)}
    </div>
    {activeTab === 'overview' ? <Reveal as="section" role="tabpanel" className="grid gap-8 rounded-lg border border-line bg-white p-6 md:grid-cols-[1.2fr_.8fr] md:p-9">
      <div><span className="eyebrow">COURSE OVERVIEW</span><h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink">About this course</h2><p className="mt-4 text-sm leading-7 text-muted">{overview}</p><motion.button type="button" onClick={() => setActiveTab('curriculum')} whileHover={{ y: -1, scale: 1.01 }} whileTap={{ scale: .97 }} className="button-primary mt-6">Start learning <Play size={15} fill="currentColor"/></motion.button></div>
      <div className="rounded-md bg-[#f5f7f5] p-5"><h3 className="font-display text-base font-bold text-ink">What you’ll explore</h3><ul className="mt-4 space-y-3">{outcomes.map(item => <li key={item} className="flex gap-3 text-sm leading-6 text-muted"><Check size={16} className="mt-1 shrink-0 text-brand"/>{item}</li>)}</ul><p className="mt-5 border-t border-line pt-4 text-xs font-semibold text-ink">{lessons.length} lessons · Learn at your own pace</p></div>
    </Reveal> : <Reveal as="div" role="tabpanel" className="grid gap-8 rounded-lg bg-[#e9ece8] p-4 shadow-[0_8px_26px_#122d3008] md:grid-cols-[270px_minmax(0,1fr)] md:p-6 lg:gap-12">
      <nav aria-label="Course lessons" className="flex flex-col gap-2">
        {lessons.map((lesson, index) => <button key={`${title}-${index}`} type="button" onClick={() => setActiveLessonIndex(index)} aria-current={activeLessonIndex === index ? 'step' : undefined} className={`rounded-md px-5 py-4 text-left text-sm font-semibold transition ${activeLessonIndex === index ? 'bg-[#10292b] text-white' : 'bg-[#eef4f5] text-ink hover:bg-[#e4eeee]'}`}><span className="block">Lesson {index + 1}</span>{lesson.title && <span className={`mt-1 block text-xs leading-5 ${activeLessonIndex === index ? 'text-white/70' : 'text-muted'}`}>{lesson.title}</span>}</button>)}
      </nav>
      <section aria-live="polite" className="min-w-0">
        <div className="mb-6"><span className="eyebrow">LESSON {activeLessonIndex + 1}</span><h2 className="mt-2 font-display text-2xl font-bold leading-tight tracking-[-.035em] text-ink md:text-3xl">{activeLessonTitle}</h2></div>
        {activeLesson.videoId ? <div className="aspect-video w-full overflow-hidden rounded-md bg-black shadow-sm"><iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${activeLesson.videoId}?rel=0`} title={`Lesson ${activeLessonIndex + 1}: ${activeLessonTitle}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div> : <div className="grid aspect-video place-items-center rounded-md bg-[#eef4f5] px-6 text-center"><div><span className="mx-auto grid size-12 place-items-center rounded-full bg-white text-brand"><Play size={20} fill="currentColor"/></span><h3 className="mt-4 font-display text-lg font-bold text-ink">Video coming soon</h3><p className="mt-2 text-sm text-muted">This lesson is part of the curriculum. Its video link hasn’t been added yet.</p></div></div>}
      </section>
    </Reveal>}
    </div>
  </main>;
}

function SectionTitle({ kicker, title, action }) {
  return <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="eyebrow">{kicker}</span><h2 className="heading-lg mt-3">{title}</h2></div>{action}</div>;
}

function Home() {
  const featured = [courses[0], courses[1], courses[2], courses[3], courses[4], courses[5]];
  const categories = [
    [PenTool, 'Creative web design', '8 Courses', 'bg-[#f4e9f3]'], [DollarSign, 'Finance accounting', '10 Courses', 'bg-[#f9eddf]'], [Code2, 'IT and software', '5 Courses', 'bg-[#e6edf7]'], [TrendingUp, 'Digital marketing', '4 Courses', 'bg-[#eef2df]'], [Laptop, 'Web development', '8 Courses', 'bg-[#e4f0e8]'], [BookOpen, 'Content writing', '3 Courses', 'bg-[#f7e7e0]'],
  ];
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const slowTextY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 55]), { stiffness: 75, damping: 22, mass: .8 });
  const fastTextY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const contentFade = useTransform(scrollYProgress, [0, .85], [1, .3]);
  return <>
    <main>
      <section ref={heroRef} className="relative isolate min-h-[780px] overflow-hidden bg-[#10292b] text-white md:min-h-[850px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-[.12]" style={{backgroundImage:'radial-gradient(#9bb2a8 0.65px, transparent 0.65px)',backgroundSize:'8px 8px'}} />
        <motion.div aria-hidden="true" initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }} animate={{ opacity: .16, scale: 1 }} transition={{ duration: 1.1, ease: EASE, delay: .1 }} style={reduceMotion ? undefined : { y: slowTextY }} className="pointer-events-none absolute inset-x-0 top-[25%] z-0 w-full px-4 text-center font-display text-[clamp(3rem,14vw,14rem)] font-black leading-[.82] tracking-[-.085em] text-white">PERSONAL</motion.div>
        <motion.div aria-hidden="true" initial={reduceMotion ? false : { opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, ease: EASE, delay: .25 }} style={reduceMotion ? undefined : { y: fastTextY }} className="pointer-events-none absolute inset-x-0 top-[57%] z-20 w-full px-2 text-center font-display text-[clamp(3rem,15vw,15rem)] font-black leading-[.72] tracking-[-.09em] text-accent">COACH</motion.div>
        <motion.div style={reduceMotion ? undefined : { y: imageY }} className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center pb-[60px] md:pb-[30px]">
          <motion.img initial={reduceMotion ? false : { opacity: 0, y: 46, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, ease: EASE, delay: .1 }} className="h-[66%] w-[min(92%,720px)] object-contain object-bottom md:h-[83%] md:w-[min(66%,800px)]" src="https://cdn.prod.website-files.com/668cb7adec02e140422345de/66d6b65afa48c134cb3e9ab1_Home%20Three%20Hero%20Man%20Image.webp" alt="Elearna personal coach" fetchPriority="high" />
        </motion.div>
        <div className="container-page relative z-30 flex min-h-[780px] flex-col justify-end pb-7 pt-32 md:min-h-[850px] md:pb-8">
          <motion.div initial={reduceMotion ? false : 'hidden'} animate="show" variants={staggerParent(.1, .35)} style={reduceMotion ? undefined : { opacity: contentFade }} className="relative z-30 flex flex-col items-start justify-between gap-5 border-t border-white/15 bg-[#10292b]/80 py-5 backdrop-blur-sm sm:flex-row sm:items-end md:py-6">
            <div className="max-w-[520px]">
              <motion.span variants={fadeUp} className="eyebrow !text-white/80">ONLINE LEARNING</motion.span>
              <motion.h1 variants={staggerParent(.075, 0)} className="font-display mt-2 text-[clamp(1.7rem,3.4vw,3rem)] font-extrabold leading-[1.02] tracking-[-.05em] text-white"><motion.span variants={fadeUp} className="inline-block">Digital</motion.span>{' '}<motion.span variants={fadeUp} className="inline-block">learning</motion.span>{' '}<motion.span variants={fadeUp} className="inline-block text-accent">empowerment&nbsp;hub</motion.span></motion.h1>
            </div>
            <motion.div variants={fadeUp} className="flex shrink-0 flex-wrap items-center gap-3">
              <p className="max-w-[250px] text-xs leading-5 text-white/70">Explore expert-led courses and build skills for what comes next.</p>
              <ButtonLink className="button-primary" href="/courses">Explore courses <Arrow /></ButtonLink>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Reveal as="section" className="border-y border-line bg-white/70 py-7"><div className="container-page flex flex-col items-center justify-between gap-5 md:flex-row"><p className="shrink-0 text-center text-[10px] font-bold uppercase tracking-[.14em] text-muted md:text-left">Learn from 350+ leading universities<br className="hidden md:block"/> and companies with us</p><div className="logo-marquee w-full md:w-[66%]" role="group" aria-label="Learning partners"><div className="logo-marquee-track"><div className="logo-marquee-group">{['coursera','udemy','skillshare','edX','FutureLearn'].map((name,index)=><span key={name} className={index%2?'font-display':''}>{name}</span>)}</div><div className="logo-marquee-group" aria-hidden="true">{['coursera','udemy','skillshare','edX','FutureLearn'].map((name,index)=><span key={name} className={index%2?'font-display':''}>{name}</span>)}</div></div></div></div></Reveal>

      <Reveal as="section" className="container-page section-space"><SectionTitle kicker="TOP CATEGORIES" title="Discover leading categories to elevate your journey" action={<MotionLink whileHover={{ x: 2 }} transition={hoverTransition} className="inline-flex items-center text-sm font-bold text-brand" to="/courses">Explore all <Arrow className="ml-1"/></MotionLink>}/><Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" amount={.12} stagger={.07}>{categories.map(([Icon, title, count, bg]) => <MotionLink key={title} to={`/courses?category=${encodeURIComponent(title.includes('Finance') ? 'Finance' : title.toLowerCase().includes('design') ? 'Design' : title.toLowerCase().includes('development') || title.includes('software') ? 'Development' : 'Management')}`} variants={cardVariants} whileHover={{ y: -4, scale: 1.012 }} transition={hoverTransition} whileTap={{ scale: .99 }} className={`${bg} group flex min-h-[154px] flex-col justify-between rounded-lg p-4`}><span className="grid h-10 w-10 place-items-center rounded-full bg-white/80 text-brand transition-transform duration-500 ease-out group-hover:rotate-3 group-hover:scale-110"><Icon size={19} strokeWidth={1.8}/></span><span><b className="block font-display text-[12px] leading-4">{title}</b><small className="mt-1 block text-[10px] text-muted">{count}</small></span></MotionLink>)}</Stagger></Reveal>

      <Reveal as="section" className="bg-[#eef1ff] py-12"><div className="container-page grid items-center gap-7 md:grid-cols-[1fr_1.2fr]"><div><span className="eyebrow">QUICK ACCESS TO POPULAR COURSES</span><h2 className="heading-lg mt-3">Develop your skills online!</h2><p className="mt-3 max-w-sm text-sm leading-6 text-muted">Find your next step among practical courses built to help you grow at every stage.</p><ButtonLink className="button-primary mt-5" href="/courses">View Courses <Arrow /></ButtonLink></div><div className="relative h-[220px] overflow-hidden rounded-lg md:h-[270px]"><motion.img whileHover={{ scale: 1.04 }} transition={{ duration: .6, ease: EASE }} className="h-full w-full object-cover" src={imageUrl('photo-1523240795612-9a054b0db644', 1000)} alt="Learner using a laptop"/><div className="absolute inset-0 bg-gradient-to-r from-[#191a2e99] to-transparent"/><p className="absolute bottom-5 left-5 max-w-[210px] font-display text-2xl font-bold leading-8 text-white">Your next skill is closer than you think.</p></div></div></Reveal>

      <Reveal as="section" className="container-page section-space"><SectionTitle kicker="ONLINE LEARNING" title="Top online courses" action={<div className="flex gap-2"><MotionLink whileHover={{ y: -2 }} whileTap={{ scale: .96 }} className="rounded-full bg-brand px-4 py-2 text-xs font-bold text-white" to="/courses">All courses</MotionLink><MotionLink whileHover={{ y: -2 }} whileTap={{ scale: .96 }} className="rounded-full border border-line px-4 py-2 text-xs font-semibold" to="/courses?category=Design">Design</MotionLink><MotionLink whileHover={{ y: -2 }} whileTap={{ scale: .96 }} className="rounded-full border border-line px-4 py-2 text-xs font-semibold" to="/courses?category=Development">Development</MotionLink></div>}/><Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={.08} stagger={.09}>{featured.map((course) => <CourseCard key={course.title} course={course}/>)}</Stagger><div className="mt-8 text-center"><ButtonLink className="button-outline" href="/courses">Browse all courses <Arrow /></ButtonLink></div></Reveal>

      <Reveal as="section" className="bg-[#f5f4f0] py-14"><div className="container-page grid items-center gap-9 md:grid-cols-2"><div className="relative mx-auto h-[330px] w-full max-w-[470px]"><div className="h-full w-full overflow-hidden rounded-[46%_46%_10px_10px]"><motion.img whileHover={{ scale: 1.04 }} transition={{ duration: .6, ease: EASE }} className="h-full w-full object-cover" src={imageUrl('photo-1531482615713-2afd69097998', 900)} alt="Learners working together"/></div><motion.span initial={{ opacity: 0, y: 14, scale: .94 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ delay: .25, duration: .45, ease: EASE }} className="absolute -bottom-3 right-4 rounded-md bg-white px-4 py-3 text-xs font-bold shadow">150+ online courses</motion.span></div><div><span className="eyebrow">WHAT WE OFFER</span><h2 className="heading-lg mt-3">Personalized learning for your ambitions</h2><p className="mt-4 text-sm leading-7 text-muted">Build skills that matter to you with a learning experience designed to meet you where you are and help you get where you want to go.</p><Stagger className="mt-5 grid grid-cols-2 gap-3 text-xs font-semibold" amount={.3} stagger={.06}>{['✓ Skill-based instruction','✓ Analytics and insights','✓ Global certification','✓ Customizable courses'].map(item => <StaggerItem key={item} variants={fadeUp}>{item}</StaggerItem>)}</Stagger><MotionLink whileHover={{ x: 2 }} transition={hoverTransition} className="mt-6 inline-flex text-sm font-bold text-brand" to="/about">Learn about Elearna <Arrow className="ml-2"/></MotionLink></div></div></Reveal>

      <Reveal as="section" className="container-page section-space"><div className="mb-8 text-center"><span className="eyebrow">OUR TESTIMONIALS</span><h2 className="heading-lg mt-3">Trusted by our successful students</h2></div><Stagger className="grid gap-4 md:grid-cols-2" amount={.15} stagger={.14}>{[['I could learn at my own pace and immediately put new skills to work. Elearna made my next career step feel achievable.','Linda Grady','Co-assistant manager','bg-[#e5c1b2]','LG'],['Clear lessons, thoughtful instructors, and projects I could add to my portfolio. Learning has become part of my week.','Jim Adams','Designer','bg-[#bfd6c4]','JA']].map(([quote,name,role,color,initials])=><motion.blockquote key={name} variants={cardVariants} whileHover={{ y: -3 }} transition={hoverTransition} className="rounded-lg bg-white p-7 shadow-[0_8px_28px_#22223a0a]"><motion.div variants={staggerParent(.04, .15)} className="flex gap-1 text-[#e7b441]">{Array.from({length:5},(_,index)=><motion.span key={index} variants={fadeUp}><Star size={14} fill="currentColor"/></motion.span>)}</motion.div><p className="mt-4 font-display text-lg font-semibold leading-7">“{quote}”</p><footer className="mt-5 flex items-center gap-3"><span className={`avatar ${color}`}>{initials}</span><span className="text-xs"><b className="block">{name}</b><span className="text-muted">{role}</span></span></footer></motion.blockquote>)}</Stagger></Reveal>

      <Reveal as="section" className="bg-[#eef1ff] py-14"><div className="container-page grid items-center gap-8 md:grid-cols-[1fr_1fr]"><div><span className="eyebrow">WHY WE ARE</span><h2 className="heading-lg mt-3">Elevate your professional journey</h2><p className="mt-4 max-w-md text-sm leading-7 text-muted">Whether you want to explore, change direction, or advance your career, we make learning approachable and useful.</p><Stagger className="mt-6 grid grid-cols-2 gap-5" amount={.25} stagger={.08}>{[[Sparkles,'Learn anything'],[DollarSign,'Save money'],[TrendingUp,'Flexible courses'],[BadgeCheck,'Earn certificates']].map(([Icon, title])=><StaggerItem key={title} variants={fadeUp} whileHover={{ x: 2 }} transition={hoverTransition} className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white text-brand"><Icon size={17}/></span><span><b className="text-sm">{title}</b><small className="mt-1 block text-xs leading-5 text-muted">Build confidence one lesson at a time.</small></span></StaggerItem>)}</Stagger></div><div className="h-[320px] overflow-hidden rounded-lg"><motion.img whileHover={{ scale: 1.04 }} transition={{ duration: .6, ease: EASE }} className="h-full w-full object-cover" src={imageUrl('photo-1521737711867-e3b97375f902', 950)} alt="People learning and collaborating"/></div></div></Reveal>

      <Reveal as="section" className="container-page flex flex-col items-start justify-between gap-5 py-14 sm:flex-row sm:items-center"><div><span className="eyebrow">ARE YOU READY TO START YOUR JOURNEY?</span><h2 className="heading-lg mt-3">Make your next move.</h2><p className="mt-2 text-sm text-muted">Find the course that helps you take it.</p></div><ButtonLink className="button-primary" href="/courses">Browse courses <Arrow /></ButtonLink></Reveal>
    </main>
  </>;
}

function About() {
  return <main>
    <Reveal as="section" className="bg-[#10292b] px-5 pb-10 pt-14 text-center text-white md:pb-14 md:pt-20"><div className="container-page"><span className="eyebrow !text-white/90">ABOUT ELEARN(A)</span><h1 className="heading-xl mx-auto mt-4 max-w-3xl !text-white">You’re sincerely determined to <span className="text-accent">grow.</span></h1><motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{duration:.7,delay:.1}} className="relative mt-9 h-[260px] overflow-hidden rounded-lg sm:h-[380px]"><img className="h-full w-full object-cover" src={imageUrl('photo-1521737711867-e3b97375f902', 1500)} alt="Elearna community collaborating"/><span className="absolute bottom-4 right-4 rounded-lg bg-white px-4 py-3 text-left text-xs font-bold text-ink shadow">People first.<br/>Possibilities always.</span></motion.div></div></Reveal>
    <Reveal as="section" className="container-page grid gap-8 py-16 md:grid-cols-2 md:gap-20 md:py-24"><div><span className="eyebrow">OUR STORY</span><h2 className="heading-lg mt-3">Limitless learning and more possibilities.</h2></div><div><p className="text-[17px] leading-8">We believe a good education gives people more choices. Elearna makes quality online learning flexible, practical, and open to everyone who is ready to grow.</p><p className="mt-4 text-sm leading-7 text-muted">Our courses bring together expert instructors, hands-on lessons, and a supportive community. Wherever you’re starting from, we’re here to help you take a confident next step.</p></div></Reveal>
    <Reveal as="section" className="bg-[#e7eee9] py-12 md:py-14"><Stagger className="container-page grid grid-cols-2 gap-y-8 text-center md:grid-cols-4 md:gap-y-0" amount={.2} stagger={.1}>{[['75K+','Learners joined'],['150+','Online courses'],['40+','Countries reached'],['4.9/5','Learner rating']].map(([n,t], index)=><StaggerItem key={t} variants={fadeUp} whileHover={{ y: -2 }} transition={hoverTransition} className="relative px-3 md:px-5"><b className="font-display text-4xl font-extrabold tracking-tight text-[#10292b] md:text-5xl"><RollingNumber value={n} delay={index * .1}/></b><span className="mt-2 block text-[11px] font-bold uppercase tracking-[.08em] text-[#10292b] md:text-xs">{t}</span>{index < 3 && <span aria-hidden="true" className="absolute right-0 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-[#10292b]/20 md:block"/>}</StaggerItem>)}</Stagger></Reveal>
    <Reveal as="section" className="container-page grid items-center gap-8 py-16 md:grid-cols-2 md:gap-16 md:py-24"><div className="h-[330px] overflow-hidden rounded-lg"><motion.img whileHover={{ scale: 1.04 }} transition={{ duration: .6, ease: EASE }} className="h-full w-full object-cover" src={imageUrl('photo-1531482615713-2afd69097998', 950)} alt="A group sharing ideas in a workshop"/></div><div><span className="eyebrow">WHY WE ARE</span><h2 className="heading-lg mt-3">Learning that works in real life.</h2><p className="mt-4 text-sm leading-7 text-muted">Education should fit around your life and help with the things that matter to you. That’s why our courses are built to turn fresh ideas into useful skills.</p><Stagger className="mt-5 space-y-4" amount={.2} stagger={.09}>{[['01','Flexibility and convenience'],['02','Course accessibility'],['03','Cost-effectiveness'],['04','Personalized learning']].map(([n,t])=><StaggerItem key={n} variants={slideIn} whileHover={{ x: 2 }} transition={hoverTransition} className="flex gap-4 border-t border-line pt-3"><b className="text-xs text-brand">{n}</b><span className="text-sm font-bold">{t}</span></StaggerItem>)}</Stagger></div></Reveal>
    <Reveal as="section" className="container-page mb-16 flex flex-col items-start justify-between gap-5 rounded-lg bg-[#eef1ff] p-8 sm:flex-row sm:items-center md:p-12"><div><span className="eyebrow">KEEP GROWING</span><h2 className="heading-lg mt-2">Your next chapter starts here.</h2></div><ButtonLink href="/courses" className="button-primary">Explore courses <Arrow /></ButtonLink></Reveal>
  </main>;
}

function CoursesPage() {
  const { search } = useLocation();
  const [category, setCategory] = useState(new URLSearchParams(search).get('category') || 'All');
  useEffect(() => setCategory(new URLSearchParams(search).get('category') || 'All'), [search]);
  const [query, setQuery] = useState('');
  const categories = ['All', 'Design', 'Development', 'Management', 'Finance'];
  const filtered = useMemo(() => courses.filter(course => (category === 'All' || course.category === category) && `${course.title} ${course.category}`.toLowerCase().includes(query.toLowerCase())), [category, query]);
  return <main>
    <Reveal as="section" className="bg-[#10292b] py-14 text-center text-white md:py-20"><div className="container-page"><span className="eyebrow !text-white/90">START WITH WHAT INTERESTS YOU</span><h1 className="heading-xl mt-4 !text-white">Professional online <span className="text-accent">courses.</span></h1><p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/70">Browse practical lessons, expert instructors, and new skills for your next step.</p><label className="mx-auto mt-7 flex h-12 max-w-lg items-center gap-3 rounded-md border border-white/10 bg-white px-4 text-muted transition focus-within:border-brand focus-within:shadow-[0_0_0_4px_#ffb70333]"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} className="w-full bg-transparent text-left text-xs text-ink outline-none" placeholder="Search all courses" aria-label="Search courses"/><kbd className="hidden rounded bg-[#f3f3f5] px-2 py-1 text-[9px] sm:inline">⌘ K</kbd></label></div></Reveal>
    <Reveal as="section" className="container-page py-12 md:py-16"><div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div className="flex flex-wrap gap-2">{categories.map((item,index)=><motion.button key={item} onClick={()=>setCategory(item)} whileHover={{y:-2}} whileTap={{scale:.95}} className={`rounded-full px-4 py-2 text-xs font-bold transition ${category===item?'bg-brand text-white shadow-[0_5px_16px_#5d43d533]':'border border-line bg-white text-muted hover:border-brand/40 hover:text-brand'}`}>{item}</motion.button>)}</div><span className="text-xs text-muted">{filtered.length} courses</span></div><Stagger layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={.05} stagger={.07}><AnimatePresence mode="popLayout">{filtered.map(course=><CourseCard key={course.title} course={course}/>)}</AnimatePresence></Stagger><AnimatePresence>{filtered.length===0&&<motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.25}} className="py-16 text-center text-sm text-muted">No courses match your search. Try another term.</motion.p>}</AnimatePresence></Reveal>
    <Reveal as="section" className="bg-[#eef1ff] py-10"><div className="container-page flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><span className="eyebrow">NEED A HAND?</span><h2 className="mt-2 font-display text-2xl font-bold">We’ll help you find the right fit.</h2></div><ButtonLink href="/contact" className="button-primary">Contact us <Arrow /></ButtonLink></div></Reveal>
  </main>;
}

function Contact() {
  const [sent, setSent] = useState(false);
  return <main>
    <Reveal as="section" className="bg-[#10292b] px-5 py-14 text-white md:py-20"><div className="container-page grid items-center gap-5 md:grid-cols-[1.1fr_.9fr]"><div><span className="eyebrow !text-white/90">CONTACT US</span><h1 className="heading-xl mt-4 !text-white">Are you interested in online learning? <span className="text-accent">Contact us.</span></h1><p className="mt-4 max-w-lg text-sm leading-7 text-white/70">Get details about our courses or ask us anything. We’re happy to help you find the right place to start.</p><div className="mt-6 flex items-center gap-3"><span className="avatar bg-[#ead7cd]">EB</span><p className="text-xs"><b className="block">Elearna Support</b><span className="text-white/60">Learner success team</span></p></div></div><motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="relative mx-auto grid h-[210px] w-full place-items-center"><span className="grid h-40 w-40 rotate-12 place-items-center rounded-full bg-lime text-accent"><Mail size={58} strokeWidth={1.4}/></span><span className="absolute bottom-2 right-3 rounded-lg bg-white p-4 text-xs font-bold text-ink shadow">A real person will get back to you.</span></motion.div></div></Reveal>
    <Reveal as="section" className="container-page grid gap-9 border-t border-line py-12 md:grid-cols-[.85fr_1.15fr] md:gap-16 md:py-16"><aside><span className="eyebrow">CONTACT DETAILS</span><h2 className="heading-lg mt-3">We’re here to help.</h2><p className="mt-3 text-sm leading-6 text-muted">Send a message and our learner support team will get back to you within one business day.</p><Stagger className="mt-7 space-y-5" amount={.2} stagger={.09}><StaggerItem variants={slideIn} whileHover={{ x: 2 }}><AppLink className="contact-item" href="tel:+18881234567"><span><Phone size={17}/></span><span><small>CALL US</small><b>(888) 123-4567</b></span></AppLink></StaggerItem><StaggerItem variants={slideIn} whileHover={{ x: 2 }}><AppLink className="contact-item" href="mailto:info@elearna.com"><span><Mail size={17}/></span><span><small>EMAIL US</small><b>info@elearna.com</b></span></AppLink></StaggerItem><StaggerItem variants={slideIn} whileHover={{ x: 2 }}><div className="contact-item"><span><Clock3 size={17}/></span><span><small>OPENING HOURS</small><b>Monday–Friday, 9am–5pm</b></span></div></StaggerItem></Stagger></aside>
      <form className="rounded-lg border border-line bg-white p-5 sm:p-8" onSubmit={e=>{e.preventDefault();setSent(true);e.currentTarget.reset();}}><span className="eyebrow">GET IN TOUCH WITH US</span><h2 className="mt-2 font-display text-2xl font-bold">Fill out for contact</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="form-label">Your name<input required name="name" placeholder="Your name"/></label><label className="form-label">Your email<input required type="email" name="email" placeholder="name@example.com"/></label></div><label className="form-label mt-4 block">Subject<input required name="subject" placeholder="How can we help?"/></label><label className="form-label mt-4 block">Your message<textarea required rows="5" name="message" placeholder="Write your message here..."/></label><label className="mt-4 flex items-center gap-2 text-xs text-muted"><input type="checkbox" className="accent-brand"/> Save information for the next time</label><motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: .98 }} className="button-primary mt-5 w-full justify-between" type="submit">Send message <Send size={16}/></motion.button><AnimatePresence>{sent&&<motion.p initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="mt-3 text-xs font-semibold text-brand" aria-live="polite">Thanks for your note. This form is ready to connect to your inbox.</motion.p>}</AnimatePresence></form>
    </Reveal>
  </main>;
}

const blogPosts = [
  { category: 'Career', title: 'Improve knowledge retention with visual learning', date: 'October 4, 2024', author: 'Nina Leffler', image: 'photo-1501504905252-473c47e087f8', excerpt: 'Small visual cues can make lessons clearer, more memorable, and easier to put into practice.' },
  { category: 'Development', title: 'Master online learning with proven strategies', date: 'October 4, 2024', author: 'Samantha Dicki', image: 'photo-1516321318423-f06f85e504b3', excerpt: 'Build a learning rhythm that keeps you curious and moving forward, even on a busy week.' },
  { category: 'Teaching', title: 'How to enhance your learning experience today', date: 'October 3, 2024', author: 'Edwin Waters', image: 'photo-1524178232363-1fb2b075b655', excerpt: 'A few practical changes can turn a good study session into a genuinely useful one.' },
  { category: 'Career', title: 'The evolution of teaching tools in the 21st century', date: 'September 17, 2024', author: 'Edward Braun', image: 'photo-1509062522246-3755977927d7', excerpt: 'Technology keeps opening new ways for instructors to bring ideas to life.' },
  { category: 'Development', title: 'The role of parental involvement in academic achievement', date: 'September 16, 2024', author: 'Jesse Johnson', image: 'photo-1503676260728-1c00da094a0b', excerpt: 'Encouragement and a supportive routine help learners build confidence over time.' },
  { category: 'Teaching', title: 'The role of technology in modern classrooms', date: 'September 14, 2024', author: 'Samantha Dicki', image: 'photo-1584697964358-3e14ca57658b', excerpt: 'Digital tools can make learning more flexible, collaborative, and responsive.' },
  { category: 'Career', title: 'How globalization is shaping curriculum development', date: 'September 13, 2024', author: 'Edwin Waters', image: 'photo-1523580494863-6f3031224c94', excerpt: 'A connected world calls for a broader view of the skills learners need.' },
  { category: 'Development', title: 'How personalized learning is changing education', date: 'September 12, 2024', author: 'Gerald Nienow', image: 'photo-1509062522246-3755977927d7', excerpt: 'Flexible paths help learners focus on the goals that matter to them.' },
  { category: 'Teaching', title: 'Empowering teachers with continuous development', date: 'September 11, 2024', author: 'Nina Leffler', image: 'photo-1524178232363-1fb2b075b655', excerpt: 'Great teaching grows through practice, feedback, and space to keep learning.' },
];

function BlogCard({ post, featured = false }) {
  return <motion.article layout variants={cardVariants} exit={{ opacity: 0, scale: .985, transition: { duration: .24, ease: EASE } }} whileHover={{ y: -4, scale: 1.004 }} transition={hoverTransition} className={`blog-card group overflow-hidden rounded-lg border border-line bg-white ${featured?'grid md:grid-cols-2':''}`}>
    <AppLink className={`block overflow-hidden bg-[#e8ece8] ${featured?'min-h-[260px] md:min-h-[360px]':'h-[190px]'}`} href="/blog" aria-label={post.title}><motion.img whileHover={{scale:1.05}} transition={{duration:.7,ease:EASE}} className="h-full w-full object-cover" src={imageUrl(post.image, featured?1100:800)} alt="" loading="lazy"/></AppLink>
    <div className={`flex flex-col ${featured?'justify-center p-6 md:p-9':'p-4'}`}><span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#a87500]"><span className="rounded-full bg-[#fff4d5] px-2.5 py-1 text-[#976800]">{post.category}</span><span className="inline-flex items-center gap-1 text-muted"><CalendarDays size={12}/>{post.date}</span></span><h2 className={`mt-3 font-display font-bold leading-snug tracking-[-.035em] text-ink ${featured?'text-2xl md:text-3xl':'text-[15px]'}`}><AppLink href="/blog" className="transition group-hover:text-[#976800]">{post.title}</AppLink></h2><p className={`mt-3 text-sm leading-6 text-muted ${featured?'max-w-lg':'line-clamp-2'}`}>{post.excerpt}</p><div className="mt-5 flex items-center justify-between border-t border-line pt-3 text-[10px] text-muted"><span>By <b className="text-ink">{post.author}</b></span><AppLink href="/blog" className="inline-flex items-center gap-1 font-bold text-ink">Read article <Arrow/></AppLink></div></div>
  </motion.article>;
}

function BlogPage() {
  const [category, setCategory] = useState('All');
  const categories = ['All','Career','Development','Teaching'];
  const posts = category === 'All' ? blogPosts.slice(1) : blogPosts.filter((post,index) => post.category === category && index !== 0);
  return <main>
    <Reveal as="section" className="relative isolate overflow-hidden bg-[#10292b] py-14 text-center text-white md:py-20"><div aria-hidden className="absolute -right-12 -top-24 size-64 rounded-full border-[48px] border-blue/50"/><div aria-hidden className="absolute bottom-8 left-[12%] size-3 rounded-full bg-accent"/><div className="container-page relative"><span className="eyebrow !text-white/90">NEWS AND JOURNALS</span><h1 className="heading-xl mx-auto mt-4 max-w-3xl !text-white">Ideas for your <span className="text-accent">next chapter.</span></h1><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70">Fresh perspectives on learning, teaching, and building the skills that take you forward.</p></div></Reveal>
    <Reveal as="section" className="container-page py-12 md:py-16"><Stagger amount={.05}><BlogCard post={blogPosts[0]} featured/></Stagger><div className="mt-14 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><span className="eyebrow">THE ELEARN(A) JOURNAL</span><h2 className="heading-lg mt-2">Explore the latest</h2></div><div className="flex flex-wrap gap-2">{categories.map(item=><motion.button key={item} whileHover={{y:-2}} whileTap={{scale:.96}} onClick={()=>setCategory(item)} className={`rounded-full px-4 py-2 text-xs font-bold transition ${category===item?'bg-blue text-white':'border border-line bg-white text-muted hover:border-blue/40 hover:text-blue'}`}>{item}</motion.button>)}</div></div><Stagger layout className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={.05} stagger={.07}><AnimatePresence mode="popLayout">{posts.map(post=><BlogCard key={post.title} post={post}/>)}</AnimatePresence></Stagger></Reveal>
    <Reveal as="section" className="bg-[#eef1ff] py-12"><div className="container-page flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><span className="eyebrow">KEEP YOUR CURIOSITY CLOSE</span><h2 className="mt-2 font-display text-2xl font-bold">Find a new idea to learn today.</h2></div><ButtonLink href="/courses" className="button-primary">Explore courses <Arrow/></ButtonLink></div></Reveal>
  </main>;
}

const pricingPlans = [
  { name:'Basic', description:'A focused start for curious learners.', monthly:199, yearly:139, courses:'10+ top courses', features:['Certification prep','Customizable content','AI-powered coding exercises'] },
  { name:'Standard', description:'More room to build momentum.', monthly:299, yearly:279, courses:'30+ top courses', features:['Certification prep','Customizable content','AI-powered coding exercises','Analytics and progress reports'], popular:true },
  { name:'Premium', description:'A complete toolkit for ambitious goals.', monthly:699, yearly:659, courses:'50+ top courses', features:['Certification prep','Customizable content','AI-powered coding exercises','Analytics and progress reports','Instructor Q&A'] },
];
const planFeatures = ['Access to top courses','Certification prep','Customizable content','AI-powered coding exercises','Analytics and progress reports','24/7 learner support','Instructor Q&A'];
const planFaqs = [
  ['How do I enroll in an online course?','Choose a plan, then browse the course library and enroll in any course included with your membership.'],
  ['Can I change or cancel my plan?','Yes. You can change your plan or cancel your renewal at any time from your account settings.'],
  ['Do courses include certificates?','Many courses include a certificate of completion. Each course page lists its included learning materials.'],
  ['Can I learn at my own pace?','Absolutely. Courses are online and on demand, so you can learn whenever it fits your schedule.'],
];

function PricingPage() {
  const [yearly,setYearly] = useState(false);
  return <main>
    <Reveal as="section" className="relative isolate overflow-hidden bg-[#10292b] py-14 text-center text-white md:py-20"><div aria-hidden className="absolute -left-14 -top-20 size-56 rounded-full border-[42px] border-blue/50"/><div className="container-page relative"><span className="eyebrow !text-white/90">PRICING</span><h1 className="heading-xl mt-4 !text-white">Flexible plans for <span className="text-accent">every learner.</span></h1><p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/70">Choose a learning plan that meets you where you are, and grow from there.</p><div className="mx-auto mt-7 inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1"><motion.button whileHover={{scale:1.04}} whileTap={{scale:.96}} onClick={()=>setYearly(false)} className={`rounded-full px-5 py-2 text-xs font-bold transition ${!yearly?'bg-white text-ink':'text-white/70'}`}>Monthly</motion.button><motion.button whileHover={{scale:1.04}} whileTap={{scale:.96}} onClick={()=>setYearly(true)} className={`rounded-full px-5 py-2 text-xs font-bold transition ${yearly?'bg-white text-ink':'text-white/70'}`}>Yearly <span className="ml-1 text-[#b8dc69]">Save 20%</span></motion.button></div></div></Reveal>
    <Reveal as="section" className="container-page py-12 md:py-16"><Stagger className="grid gap-4 lg:grid-cols-3" amount={.1} stagger={.1}>{pricingPlans.map((plan)=><motion.article key={plan.name} layout variants={cardVariants} whileHover={{ y: -4 }} transition={hoverTransition} className={`relative rounded-lg border bg-white p-6 ${plan.popular?'border-brand shadow-[0_18px_48px_#ffb70324]':'border-line'}`}>{plan.popular&&<span className="absolute -top-3 right-5 rounded-full bg-accent px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider text-ink">Most popular</span>}<div className="flex items-start justify-between"><div><span className="grid size-10 place-items-center rounded-lg bg-[#fff4d5] text-[#996b00]"><GraduationCap size={20}/></span><h2 className="mt-4 font-display text-xl font-bold">{plan.name}</h2></div>{plan.popular&&<Sparkles size={19} className="text-brand"/>}</div><p className="mt-2 min-h-10 text-xs leading-5 text-muted">{plan.description}</p><div className="mt-5 flex items-baseline gap-2"><strong className="font-display text-4xl font-extrabold tracking-[-.06em]">${yearly?plan.yearly:plan.monthly}</strong><span className="text-xs text-muted">/ month</span></div><p className="mt-1 text-[10px] text-muted">{yearly?'Billed annually':'Billed monthly'}</p><div className="my-5 h-px bg-line"/><ul className="space-y-3 text-xs">{[plan.courses,...plan.features].map(feature=><li key={feature} className="flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full bg-[#eef4dc] text-[#638026]"><Check size={12}/></span>{feature}</li>)}</ul><MotionLink to={`/contact?plan=${encodeURIComponent(plan.name)}`} whileHover={{ y: -1 }} whileTap={{ scale: .985 }} transition={hoverTransition} className={`mt-7 flex min-h-11 w-full items-center justify-center gap-2 rounded-md text-xs font-bold transition ${plan.popular?'bg-brand text-ink hover:bg-brand-dark':'border border-line hover:border-brand'}`}>Choose {plan.name} <Arrow/></MotionLink></motion.article>)}</Stagger></Reveal>
    <Reveal as="section" className="bg-[#f4f5f0] py-14"><div className="container-page"><div className="mb-7 text-center"><span className="eyebrow">CLEAR OPTIONS</span><h2 className="heading-lg mt-2">Compare plans</h2></div><div className="overflow-x-auto rounded-lg border border-line bg-white"><table className="w-full min-w-[650px] border-collapse text-left text-xs"><thead><tr className="border-b border-line"><th className="p-4 font-bold">What’s included</th>{pricingPlans.map(plan=><th className="p-4 text-center font-bold" key={plan.name}>{plan.name}</th>)}</tr></thead><tbody>{planFeatures.map((feature,i)=><motion.tr initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{once:true}} whileHover={{ backgroundColor: '#fffdf4' }} transition={{delay:i*.04}} className="border-b border-line last:border-0" key={feature}><td className="p-4 text-muted">{feature}</td>{pricingPlans.map((plan,j)=><td key={plan.name} className="p-4 text-center">{i===0||i<3||j>0&&i<5||j===2?<Check size={16} className="mx-auto text-[#66922e]"/>:<span className="text-[#c4c6c0">—</span>}</td>)}</motion.tr>)}</tbody></table></div></div></Reveal>
    <Reveal as="section" className="container-page grid gap-8 py-14 md:grid-cols-[.7fr_1.3fr] md:py-20"><div><span className="eyebrow">CONTACT US</span><h2 className="heading-lg mt-3">Frequently asked questions</h2><p className="mt-3 text-sm leading-6 text-muted">Need more detail before choosing? Here are a few quick answers.</p><MotionLink to="/contact" whileHover={{ x: 2 }} className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#996b00]">Ask us anything <Arrow/></MotionLink></div><div className="divide-y divide-line">{planFaqs.map(([question,answer],index)=><motion.details key={question} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.07}} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-sm font-bold"><span>{question}</span><ChevronDown size={17} className="shrink-0 text-[#996b00] transition group-open:rotate-180"/></summary><p className="max-w-2xl pt-3 text-xs leading-6 text-muted">{answer}</p></motion.details>)}</div></Reveal>
    <Reveal as="section" className="bg-[#eef1ff] py-11"><div className="container-page flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><span className="eyebrow">READY WHEN YOU ARE</span><h2 className="mt-2 font-display text-2xl font-bold">Start learning something new.</h2></div><ButtonLink href="/courses" className="button-primary">Browse courses <Arrow/></ButtonLink></div></Reveal>
  </main>;
}

function RoutedApp() {
  const location = useLocation();
  const page = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/about/*', element: <About /> },
    { path: '/contact/*', element: <Contact /> },
    { path: '/courses/crisis-management-and-problem-solving-strategies/curriculum', element: <CourseCurriculumPage {...freeCourseDetails.crisis} /> },
    { path: '/courses/advanced-photoshop-techniques-for-designers/curriculum', element: <CourseCurriculumPage {...freeCourseDetails.photoshop} /> },
    { path: '/courses/understanding-corporate-finance-and-investments/curriculum', element: <CourseCurriculumPage {...freeCourseDetails.finance} /> },
    { path: '/courses/building-single-page-applications-with-angular/curriculum', element: <CourseCurriculumPage {...freeCourseDetails.angular} /> },
    { path: '/courses/operations-management-and-process-improvement/curriculum', element: <CourseCurriculumPage {...freeCourseDetails.operations} /> },
    { path: '/courses/*', element: <CoursesPage /> },
    { path: '/blog/*', element: <BlogPage /> },
    { path: '/pricing/*', element: <PricingPage /> },
    { path: '*', element: <Home /> },
  ]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [location.pathname]);
  return <MotionConfig reducedMotion="user" transition={hoverTransition}><Header /><AnimatePresence mode="wait"><motion.div key={`${location.pathname}${location.search}`} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} transition={{duration:.22,ease:'easeOut'}}>{page}</motion.div></AnimatePresence><Footer /></MotionConfig>;
}

export default function App() {
  return <BrowserRouter><RoutedApp /></BrowserRouter>;
}
