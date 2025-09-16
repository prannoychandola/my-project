import React from "react";

// Base class
class Human {
  constructor(fullName, years) {
    this.fullName = fullName;
    this.years = years;
  }

  details() {
    return `Name: ${this.fullName}, Age: ${this.years}`;
  }
}

// Student subclass
class Learner extends Human {
  constructor(fullName, years, major) {
    super(fullName, years);
    this.major = major;
  }

  details() {
    return `${super.details()}, Major: ${this.major}`;
  }
}

// Teacher subclass
class Mentor extends Human {
  constructor(fullName, years, subjectArea) {
    super(fullName, years);
    this.subjectArea = subjectArea;
  }

  details() {
    return `${super.details()}, Subject: ${this.subjectArea}`;
  }
}

export default function App() {
  const learner = new Learner("Anita", 19, "Artificial Intelligence");
  const mentor = new Mentor("Dr. Kapoor", 45, "Physics");

  return (
    <div style={{ fontFamily: "Verdana, sans-serif", margin: "25px" }}>
      <h1>Human Inheritance Example</h1>
      <section>
        <h2>Learner Information</h2>
        <p>{learner.details()}</p>
      </section>
      <section>
        <h2>Mentor Information</h2>
        <p>{mentor.details()}</p>
      </section>
    </div>
  );
}