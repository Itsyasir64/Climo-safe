
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import "./App.css";

import {
    ArrowRight,
    ArrowUpRight,
    Leaf,
    Menu,
    X,
    Wind,
    Globe2,
    Droplets,
    TreePine,
    Sun,
    ShieldCheck,
    Recycle,
    Sprout,
    ChevronRight,
} from "lucide-react";

import { useState } from "react";

// Features data
const features = [
    {
        icon: Wind,
        title: "Air Quality",
        description:
            "Understand air pollution levels and discover how clean the air around you really is.",
        color: "green",
    },
    {
        icon: Globe2,
        title: "Climate Insights",
        description:
            "Explore climate trends, global warming and the environmental changes shaping our planet.",
        color: "lime",
    },
    {
        icon: Droplets,
        title: "Water Conservation",
        description:
            "Learn practical ways to protect water resources and build a sustainable future.",
        color: "blue",
    },
    {
        icon: TreePine,
        title: "Green Initiatives",
        description:
            "Discover tree plantation, recycling and community environmental campaigns.",
        color: "orange",
    },
];

// Eco actions data
const actions = [
    {
        number: "01",
        title: "Plant More Trees",
        description:
            "Support green spaces and help restore our natural environment.",
        icon: TreePine,
    },
    {
        number: "02",
        title: "Reduce Plastic",
        description:
            "Choose reusable alternatives and reduce unnecessary waste.",
        icon: Recycle,
    },
    {
        number: "03",
        title: "Save Energy",
        description:
            "Make smarter energy choices and reduce your carbon footprint.",
        icon: Sun,
    },
];

