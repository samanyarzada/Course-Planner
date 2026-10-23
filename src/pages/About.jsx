import { useState } from "react";
import { Link } from "react-router-dom";

function About() {
  // Which FAQ question is open (null = none)
  const [openIndex, setOpenIndex] = useState(0);

  const values = [
    { icon: "🎯", title: "Clear choices", text: "See fees, hours, and trainers before you decide." },
    { icon: "🗓️", title: "No conflicts", text: "We check the day and time of every course you add." },
    { icon: "💰", title: "Budget control", text: "Set a spending limit and see your balance at once." },
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
        "No. All courses, trainers, and enquiries are samples made for a student project. Nothing is sent or saved on a server.",
    },
  ];

  return (
    <div className="animate-fade-up space-y-12">
      {/* Header */}
      <section className="rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 px-6 py-14 text-center text-white">
        <h1 className="text-4xl font-extrabold">About SkillHub</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
          SkillHub is a sample training centre. We help learners compare courses, build a weekly
          study plan, and check the total cost before they enrol.
        </p>
      </section>

      {/* Values */}
      <section className="grid gap-5 md:grid-cols-3">
        {values.map((value) => (
          <div key={value.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-3xl">{value.icon}</p>
            <h3 className="mt-3 font-bold text-gray-900">{value.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{value.text}</p>
          </div>
        ))}
      </section>

      {/* Project info */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-extrabold text-gray-900">About this project</h2>
        <p className="mt-2 text-gray-600">
          This website is a student project built with React, React Router, and Tailwind CSS.
          Courses are loaded from a JSON file with fetch, and every feature uses React state.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["React", "JSX", "Props", "useState", "useEffect", "React Router", "Tailwind CSS"].map(
            (tag) => (
              <span key={tag} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                {tag}
              </span>
            )
          )}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xl font-extrabold text-gray-900">Frequently asked questions</h2>
        <div className="mt-4 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-gray-900"
                >
                  {faq.question}
                  <span className="ml-4 text-xl text-blue-600">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && <p className="px-5 pb-4 text-sm text-gray-600">{faq.answer}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <div className="text-center">
        <Link
          to="/courses"
          className="inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Explore courses
        </Link>
      </div>
    </div>
  );
}

export default About;