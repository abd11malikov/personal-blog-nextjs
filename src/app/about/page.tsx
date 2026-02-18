export default function AboutPage() {
  return (
    <div className="p-10 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">About Me 👨‍💻</h1>
        
        <p className="text-lg text-gray-600 mb-4">
          Hello! I am Otabek, a Full Stack Software Engineer from Uzbekistan.
        </p>
        
        <p className="text-lg text-gray-600 mb-4">
          I specialize in <strong>Java Spring Boot, PostgreSQL, and Docker</strong> on the backend, 
          and I build blazing fast user interfaces using <strong>Next.js and Tailwind CSS</strong> on the frontend.
        </p>

        <div className="mt-8 p-6 bg-gray-200 rounded-lg border border-blue-100">
          <h2 className="text-2xl font-semibold text-black mb-2">My Tech Stack</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Java 17/21 & Spring Boot 3</li>
            <li>React & Next.js</li>
            <li>PostgreSQL & Hibernate (JPA)</li>
            <li>Docker & Cloud Deployment</li>
          </ul>
        </div>
      </div>
    </div>
  );
}