// Home / Landing Page
function Home() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="climo-app">

            {/* Navigation */}
            <header className="navbar">

                <Link to="/" className="brand">
                    <span className="brand-icon">
                        <Leaf size={21} />
                    </span>
                    <span>
                        climo<span className="brand-light">safe.</span>
                    </span>
                </Link>

                <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
                    <a href="#home" onClick={() => setMenuOpen(false)}>
                        Home
                    </a>

                    <a href="#about" onClick={() => setMenuOpen(false)}>
                        About
                    </a>

                    <a href="#features" onClick={() => setMenuOpen(false)}>
                        Explore
                    </a>

                    <a href="#actions" onClick={() => setMenuOpen(false)}>
                        Eco Actions
                    </a>

                    <a href="#contact" onClick={() => setMenuOpen(false)}>
                        Contact
                    </a>
                </nav>

                <Link
                    to="/dashboard"
                    className="nav-button"
                    onClick={() => setMenuOpen(false)}
                >
                    Explore Platform <ArrowUpRight size={17} />
                </Link>

                <button
                    className="menu-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    {menuOpen ? <X /> : <Menu />}
                </button>

            </header>

            <main>

                {/* Hero Section */}
                <section className="hero" id="home">

                    <div className="hero-content">

                        <div className="eyebrow">
                            <span className="eyebrow-dot"></span>
                            OUR PLANET, OUR RESPONSIBILITY
                        </div>

                        <h1>
                            A greener planet
                            <br />
                            starts with <span>you.</span>
                        </h1>

                        <p className="hero-description">
                            Discover the impact of climate change, understand our
                            environment and take meaningful steps towards a
                            cleaner, healthier and more sustainable world.
                        </p>

                        <div className="hero-buttons">

                            <Link
                                to="/dashboard"
                                className="primary-button"
                            >
                                Explore Climo-Safe
                                <ArrowRight size={18} />
                            </Link>

                            <a href="#about" className="secondary-button">
                                Discover Our Mission
                            </a>

                        </div>

                        <div className="hero-note">
                            <div className="note-icon">
                                <ShieldCheck size={19} />
                            </div>

                            <span>
                                Knowledge today. A sustainable tomorrow.
                            </span>
                        </div>

                    </div>

                    <div className="hero-visual">

                        <img
                            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&fit=crop&q=85"
                            alt="Sunlight shining through a beautiful green forest"
                        />

                        <div className="image-overlay"></div>

                        <div className="floating-card">

                            <span className="floating-icon">
                                <Sprout size={21} />
                            </span>

                            <div>
                                <strong>Small actions.</strong>
                                <p>Big environmental impact.</p>
                            </div>

                        </div>

                        <div className="hero-image-label">
                            <span>01 / OUR PLANET</span>
                            <span>Protect what matters.</span>
                        </div>

                    </div>

                </section>

                {/* Intro Section */}
                <section className="intro-strip" id="about">

                    <div className="intro-label">
                        <span className="section-tag">
                            WHY CLIMO-SAFE?
                        </span>
                    </div>

                    <h2>
                        Awareness is the first step
                        <br />
                        towards <span>change.</span>
                    </h2>

                    <p>
                        Climate change affects every living thing. We make
                        environmental knowledge accessible so everyone can
                        understand the challenges and become part of the solution.
                    </p>

                </section>

                {/* Features Section */}
                <section className="features-section" id="features">

                    <div className="section-heading">

                        <div>
                            <span className="section-tag">
                                EXPLORE OUR PLATFORM
                            </span>

                            <h2>
                                Understand our planet.
                                <br />
                                <span>Protect its future.</span>
                            </h2>
                        </div>

                        <p>
                            Everything you need to learn about environmental
                            challenges and discover ways to make a difference.
                        </p>

                    </div>

                    <div className="features-grid">

                        {features.map((feature, index) => {

                            const Icon = feature.icon;

                            return (
                                <article
                                    className="feature-card"
                                    key={feature.title}
                                >

                                    <div className={`feature-icon ${feature.color}`}>
                                        <Icon size={25} />
                                    </div>

                                    <span className="feature-number">
                                        0{index + 1}
                                    </span>

                                    <h3>{feature.title}</h3>

                                    <p>{feature.description}</p>

                                    <a href="#actions" className="card-link">
                                        Learn more
                                        <ArrowUpRight size={17} />
                                    </a>

                                </article>
                            );

                        })}

                    </div>

                </section>

                {/* Mission Section */}
                <section className="mission-section">

                    <div className="mission-image">

                        <img
                            src="https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1000&auto=format&fit=crop&q=85"
                            alt="Wildlife in a natural green environment"
                        />

                    </div>

                    <div className="mission-content">

                        <span className="section-tag">
                            OUR MISSION
                        </span>

                        <h2>
                            Protecting nature is
                            <span> protecting our future.</span>
                        </h2>

                        <p>
                            We believe environmental protection begins with
                            awareness. Climo-Safe brings climate information,
                            educational resources and sustainable ideas together
                            in one place.
                        </p>

                        <div className="mission-points">

                            <div>
                                <ShieldCheck size={20} />
                                <span>Build environmental awareness</span>
                            </div>

                            <div>
                                <Globe2 size={20} />
                                <span>Understand global climate challenges</span>
                            </div>

                            <div>
                                <Sprout size={20} />
                                <span>Encourage sustainable lifestyles</span>
                            </div>

                        </div>

                        <a href="#actions" className="primary-button">
                            Be Part of the Change
                            <ArrowRight size={18} />
                        </a>

                    </div>

                </section>

                {/* Eco Actions Section */}
                <section className="actions-section" id="actions">

                    <div className="section-heading">

                        <div>
                            <span className="section-tag">
                                MAKE A DIFFERENCE
                            </span>

                            <h2>
                                Small steps.
                                <br />
                                <span>Lasting impact.</span>
                            </h2>
                        </div>

                        <p>
                            A sustainable future is built through everyday choices.
                            Start making a positive difference today.
                        </p>

                    </div>

                    <div className="actions-grid">

                        {actions.map((action) => {

                            const Icon = action.icon;

                            return (
                                <article
                                    className="action-card"
                                    key={action.number}
                                >

                                    <div className="action-top">
                                        <span>{action.number}</span>
                                        <Icon size={28} />
                                    </div>

                                    <h3>{action.title}</h3>

                                    <p>{action.description}</p>

                                    <ChevronRight
                                        size={21}
                                        className="action-arrow"
                                    />

                                </article>
                            );

                        })}

                    </div>

                </section>

                {/* Call To Action */}
                <section className="cta-section" id="contact">

                    <div className="cta-icon">
                        <Leaf size={27} />
                    </div>

                    <span className="section-tag">
                        THE FUTURE IS IN OUR HANDS
                    </span>

                    <h2>
                        Let's make our planet
                        <br />
                        a better place to live.
                    </h2>

                    <p>
                        Learn, take action and inspire others. Every positive
                        choice brings us closer to a sustainable future.
                    </p>

                    <Link to="/dashboard" className="cta-button">
                        Start Exploring
                        <ArrowRight size={18} />
                    </Link>

                </section>

            </main>

            {/* Footer */}
            <footer className="footer">

                <a href="#home" className="brand footer-brand">

                    <span className="brand-icon">
                        <Leaf size={21} />
                    </span>

                    <span>
                        climo<span className="brand-light">safe.</span>
                    </span>

                </a>

                <p>
                    Protecting our planet, one step at a time.
                </p>

                <span className="copyright">
                    © {new Date().getFullYear()} Climo-Safe.
                    All rights reserved.
                </span>

            </footer>

        </div>
    );
}

// Main Application with React Router
export default function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Landing Page */}
                <Route
                    path="/"
                    element={<Home />}
                />

                {/* Environmental Dashboard */}
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

            </Routes>

        </BrowserRouter>
    );

}
