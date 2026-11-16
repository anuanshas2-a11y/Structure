import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ChatWidget } from '@/components/chat-widget';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { sendEnquiry } from '@/lib/api';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Instagram, Linkedin, Menu, X } from 'lucide-react';
import {
  Route,
  Switch,
  useParams,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

const img = (name: string) => `/images/${name}.jpg`;
const projectData = [
  { slug: 'courtyard-house', title: 'Courtyard House', kind: 'Modern Villa', category: 'Residential', location: 'Project site to be confirmed', year: 'Concept study', area: 'To be determined', image: 'outdoor-facade', alt: 'Modern villa with pool, timber details and landscaped garden', overview: 'A contemporary residence conceived around the quiet relationship between interior life and the garden. Deep overhangs and generous glazing create a calm, sheltered home.', concept: 'The courtyard and reflecting pool form the visual heart of the residence, drawing daylight through the living spaces while giving the home a measured sense of privacy.', approach: 'Horizontal concrete planes balance dark vertical fins and warm timber soffits. Large glazed openings connect the living areas to an outdoor terrace and planted edge.', materials: 'Board-formed concrete, charcoal metal fins, natural timber, clear glass and stone paving.', gallery: ['structure-villa', 'structure-interior', 'structure-night'] },
  { slug: 'atelier-house', title: 'Atelier House', kind: 'Contemporary Interior', category: 'Interiors', location: 'Project site to be confirmed', year: 'Concept study', area: 'To be determined', image: 'interior-design-wide', alt: 'Minimal living space in timber, stone and natural light', overview: 'An interior study focused on material restraint, natural light and an easy connection to the landscape beyond.', concept: 'A warm, composed palette lets daylight and proportion shape the experience, with considered moments of texture in timber and stone.', approach: 'Open living zones are framed by full-height glazing. Carefully placed furniture, integrated joinery and layered lighting retain a sense of calm without losing function.', materials: 'Natural limestone, walnut joinery, clear glass, textured upholstery and warm metal lighting.', gallery: ['interior-design-wide', 'structure-villa', 'structure-cafe'] },
  { slug: 'terrace-house', title: 'Terrace House', kind: 'Landscaped Residence', category: 'Landscape', location: 'Project site to be confirmed', year: 'Concept study', area: 'To be determined', image: 'terrace-house', alt: 'Low modern residence at twilight beside a reflecting pool', overview: 'A residential landscape and exterior study bringing architecture, water and planting into a single evening composition.', concept: 'A quiet sequence from garden path to pool terrace creates moments of arrival and retreat around the home.', approach: 'Low planting, subtle path lights and reflective water sit alongside simple architectural lines. The exterior is designed to read warmly after dark.', materials: 'Textured concrete, natural timber, dark metal, water and layered planting.', gallery: ['terrace-house', 'structure-villa', 'structure-resort'] },
  { slug: 'common-ground', title: 'Common Ground', kind: 'Restaurant & Cafe', category: 'Commercial', location: 'Project site to be confirmed', year: 'Concept study', area: 'To be determined', image: 'foodo-coffee', alt: 'Foodo Coffee restaurant with a covered outdoor dining terrace at dusk', overview: 'A restaurant and cafe concept that makes the threshold between dining room and terrace part of the guest experience.', concept: 'Warm timber and light spill from the interior welcome visitors, while a covered outdoor seating area extends the life of the space.', approach: 'A clear glass frontage opens toward the street; a strong vertical screen and side stair give the compact building a distinct architectural identity.', materials: 'Charcoal metal, timber slats, clear glazing, concrete and integrated landscape.', gallery: ['foodo-coffee', 'structure-facade', 'structure-interior'] },
  { slug: 'shoreline-retreat', title: 'Shoreline Retreat', kind: 'Resort', category: 'Landscape', location: 'Project site to be confirmed', year: 'Concept study', area: 'To be determined', image: 'shoreline-retreat', alt: 'Waterfront resort pavilion among tropical planting', overview: 'A resort landscape study that places low, contemporary pavilion forms within a generous waterside setting.', concept: 'Architecture follows the landscape rather than dominating it: water, planting and paths make a relaxed shared environment.', approach: 'Curved roof lines and low volumes sit close to the water. A bridge and planted edges create a measured sequence through the site.', materials: 'Pale concrete, timber, stone, glass and tropical planting.', gallery: ['shoreline-retreat', 'structure-villa', 'structure-night'] },
  { slug: 'northline', title: 'Northline', kind: 'Commercial Building', category: 'Exteriors', location: 'Project site to be confirmed', year: 'Concept study', area: 'To be determined', image: 'structure-facade', alt: 'Contemporary commercial facade with dark fins and glass', overview: 'A commercial building facade study exploring a confident, clear identity through proportion and material rhythm.', concept: 'A layered frontage offers shade and depth while retaining transparency at street level.', approach: 'Vertical fins frame broad glass surfaces and set a measured rhythm across the elevation. A sheltered entrance and planted forecourt soften the approach.', materials: 'Dark metal fins, glass, warm timber accents, concrete and restrained planting.', gallery: ['structure-facade', 'structure-cafe', 'structure-night'] },
  { slug: 'garden-house', title: 'Garden House', kind: 'Villa Design', category: 'Residential', location: 'Project site to be confirmed', year: 'Concept study', area: 'To be determined', image: 'courtyard-house', alt: 'Contemporary villa opening to a garden and swimming pool', overview: 'A villa concept shaped around an open garden, clear circulation and an intimate relationship with the pool terrace.', concept: 'Indoor and outdoor living are treated as one continuous setting, anchored by the garden and the warmth of natural materials.', approach: 'Deep overhangs shade expansive glazing. The composition balances a private arrival with long views toward the planted landscape.', materials: 'Concrete, timber, glass, stone and water.', gallery: ['structure-villa', 'structure-interior', 'structure-night'] },
  { slug: 'after-light', title: 'After Light', kind: '3D Architectural Visualization', category: '3D Visualization', location: 'Design visualization study', year: 'Concept study', area: 'Not applicable', image: 'structure-night', alt: 'Nighttime architectural visualization of a contemporary residence', overview: 'A visualization study examining the atmosphere of a contemporary residence as daylight gives way to evening.', concept: 'The render focuses on the dialogue between warm interior light, reflective water and a restrained landscape.', approach: 'Material response, carefully controlled illumination and clear composition bring architectural intent into a legible visual narrative.', materials: 'Concrete, timber, glass, water and landscape lighting.', gallery: ['structure-night', 'structure-villa', 'structure-resort'] },
];

const services = [
  { title: 'Architectural Design', description: 'Conceptualizing, planning and crafting structures that balance aesthetics, functionality and sustainability.', image: 'courtyard-house' },
  { title: 'Interior Design', description: 'Creating functional layouts and refined interior environments for homes, offices, restaurants, retail spaces and resorts.', image: 'interior-design' },
  { title: 'Exterior & Facade Design', description: 'Designing contemporary building exteriors, facades, materials and visual identities.', image: 'outdoor-facade' },
  { title: '3D Architectural Visualization', description: 'Photorealistic 3D modeling, rendering and architectural presentation.', image: 'terrace-house' },
  { title: 'Landscape Design', description: 'Creating outdoor environments with thoughtful planting, pathways, lighting, water features and spatial planning.', image: 'shoreline-retreat' },
  { title: 'ACP & Glass Cladding', description: 'Modern facade solutions using aluminium composite panels and glass.', image: 'structure-facade' },
  { title: '3D Signage', description: 'Architectural signage, 3D letters and illuminated commercial signage.', image: 'structure-cafe' },
];

const categories = ['All', 'Residential', 'Commercial', 'Interiors', 'Exteriors', 'Landscape', '3D Visualization'];

function Wordmark() {
  return <span className="wordmark" data-testid="brand-wordmark">
    <img className="wordmark-logo" src="/structure-logo.png" alt="" aria-hidden="true" />
    <span className="wordmark-copy"><span className="wordmark-main">STRUCTURE</span><span className="wordmark-tag">ARCHITECHTURAL DESIGNER</span></span>
  </span>;
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);
  const nav = [{ label: 'Home', href: '/#home' }, { label: 'About', href: '/#about' }, { label: 'Services', href: '/#services' }, { label: 'Projects', href: '/#projects' }, { label: 'Process', href: '/#process' }, { label: 'Contact', href: '/#contact' }];
  const close = () => setOpen(false);
  return <>
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`} data-testid="site-header">
      <div className="wrap header-inner">
        <a href="/#home" className="brand-link" aria-label="STRUCTURE home" data-testid="link-home"><Wordmark /></a>
        <nav className="desktop-nav" aria-label="Main navigation">{nav.map(n => <a key={n.label} href={n.href} data-testid={`nav-${n.label.toLowerCase()}`}>{n.label}</a>)}</nav>
        <button type="button" className="menu-toggle" aria-label="Open navigation menu" aria-expanded={open} onClick={() => setOpen(true)} data-testid="button-open-menu"><Menu size={19} /></button>
      </div>
    </header>
    {open && <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu" data-testid="mobile-menu">
      <a href="/#home" className="brand-link" onClick={close}><Wordmark /></a>
      <button type="button" className="mobile-close" aria-label="Close navigation menu" onClick={close} data-testid="button-close-menu"><X size={20} /></button>
      <nav aria-label="Mobile navigation">{nav.map((n, i) => <a key={n.label} href={n.href} onClick={close} style={{ animationDelay: `${i * 55}ms` }} data-testid={`mobile-nav-${n.label.toLowerCase()}`}>{n.label}</a>)}</nav>
      <div className="mobile-menu-bottom"><span>INTERIOR, EXTERIOR &amp; LANDSCAPE</span><span>77 3600 8486</span></div>
    </div>}
  </>;
}

function Home() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState('All');
  const [activeService, setActiveService] = useState(0);
  const [formFeedback, setFormFeedback] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const filteredProjects = filter === 'All' ? projectData : projectData.filter(p => p.category === filter);
  const submitInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setFormStatus('sending');
    setFormFeedback('');
    try {
      const res = await sendEnquiry({
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        phone: String(data.get('phone') ?? ''),
        project_type: String(data.get('projectType') ?? ''),
        message: String(data.get('message') ?? ''),
      });
      setFormStatus('sent');
      setFormFeedback(res.detail);
      form.reset();
    } catch {
      setFormStatus('error');
      setFormFeedback('Sorry, your enquiry could not be sent. Please call 77 3600 8486 and we will be glad to help.');
    }
  };
  const openProject = (slug: string) => { setLocation(`/projects/${slug}`); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return <div className="site-shell">
    <Header />
    <main>
      <section className="hero" id="home" aria-labelledby="hero-title" data-testid="section-hero">
        <div className="hero-media image-frame"><img className="hero-home-photo" src={img('foodo-coffee')} alt="Foodo Coffee restaurant with a covered outdoor dining terrace at dusk" /></div>
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="hero-brand" data-testid="brand-hero">
            <div className="hero-brand-copy"><span className="hero-brand-name"></span><span className="hero-brand-tag"></span></div>
          </div>
          <h1 className="hero-title" id="hero-title"><span>Designing spaces.</span><span>Building visions.</span></h1>
          <div className="hero-foot"><p className="hero-description">Architecture, interiors and visual experiences designed with precision.</p>
            <div className="hero-actions"><a className="outline-button" href="#projects" data-testid="button-explore-projects">Explore projects <ArrowRight className="button-arrow" size={16} /></a></div>
          </div>
        </div>
        <span className="hero-index">01 / STRUCTURE STUDIO</span><a className="hero-scroll" href="#intro" data-testid="link-scroll-explore">Scroll to explore <span><ArrowDown size={13} /></span></a>
      </section>
      <section className="intro" id="intro" data-testid="section-introduction">
        <div className="wrap">
          <span className="eyebrow">A design studio</span>
          <div className="intro-grid">
            <h2 className="intro-title"><span>Designing</span><span>spaces with</span><span>purpose.</span></h2>
            <div className="intro-copy"><p>STRUCTURE is an architectural design and visualization studio focused on creating functional, contemporary and visually distinctive spaces.</p><p>From architectural concepts and interiors to facades, landscapes and detailed 3D visualization, we develop design solutions that balance aesthetics, functionality and identity.</p><a className="text-link" href="#about" data-testid="link-discover-studio">Discover the studio</a></div>
          </div>
          <figure className="intro-image image-frame"><img src={img('structure-cafe')} alt="Restaurant architecture with timber, glass and outdoor seating" loading="lazy" /><figcaption className="image-caption">Architecture · Atmosphere · Experience</figcaption></figure>
        </div>
      </section>
      <section className="services" id="services" data-testid="section-services">
        <div className="wrap">
          <div className="section-head"><div><span className="eyebrow">Our capabilities</span><h2 className="section-title">What we <em>do</em></h2></div><p className="section-note">A considered approach across architecture, interiors, facades, landscapes and visualization.</p></div>
          <div className="services-layout">
            <div className="service-list">{services.map((service, i) => <button type="button" key={service.title} className={`service-row${activeService === i ? ' is-active' : ''}`} onMouseEnter={() => setActiveService(i)} onFocus={() => setActiveService(i)} onClick={() => setActiveService(i)} aria-pressed={activeService === i} data-testid={`service-${i + 1}`}>
              <span className="service-num">{String(i + 1).padStart(2, '0')}</span><span><span className="service-title">{service.title}</span><span className="service-desc">{service.description}</span></span><span className="service-arrow">↗</span>
            </button>)}</div>
            <div className="service-visual-sticky"><div className="service-visual image-frame" data-testid="service-image-reveal">{services.map((service, i) => <img key={service.title} className={activeService === i ? 'is-visible' : ''} src={img(service.image)} alt={`${service.title} visual`} loading="lazy" />)}<span className="service-image-label">{String(activeService + 1).padStart(2, '0')} / {services[activeService].title}</span></div></div>
          </div>
        </div>
      </section>
      <section className="projects" id="projects" data-testid="section-projects">
        <div className="wrap">
          <div className="projects-top"><div><span className="eyebrow">Our portfolio</span><h2 className="section-title">Selected <em>projects</em></h2></div><p className="section-note">A selection of architectural, interior and visualization studies.</p></div>
          <div className="filters" role="group" aria-label="Filter projects">{categories.map(category => <button type="button" key={category} className="filter-button" aria-pressed={filter === category} onClick={() => setFilter(category)} data-testid={`filter-${category.toLowerCase().replaceAll(' ', '-')}`}>{category}</button>)}</div>
          <div className="project-grid" aria-live="polite">{filteredProjects.map((project, i) => <article className="project-card" key={project.slug} data-testid={`project-card-${project.slug}`}>
            <button className="project-open" type="button" onClick={() => openProject(project.slug)} data-testid={`button-project-${project.slug}`} aria-label={`View ${project.title} project detail`}>
              <div className="project-image image-frame"><img src={img(project.image)} alt={project.alt} loading={i > 1 ? 'lazy' : undefined} /><span className="project-hover-label">View project <ArrowUpRight size={14} /></span></div>
              <div className="project-meta-line"><div><h3 className="project-name">{project.title}</h3><span className="project-category">{project.kind}</span></div><span className="project-place">{project.location}</span></div>
            </button></article>)}</div>
          <p className="project-count" data-testid="text-project-count">Showing {filteredProjects.length} of {projectData.length} design studies</p>
        </div>
      </section>
      <section className="about" id="about" data-testid="section-about">
        <div className="wrap">
          <div className="about-head"><div><span className="eyebrow">The studio</span><h2 className="about-title">About<br />Structure</h2></div><div className="about-copy"><p>STRUCTURE approaches architecture as a combination of form, function, material, space and experience.</p><p>The studio works across architectural design, interiors, exteriors, facades, landscapes and visualization.</p></div></div>
          <figure className="about-photo image-frame"><img src={img('structure-resort')} alt="Landscape-integrated contemporary resort beside water" loading="lazy" /><figcaption className="image-caption">Form · Function · Material · Space · Experience</figcaption></figure>
        </div>
      </section>
      <section className="philosophy" data-testid="section-philosophy"><div className="wrap">
        <div className="philosophy-head"><div><span className="eyebrow">Design philosophy</span><h2 className="section-title">Five things<br /><em>we believe.</em></h2></div><p>Design grounded in purpose, composed with care, and understood through the way a space feels.</p></div>
        <div className="principles">{[
          ['FUNCTION', 'Every space should serve a clear purpose.'], ['FORM', 'Architecture should create a strong visual identity.'], ['MATERIAL', 'Materials should complement the architecture.'], ['SPACE', 'Spaces should connect people, light and environment.'], ['EXPERIENCE', 'Good design should create an emotional experience.'],
        ].map(([title, copy], i) => <article className="principle" key={title} data-testid={`principle-${i + 1}`}><span className="principle-num">{String(i + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>
      <section className="process" id="process" data-testid="section-process"><div className="wrap">
        <div className="process-head"><div><span className="eyebrow">From first conversation to final output</span><h2 className="section-title">A clear<br /><em>process.</em></h2></div><p>Each stage brings clarity to the brief and care to the design, from understanding the site to delivering the final work.</p></div>
        <div className="process-track">{[
          ['DISCOVER', "Understand the client's requirements, site and vision."], ['CONCEPT', 'Develop the initial architectural concept.'], ['DESIGN', 'Develop architectural, interior and exterior details.'], ['VISUALIZE', 'Create detailed 3D models and realistic renders.'], ['REFINE', 'Review, improve and finalize the design.'], ['DELIVER', 'Provide final design and visualization outputs.'],
        ].map(([title, copy], i) => <article className="process-step" key={title} data-testid={`process-step-${i + 1}`}><span className="process-number">{String(i + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>
      <section className="why" data-testid="section-why"><div className="wrap why-grid">
        <div><span className="eyebrow">Our point of view</span><h2 className="why-title">Why<br />Structure?</h2></div>
        <div className="why-list">{['Design-driven', 'Functional', 'Detail-oriented', 'Visually distinctive', 'Client-focused'].map((item, i) => <div className="why-item" key={item} data-testid={`differentiator-${i + 1}`}><span>{item}</span><span>0{i + 1}</span></div>)}</div>
      </div></section>
      <section className="gallery" data-testid="section-gallery"><div className="wrap">
        <div className="gallery-head"><div><span className="eyebrow">A closer look</span><h2 className="section-title">Follow<br /><em>Structure</em></h2></div><p className="section-note">A visual collection of villas, commercial spaces, interiors, facades, landscapes and 3D studies.</p></div>
        <div className="gallery-grid">{[
          ['structure-villa', 'Garden House', 'Modern villa'], ['structure-facade', 'Northline', 'Commercial facade'], ['structure-interior', 'Atelier House', 'Interior'], ['foodo-coffee', 'Common Ground', 'Restaurant'], ['structure-resort', 'Shoreline Retreat', 'Landscape'], ['structure-night', 'After Light', 'Night visualization'],
        ].map(([image, name, label]) => { const project = projectData.find(p => p.title === name)!; return <button type="button" className="gallery-tile" key={name} onClick={() => openProject(project.slug)} aria-label={`View ${name} project`} data-testid={`gallery-${project.slug}`}><img className={project.slug === 'common-ground' ? 'common-ground-photo' : undefined} src={img(image)} alt={`${label} design study`} loading="lazy" /><span className="gallery-overlay"><span>{label}</span><span>View project →</span></span></button>; })}</div>
        <div className="gallery-social-note" data-testid="social-configuration">Instagram · Facebook · LinkedIn — links to be configured</div>
      </div></section>
      <section className="contact" id="contact" data-testid="section-contact"><div className="wrap contact-layout">
        <div><span className="eyebrow">Start a conversation</span><h2 className="contact-title">Let's create<span>something</span>extraordinary.</h2><p className="contact-intro">Have a project in mind? Let's discuss your space, ideas and vision.</p>
          <div className="contact-details"><div><span className="detail-label">Phone</span><a href="tel:7736008486" data-testid="link-phone">77 3600 8486</a><span className="detail-label" style={{ marginTop: 22 }}>Email</span><a href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=structure.archo@gmail.com" target="_blank" rel="noopener noreferrer">structure.archo@gmail.com</a></div><div><span className="detail-label">Location</span><address data-testid="text-address">Opposite of Group Offset Press,<br />Nellikkaparamba,<br />Mukkam Road</address></div></div>
        </div>
        <form className="contact-form" onSubmit={submitInquiry} data-testid="form-contact">
          <div className="form-field"><label htmlFor="full-name">Full name</label><input id="full-name" name="name" autoComplete="name" placeholder="Your name" required data-testid="input-name" /></div>
          <div className="form-field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" placeholder="Your email address" required data-testid="input-email" /></div>
          <div className="form-field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="Your phone number" data-testid="input-phone" /></div>
          <div className="form-field"><label htmlFor="project-type">Project type</label><select id="project-type" name="projectType" defaultValue="" required data-testid="select-project-type"><option value="" disabled>Select project type</option>{['Architectural Design', 'Interior Design', 'Exterior & Facade Design', 'Landscape Design', '3D Architectural Visualization', 'ACP & Glass Cladding', '3D Signage', 'Other'].map(x => <option key={x} value={x}>{x}</option>)}</select></div>
          <div className="form-field full"><label htmlFor="message">Message</label><textarea id="message" name="message" placeholder="Tell us about your space, ideas and vision." required data-testid="input-message" /></div>
          <button type="submit" className="solid-button form-submit" disabled={formStatus === 'sending'} data-testid="button-submit-inquiry">{formStatus === 'sending' ? 'Sending…' : 'Send enquiry'} <ArrowRight className="button-arrow" size={16} /></button>
          {formFeedback && <p className="form-feedback" role="status" data-testid="status-form-feedback">{formFeedback}</p>}
        </form>
      </div></section>
    </main>
    <Footer />
  </div>;
}

function Footer() {
  return <footer className="footer" data-testid="site-footer"><div className="wrap">
    <div className="footer-main"><div className="footer-brand"><a href="/#home" className="brand-link" aria-label="STRUCTURE home"><Wordmark /></a><p>Architecture, interiors and visual experiences designed with precision.</p></div>
      <div><h2 className="footer-label">Navigate</h2><nav className="footer-links" aria-label="Footer navigation">{[['Home', '#home'], ['About', '#about'], ['Services', '#services'], ['Projects', '#projects'], ['Process', '#process'], ['Contact', '#contact']].map(([n, h]) => <a href={h} key={n} data-testid={`footer-nav-${n.toLowerCase()}`}>{n}</a>)}</nav></div>
      <div><h2 className="footer-label">Contact &amp; follow</h2><div className="footer-contact"><a href="tel:7736008486" data-testid="footer-phone">77 3600 8486</a><a href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=structure.archo@gmail.com" target="_blank" rel="noopener noreferrer">structure.archo@gmail.com</a><address>Nellikkaparamba,Mukkam Road</address></div><div className="footer-social" aria-label="Social links"><a href="https://www.behance.net/ShakiD3D" target="_blank" rel="noopener noreferrer" >Portfolio</a><a href="https://www.instagram.com/stru.arch?cplk=aXE3b3RlcXBpOWU=" target="_blank" rel="noopener noreferrer"><Instagram size={18} />Instagram</a>
        <a href="https://www.linkedin.com/in/structure-interior-exterior-acp-sign-board-089902417/" target="_blank" rel="noopener noreferrer"><Linkedin size={18} />LinkedIn</a>
      </div></div>
    </div>
    <div className="footer-bottom"><span>© 2026 STRUCTURE. ALL RIGHTS RESERVED.</span><span>INTERIOR · EXTERIOR · LANDSCAPE</span></div>
  </div></footer>;
}

function ProjectDetail() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const project = projectData.find(item => item.slug === params.slug);
  useEffect(() => { window.scrollTo(0, 0); }, [params.slug]);
  if (!project) return <NotFound />;
  const next = projectData[(projectData.findIndex(item => item.slug === project.slug) + 1) % projectData.length];
  return <div className="site-shell detail-page"><Header />
    <main data-testid={`project-detail-${project.slug}`}>
      <section className="detail-hero"><div className="image-frame"><img className={project.slug === 'common-ground' ? 'common-ground-photo' : undefined} src={img(project.image)} alt={project.alt} /></div><div className="wrap detail-hero-copy">
        <a href="/#projects" className="detail-back" data-testid="link-back-projects"><ArrowLeft size={14} /> Back to projects</a><p className="hero-kicker">{project.kind}</p><h1 className="detail-title">{project.title}</h1><p className="detail-type">Design study · STRUCTURE</p>
      </div></section>
      <div className="wrap">
        <div className="detail-data">{[['Project type', project.kind], ['Location', project.location], ['Year', project.year], ['Area', project.area]].map(([label, value]) => <div key={label} data-testid={`project-meta-${label.toLowerCase().replace(' ', '-')}`}><strong>{label}</strong><span>{value}</span></div>)}</div>
        <section className="detail-story"><h2 className="detail-story-heading">Project<br />narrative</h2><div className="detail-copy"><h2>Project overview</h2><p>{project.overview}</p><h2>Design concept</h2><p>{project.concept}</p><h2>Architectural approach</h2><p>{project.approach}</p><h2>Materials</h2><p>{project.materials}</p></div></section>
        <div className="detail-gallery" aria-label={`${project.title} image gallery`}>{project.gallery.map((image, i) => <figure className={`image-frame ${i === 0 ? 'gallery-wide' : i === 1 ? 'gallery-half' : 'gallery-detail'}`} key={`${image}-${i}`}><img className={project.slug === 'common-ground' && image === 'foodo-coffee' ? 'common-ground-photo' : undefined} src={img(image)} alt={`${project.title} ${i === 0 ? 'exterior view' : i === 1 ? 'interior and material view' : 'atmosphere view'}`} loading="lazy" /></figure>)}</div>
        <button type="button" className="detail-next" onClick={() => setLocation(`/projects/${next.slug}`)} data-testid="button-next-project"><span><small>Next design study</small><strong>{next.title}</strong></span><ArrowRight size={22} /></button>
      </div>
    </main><Footer />
  </div>;
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/projects/:slug" component={ProjectDetail} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
        <ChatWidget />
        <WhatsAppButton />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
