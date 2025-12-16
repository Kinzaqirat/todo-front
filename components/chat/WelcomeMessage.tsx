'use client';

export function WelcomeMessage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="text-4xl mb-4">👋</div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Hi! I&apos;m your todo assistant
      </h2>
      <p className="text-gray-600 mb-6 max-w-md">
        I can help you manage your tasks. Try asking me to:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
        <ExampleCard
          title="Task Management"
          examples={[
            '"Add a task to buy groceries"',
            '"Show me all my tasks"',
            '"Mark task 3 as done"',
          ]}
          color="blue"
        />
        <ExampleCard
          title="Search"
          examples={[
            '"Find tasks about meetings"',
            '"Search for tasks due tomorrow"',
          ]}
          color="purple"
        />
        <ExampleCard
          title="Analytics"
          examples={[
            '"How many tasks have I completed?"',
            '"What is my completion rate?"',
          ]}
          color="green"
        />
        <ExampleCard
          title="Recommendations"
          examples={[
            '"What should I work on next?"',
            '"Suggest my priorities for today"',
          ]}
          color="orange"
        />
      </div>
    </div>
  );
}

interface ExampleCardProps {
  title: string;
  examples: string[];
  color: 'blue' | 'purple' | 'green' | 'orange';
}

function ExampleCard({ title, examples, color }: ExampleCardProps) {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    purple: 'border-purple-200 bg-purple-50',
    green: 'border-green-200 bg-green-50',
    orange: 'border-orange-200 bg-orange-50',
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <h3 className="font-medium text-gray-800 mb-2">{title}</h3>
      <ul className="text-sm text-gray-600 space-y-1">
        {examples.map((example, i) => (
          <li key={i} className="italic">
            {example}
          </li>
        ))}
      </ul>
    </div>
  );
}
