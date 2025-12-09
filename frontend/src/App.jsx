import { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

const emptyProject = { name: "", description: "", image: "", location: "" };
const emptyClient = { name: "", designation: "", description: "", image: "" };
const emptyContact = { fullName: "", email: "", phone: "", city: "" };

function App() {
  const apiBase = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:5000",
    []
  );

  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  const [projectForm, setProjectForm] = useState(emptyProject);
  const [clientForm, setClientForm] = useState(emptyClient);
  const [contactForm, setContactForm] = useState(emptyContact);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchSection = async (endpoint, setter) => {
    try {
      const res = await fetch(`${apiBase}/api/${endpoint}`);
      const data = await res.json();
      setter(data);
    } catch (err) {
      console.error(`Failed to fetch ${endpoint}`, err);
    }
  };

  useEffect(() => {
    fetchSection("projects", setProjects);
    fetchSection("clients", setClients);
    fetchSection("contacts", setContacts);
    fetchSection("subscriptions", setSubscriptions);
  }, [apiBase]);

  const submitJson = async (path, payload, onSuccess) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${apiBase}/api/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");
      onSuccess?.(data);
      setMessage("Saved successfully");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${apiBase}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectForm),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save project");
      }
      // Refetch projects from server to ensure data is saved
      await fetchSection("projects", setProjects);
      setProjectForm(emptyProject);
      setMessage("Project saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error saving project:", err);
      setMessage(err.message || "Failed to save project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${apiBase}/api/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientForm),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save client");
      }
      // Refetch clients from server to ensure data is saved
      await fetchSection("clients", setClients);
      setClientForm(emptyClient);
      setMessage("Client saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error saving client:", err);
      setMessage(err.message || "Failed to save client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    submitJson("contacts", contactForm, (created) => {
      setContacts((prev) => [created, ...prev]);
      setContactForm(emptyContact);
    });
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    submitJson("subscriptions", { email: newsletterEmail }, (created) => {
      setSubscriptions((prev) => [created, ...prev]);
      setNewsletterEmail("");
    });
  };

  return (
    <Router>
      <nav className="topbar">
        <div className="logo-mark">
          <span className="logo-dot" />
          Real Trust
        </div>
        <div className="nav-links">
          <a href="#home" className="nav-link">
            Home
          </a>
          <a href="#services" className="nav-link">
            Services
          </a>
          <a href="#projects" className="nav-link">
            About Projects
          </a>
          <a href="#about" className="nav-link">
            Testimonials
          </a>
          <a href="#contact" className="button primary small">
            Contact
          </a>
          <Link to="/admin" className="button ghost small">
            Admin
          </Link>
        </div>
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              projects={projects}
              clients={clients}
              contacts={contacts}
              subscriptions={subscriptions}
              contactForm={contactForm}
              newsletterEmail={newsletterEmail}
              loading={loading}
              message={message}
              setContactForm={setContactForm}
              setNewsletterEmail={setNewsletterEmail}
              handleContactSubmit={handleContactSubmit}
              handleNewsletter={handleNewsletter}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <AdminPage
              projects={projects}
              clients={clients}
              contacts={contacts}
              subscriptions={subscriptions}
              projectForm={projectForm}
              clientForm={clientForm}
              loading={loading}
              message={message}
              setProjectForm={setProjectForm}
              setClientForm={setClientForm}
              handleProjectSubmit={handleProjectSubmit}
              handleClientSubmit={handleClientSubmit}
            />
          }
        />
      </Routes>
    </Router>
  );
}

