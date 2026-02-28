export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* --- HERO / INTRO --- */}
        <section className="text-center">
          <img 
            src="https://pub-89e3ffab5507464293c0bfee94f64d24.r2.dev/photo_2026-03-01%2012.44.07%E2%80%AFAM.jpeg"
            alt="Otabek Abdumalikov" 
            className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white shadow-lg" 
          />
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            Otabek Abdumalikov
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Backend Engineer & System Architect | Tashkent, Uzbekistan 🇺🇿
          </p>
        </section>

        {/* --- THE "WHY" --- */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">My Philosophy</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            I approach software engineering with a focus on architecture and long-term stability. For me, the goal is not just to deliver features, but to build a foundation that is secure, scalable, and easy for other developers to maintain. I prioritize clean code, robust database design, and automated testing to ensure the final product is not just functional, but engineered to last.
          </p>
        </section>
        
        {/* --- TECH STACK --- */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Core Competencies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-2xl font-semibold mb-3 text-blue-600">Backend Engineering</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Java 17/21</strong> & Spring Boot 3</li>
                <li><strong>Spring Security:</strong> JWT Authentication & RBAC</li>
                <li><strong>Databases:</strong> PostgreSQL & Hibernate (JPA)</li>
                <li><strong>Architecture:</strong> RESTful APIs, Microservices Concepts</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-2xl font-semibold mb-3 text-green-600">DevOps & Cloud</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Containerization:</strong> Docker & Docker Compose</li>
                <li><strong>Cloud Deployment:</strong> DigitalOcean (VPS), Railway</li>
                <li><strong>File Storage:</strong> Cloudflare R2 (S3 Compatible)</li>
                <li><strong>CI/CD:</strong> Git, GitHub Actions (Basics)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- GLOBAL EXPERIENCE --- */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Beyond the Code</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            My experience isn&apos;t limited to the terminal. In 2023, I participated in a Work & Travel program in Germany, working within the logistics division at <strong>Audi AG</strong>. This experience in a high-standard, international environment taught me the importance of discipline, teamwork, and process optimization—skills that I bring to every software project I undertake. I am fluent in English, Russian, and Uzbek, enabling seamless communication in global teams.
          </p>
        </section>

        {/* --- CONTACT --- */}
        <section className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Let&apos;s Connect</h2>
          <p className="text-lg text-gray-700 mb-6">
            I&apos;m always open to discussing new projects, interesting ideas, or just connecting with other developers.
          </p>
          <div className="flex justify-center gap-4">
            <a href="https://github.com/abd11malikov" className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition">GitHub</a>
            <a href="https://www.linkedin.com/in/otabek-abdumalikov-26b825269" className="px-6 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition">LinkedIn</a>
          </div>
        </section>
      </div>
    </main>
  );
}