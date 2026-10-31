import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icons";

function About() {
  // Which FAQ question is open (null = none)
  const [openIndex, setOpenIndex] = useState(0);

  const values = [
    { icon: "target", title: "Clear choices", text: "See fees, hours, and trainers before you decide." },
    { icon: "calendarCheck", title: "No conflicts", text: "We check the day and time of every course you add." },
    { icon: "wallet", title: "Budget control", text: "Set a spending limit and see your balance at once." },
  ];

  const faqs = [
    {
      question: "How do I add a course to my study plan?",
      answer:
        "Open the Courses page and press Add to plan on any course. You can also do it from the course details page.",
    },
    {
      question: "Why can I not add some courses?",
      answer:
        "A course cannot be added if it has no seats, if it is already in your plan, or if it uses the same day and time as another selected course.",
    },
    {
      question: "Is the data on this website real?",
      answer:
        "No. All courses, trainers, and enquiries are samples made for a student project. Nothing here is real training data.",
    },
  ];

  return (
    <div className="animate-fade-up space-y-20">
      {/* Header */}
      <section className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-20 text-center text-white shadow-2xl shadow-ink/30">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,149,90,0.28),transparent_60%)]" />
        <div className="pointer-events-none absolute -left-10 -top-10 h-52 w-52 animate-float rounded-full border border-gold/30" />
        <div className="pointer-events-none absolute -bottom-12 -right-8 h-44 w-44 animate-float rounded-full border border-gold/20 [animation-delay:1.5s]" />

        <div className="relative">
          <p className="eyebrow text-gold-light!">Our story</p>
          <h1 className="mt-3 text-4xl font-semibold md:text-6xl">
            About <span className="italic text-gold-gradient">SkillHub</span>
          </h1>
          <span className="gold-rule mx-auto mt-5" />
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
            SkillHub is a sample training centre. We help learners compare courses, build a weekly
            study plan, and check the total cost before they enrol.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="stagger grid gap-6 md:grid-cols-3">
        {values.map((value) => (
          <div key={value.title} className="card-lux card-lux-hover group p-7">
            <span className="icon-badge h-12 w-12">
              <Icon name={value.icon} className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-lg font-semibold text-ink">{value.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{value.text}</p>
          </div>
        ))}
      </section>

      {/* Project info */}
      <section className="card-lux p-8">
        <p className="eyebrow">The project</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">About this project</h2>
        <span className="gold-rule mt-3" />
        <p className="mt-4 leading-relaxed text-muted">
          This website is a student project built with React, React Router, and Tailwind CSS.
          Courses are loaded from a JSON file with fetch, and every feature uses React state.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {["React", "JSX", "Props", "useState", "useEffect", "React Router", "Tailwind CSS"].map(
            (tag) => (
              <span
                key={tag}
                className="rounded-full border border-gold-light bg-cream px-3.5 py-1.5 text-sm font-medium text-gold-dark transition-all duration-300 hover:bg-gold hover:text-ink"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <p className="eyebrow">Support</p>
        <h2 className="mt-2 text-3xl font-semibold text-ink">Frequently asked questions</h2>
        <span className="gold-rule mt-4" />

        <div className="mt-8 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className={`card-lux overflow-hidden transition-colors duration-500 ${
                  isOpen ? "border-gold-light!" : ""
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left font-semibold text-ink"
                >
                  {faq.question}
                  <span
                    className={`ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                      isOpen
                        ? "rotate-45 border-gold bg-gold text-ink"
                        : "border-line text-gold-dark"
                    }`}
                  >
                    <Icon name="plus" className="h-4 w-4" />
                  </span>
                </button>

                {/* Smooth open and close */}
                <div
                  className={`grid transition-all duration-500 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="text-center">
        <Link to="/courses" className="btn-gold px-8 py-3.5">
          Explore courses
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export default About;