function LandingPage({
  projects,
  clients,
  contacts,
  subscriptions,
  contactForm,
  newsletterEmail,
  loading,
  message,
  setContactForm,
  setNewsletterEmail,
  handleContactSubmit,
  handleNewsletter,
}) {
  return (
    <div className="page">
      <header className="hero hero-bg" id="home">
        <div className="hero-overlay">
          <div className="hero-left">
            <h1>Consultation, Design & Marketing</h1>
          </div>
          <div id="contact" className="anchor-offset" />
          <div className="hero-form-card">
            <h2>Get a Free Consultation</h2>
            <form className="form stacked" onSubmit={handleContactSubmit}>
              <input
                required
                value={contactForm.fullName}
                onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                placeholder="Full Name"
              />
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="Enter Email Address"
              />
              <input
                required
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                placeholder="Mobile Number"
              />
              <input
                required
                value={contactForm.city}
                onChange={(e) => setContactForm({ ...contactForm, city: e.target.value })}
                placeholder="Area, City"
              />
              <button className="button primary full" type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Get Quick Quote"}
              </button>
              {message && <p className="muted">{message}</p>}
            </form>
          </div>
        </div>
      </header>

      <main>
        <section className="section light" id="services">
          <div className="split">
            <div className="text-block">
              <p className="eyebrow blue">Not Your Average Realtor</p>
              <p className="muted">
                Real Trust brings a fresh and proactive, customer-centric marketing design and
                effective marketing to get the most out of your dollar and time value.
              </p>
            </div>
            <div className="circle-stack">
              <img src="/rounded image 1.webp" alt="Agent 1" className="circle large" />
              <img src="/rounded image 2.png" alt="Agent 2" className="circle medium" />
              <img src="/rounded image 3.jpg" alt="Agent 3" className="circle small" />
            </div>
          </div>
        </section>

        <section className="section why" id="why">
          <h2 className="centered">Why Choose Us?</h2>
          <div className="pill-grid">
            <div className="pill">
              <div className="pill-icon">🏠</div>
              <h3>Potential ROI</h3>
              <p className="muted">
                Whether you are looking to buy a new property or renovate your current home, we can
                help you maximize potential returns.
              </p>
            </div>
            <div className="pill">
              <div className="pill-icon">🎨</div>
              <h3>Design</h3>
              <p className="muted">
                Our in-house interior design ensures the project is guided through planning and
                execution to reflect your home aspirations.
              </p>
            </div>
            <div className="pill">
              <div className="pill-icon">📈</div>
              <h3>Marketing</h3>
              <p className="muted">
                Engaging marketing to give a sophisticated edge in a modern market.
              </p>
            </div>
          </div>
        </section>

        <section className="section gallery">
          <div className="gallery-row">
            <img src="/box image 1.jpg" alt="Gallery 1" />
            <img src="/box image 2.jpg" alt="Gallery 2" />
            <img src="/box image 3.jpg" alt="Gallery 3" />
          </div>
        </section>

        <section className="section about" id="about">
          <h2 className="centered">About Us</h2>
          <p className="muted centered wide">
            Flipr personal specializes in real estate, excellent customer service and a commitment
            to work hard, listen and follow through. We provide quality services to build
            relationships with clients and, more importantly, maintain those relationships by
            communicating effectively.
          </p>
          <Link className="button ghost centered-btn" to="/admin">
            Learn more
          </Link>
        </section>

        <section className="section projects-section" id="projects">
          <div className="projects-container">
            <div className="projects-header">
              <h2 className="projects-main-title">Our Projects</h2>
              <p className="projects-description">
                We know what buyers are looking for and suggest projects that will bring clients top
                dollar for the sale of their homes.
              </p>
            </div>
            <div className="projects-grid">
              {projects.map((p) => (
                <article className="project-card" key={p._id}>
                  <div className="project-image-wrapper">
                    <img src={p.image} alt={p.name} className="project-image" />
                  </div>
                  <div className="project-card-body">
                    <h3 className="project-title">{p.name}</h3>
                    <p className="project-location">
                      {p.location ? `${p.name}, ${p.location}` : `${p.name}, Location`}
                    </p>
                    <button className="button project-read-more" disabled>
                      READ MORE
                    </button>
                  </div>
                </article>
              ))}
              {!projects.length && (
                <p className="muted centered projects-empty">
                  No projects yet. Add projects from the admin panel.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="section clients-section" id="clients">
          <div className="clients-container">
            <div className="clients-decorative-bg">
              <div className="clients-bg-shape clients-bg-shape-left"></div>
              <div className="clients-bg-shape clients-bg-shape-right"></div>
            </div>
            <h2 className="clients-title">Happy Clients</h2>
            <div className="clients-grid">
              {clients.map((c) => (
                <article className="client-card" key={c._id}>
                  <div className="client-avatar-wrapper">
                    <img src={c.image} alt={c.name} className="client-avatar" />
                  </div>
                  <div className="client-card-body">
                    <p className="client-testimonial">{c.description}</p>
                    <h3 className="client-name">{c.name}</h3>
                    <p className="client-designation">{c.designation}</p>
                  </div>
                </article>
              ))}
              {!clients.length && (
                <p className="muted centered clients-empty">
                  No client testimonials yet. Add clients from the admin panel.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="section banner-section">
          <div className="banner-container">
            <div className="banner-overlay">
              <p className="banner-text">
                Learn more about our listing process, as well as our additional staging and design
                work.
              </p>
              <button className="banner-button">LEARN MORE</button>
            </div>
          </div>
        </section>

        <section className="section blue-banner">
          <div className="blue-banner-container">
            <div className="blue-banner-nav">
              <a href="#home" className="blue-banner-link">
                Home
              </a>
              <a href="#services" className="blue-banner-link">
                Services
              </a>
              <a href="#projects" className="blue-banner-link">
                Projects
              </a>
              <a href="#about" className="blue-banner-link">
                Testimonials
              </a>
              <a href="#contact" className="blue-banner-link">
                Contact
              </a>
            </div>
            <div className="blue-banner-subscribe">
              <span className="blue-banner-subscribe-label">Subscribe Us</span>
              <form className="blue-banner-form" onSubmit={handleNewsletter}>
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter Email Address"
                  className="blue-banner-input"
                />
                <button className="blue-banner-button" type="submit" disabled={loading}>
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>

        <footer className="footer-section">
          <div className="footer-container">
            <img src="/footer image.jpeg" alt="Footer" className="footer-image" />
          </div>
        </footer>
      </main>
    </div>
  );
}

function AdminPage({
  projects,
  clients,
  contacts,
  subscriptions,
  projectForm,
  clientForm,
  loading,
  message,
  setProjectForm,
  setClientForm,
  handleProjectSubmit,
  handleClientSubmit,
}) {
  return (
    <div className="page">
      <header className="hero">
        <div className="hero-content">
          <p className="eyebrow">Admin</p>
          <h1>Manage site content</h1>
          <p className="subhead">
            Create projects and client stories. Review contact submissions and newsletter
            signups.
          </p>
          <div className="cta-row">
            <Link className="button ghost" to="/">
              Back to landing
            </Link>
          </div>
        </div>
        <div className="hero-card">
          <p className="eyebrow">Overview</p>
          <div className="stat-row">
            <div>
              <p className="stat">{projects.length}</p>
              <p className="stat-label">Projects</p>
            </div>
            <div>
              <p className="stat">{clients.length}</p>
              <p className="stat-label">Clients</p>
            </div>
            <div>
              <p className="stat">{contacts.length}</p>
              <p className="stat-label">Contacts</p>
            </div>
          </div>
          <p className="muted">Subscribers: {subscriptions.length}</p>
          {message && <p className="muted">{message}</p>}
        </div>
      </header>

      <main>
        <section className="section">
          <div className="admin-grid">
            <div className="panel">
              <h3>Add project</h3>
              <form className="form" onSubmit={handleProjectSubmit}>
                <label>
                  Name
                  <input
                    required
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    placeholder="Project name"
                  />
                </label>
                <label>
                  Description
                  <textarea
                    required
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, description: e.target.value })
                    }
                    placeholder="Short summary"
                  />
                </label>
                <label>
                  Location
                  <input
                    value={projectForm.location}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, location: e.target.value })
                    }
                    placeholder="City, State"
                  />
                </label>
                <label>
                  Image URL
                  <input
                    required
                    value={projectForm.image}
                    onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                    placeholder="https://..."
                  />
                </label>
                <button className="button primary" type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save project"}
                </button>
                {message && (
                  <p className={message.includes("success") ? "success-message" : "error-message"}>
                    {message}
                  </p>
                )}
              </form>
            </div>

            <div className="panel">
              <h3>Add client</h3>
              <form className="form" onSubmit={handleClientSubmit}>
                <label>
                  Name
                  <input
                    required
                    value={clientForm.name}
                    onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                    placeholder="Client name"
                  />
                </label>
                <label>
                  Designation
                  <input
                    required
                    value={clientForm.designation}
                    onChange={(e) =>
                      setClientForm({ ...clientForm, designation: e.target.value })
                    }
                    placeholder="CEO, Designer, etc"
                  />
                </label>
                <label>
                  Testimonial
                  <textarea
                    required
                    value={clientForm.description}
                    onChange={(e) =>
                      setClientForm({ ...clientForm, description: e.target.value })
                    }
                    placeholder="What they said"
                  />
                </label>
                <label>
                  Image URL
                  <input
                    required
                    value={clientForm.image}
                    onChange={(e) => setClientForm({ ...clientForm, image: e.target.value })}
                    placeholder="https://..."
                  />
                </label>
                <button className="button primary" type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save client"}
                </button>
                {message && (
                  <p className={message.includes("success") ? "success-message" : "error-message"}>
                    {message}
                  </p>
                )}
              </form>
            </div>

            <div className="panel list">
              <h3>Contact submissions</h3>
              <ul>
                {contacts.map((c) => (
                  <li key={c._id}>
                    <div>
                      <strong>{c.fullName}</strong> — {c.city}
                    </div>
                    <p className="muted">
                      {c.email} | {c.phone}
                    </p>
                  </li>
                ))}
                {!contacts.length && <p className="muted">No contacts yet.</p>}
              </ul>
            </div>

            <div className="panel list">
              <h3>Newsletter subscribers</h3>
              <ul>
                {subscriptions.map((s) => (
                  <li key={s._id}>{s.email}</li>
                ))}
                {!subscriptions.length && <p className="muted">No subscribers yet.</p>}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
