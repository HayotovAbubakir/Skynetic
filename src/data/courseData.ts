import type { CourseCategory, InteractiveTask, Lesson } from '../types'

export type SubjectId =
  | 'mathematics'
  | 'biology'
  | 'chemistry'
  | 'english'
  | 'russian'
  | 'uzbek'
  | 'html-css'
  | 'git-github'
  | 'firebase'
  | 'mui'

export interface LessonQuizQuestion {
  id: string
  prompt: string
  options: string[]
  answerIndex: number
  explanation: string
}

export interface LessonQuiz {
  questions: LessonQuizQuestion[]
}

export interface LessonContent {
  id: string
  title: string
  full_content: string[]
  voice_script: string
  interactive_task: InteractiveTask
  quiz: LessonQuiz
}

export interface SubjectCourse {
  /** Course id that will also be used as Course.id in the catalog. */
  id: string
  subjectId: SubjectId
  title: string
  category: CourseCategory
  level: string
  description: string
  tags: string[]
  lessons: LessonContent[]
}

const mathLessons: LessonContent[] = [
  {
    id: 'math-lesson-1',
    title: 'Linear equations in one variable',
    full_content: [
      'In a linear equation with one variable, every term is either a constant or the product of a constant and a single variable. A typical example is \\(2x + 3 = 11\\).',
      'To solve a linear equation, we perform the same operation on both sides until the variable is isolated. This keeps the equality balanced, just like adding the same weight to both sides of a scale.',
      'For \\(2x + 3 = 11\\), subtract 3 from both sides to get \\(2x = 8\\), then divide by 2 to find \\(x = 4\\). You can always check your work by substituting back into the original equation.',
    ],
    voice_script:
      'In this lesson we solve linear equations in one variable, like “two x plus three equals eleven”. Think of an equation as a balanced scale. Whatever you do to one side you must do to the other. Subtract three from both sides, then divide by two, and you discover that x equals four.',
    interactive_task: {
      type: 'math',
      prompt:
        'Solve the equation \\(3x - 5 = 16\\). Show each step and explain why it keeps the equation balanced.',
      hint: 'Undo subtraction by adding, then undo multiplication by dividing.',
      latexExample: '3x - 5 = 16',
      solution: 'Add 5 to both sides to get \\(3x = 21\\), then divide by 3 to get \\(x = 7\\).',
    },
    quiz: {
      questions: [
        {
          id: 'math-lesson-1-q1',
          prompt: 'Which operation should you perform first to solve \\(2x + 7 = 15\\)?',
          options: [
            'Divide both sides by 2',
            'Subtract 7 from both sides',
            'Add 7 to both sides',
            'Square both sides',
          ],
          answerIndex: 1,
          explanation: 'You first undo the +7 term by subtracting 7 from both sides.',
        },
        {
          id: 'math-lesson-1-q2',
          prompt: 'After solving an equation, why is substitution back into the original equation useful?',
          options: [
            'It changes the equation into a new one',
            'It checks whether the solution really satisfies the equation',
            'It always makes the equation simpler',
            'It removes all fractions from the equation',
          ],
          answerIndex: 1,
          explanation: 'Substitution lets you verify that the left and right sides are equal.',
        },
        {
          id: 'math-lesson-1-q3',
          prompt: 'Which equation is linear in one variable?',
          options: ['\\(x^2 + 1 = 0\\)', '\\(3x - 2 = 4\\)', '\\(xy = 5\\)', '\\(2^x = 8\\)'],
          answerIndex: 1,
          explanation: 'Only \\(3x - 2 = 4\\) has the variable \\(x\\) to the first power only.',
        },
      ],
    },
  },
  {
    id: 'math-lesson-2',
    title: 'Systems of linear equations',
    full_content: [
      'A system of linear equations is a set of two or more linear equations with the same variables, such as \\(x + y = 5\\) and \\(2x - y = 1\\). We look for values that satisfy all equations at once.',
      'Two common solution strategies are substitution and elimination. In substitution, you solve one equation for a variable, then substitute into the other. In elimination, you add or subtract equations to cancel a variable.',
      'Graphically, each equation is a line in the plane. The point of intersection, if it exists, represents the common solution to the system.',
    ],
    voice_script:
      'Here we solve systems of two linear equations. You can picture each equation as a straight line on the coordinate plane; the solution is their intersection. We practise both substitution, where we solve one equation for a variable, and elimination, where we combine equations to cancel a variable.',
    interactive_task: {
      type: 'math',
      prompt:
        'Solve the system \\(x + y = 5\\) and \\(2x - y = 1\\) using the elimination method. Explain each step.',
      latexExample: 'x + y = 5, \\quad 2x - y = 1',
      solution:
        'Adding the equations gives \\(3x = 6\\), so \\(x = 2\\). Substitute back into \\(x + y = 5\\) to get \\(y = 3\\).',
    },
    quiz: {
      questions: [
        {
          id: 'math-lesson-2-q1',
          prompt: 'What does the intersection point of two lines in a system represent?',
          options: [
            'A solution to only one of the equations',
            'The average of all possible solutions',
            'A common solution to both equations',
            'A point that never satisfies the system',
          ],
          answerIndex: 2,
          explanation: 'The intersection point satisfies every equation in the system.',
        },
        {
          id: 'math-lesson-2-q2',
          prompt:
            'In the elimination method, why do we sometimes multiply one equation before adding or subtracting?',
          options: [
            'To change the solution',
            'To create matching coefficients that cancel a variable',
            'To make the equations non-linear',
            'To remove constants from the equation',
          ],
          answerIndex: 1,
          explanation:
            'Multiplying an equation by a non-zero constant keeps the solution set but can align coefficients.',
        },
        {
          id: 'math-lesson-2-q3',
          prompt:
            'If two lines in a system are parallel but not the same line, how many solutions does the system have?',
          options: ['Exactly one', 'None', 'Infinitely many', 'It depends on the slope'],
          answerIndex: 1,
          explanation: 'Parallel distinct lines never intersect, so there is no common solution.',
        },
      ],
    },
  },
  {
    id: 'math-lesson-3',
    title: 'The quadratic formula',
    full_content: [
      'A quadratic equation has the form \\(ax^2 + bx + c = 0\\) with \\(a \\neq 0\\). The quadratic formula gives a general solution in terms of \\(a\\), \\(b\\), and \\(c\\).',
      'The formula is \\(x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\). The expression under the square root, \\(b^2 - 4ac\\), is called the discriminant and tells us how many real solutions we have.',
      'When the discriminant is positive, there are two distinct real solutions; when it is zero, there is exactly one real solution; and when it is negative, there are no real solutions over the reals.',
    ],
    voice_script:
      'Quadratic equations have the form “ay squared plus b x plus c equals zero”. The quadratic formula, x equals negative b plus or minus the square root of b squared minus four a c, all over two a, lets you solve any quadratic. The sign of the discriminant tells you whether there are two, one, or no real solutions.',
    interactive_task: {
      type: 'math',
      prompt:
        'Use the quadratic formula to solve \\(x^2 - 5x + 6 = 0\\). State the discriminant and each solution.',
      latexExample: 'x^2 - 5x + 6 = 0',
      solution:
        'Here \\(a = 1\\), \\(b = -5\\), \\(c = 6\\). The discriminant is \\(b^2 - 4ac = 25 - 24 = 1\\). The solutions are \\(x = 2\\) and \\(x = 3\\).',
    },
    quiz: {
      questions: [
        {
          id: 'math-lesson-3-q1',
          prompt:
            'For the quadratic equation \\(2x^2 + 3x - 2 = 0\\), what is the discriminant \\(b^2 - 4ac\\)?',
          options: ['\\(3\\)', '\\(17\\)', '\\(25\\)', '\\(1\\)'],
          answerIndex: 1,
          explanation: 'Here \\(a = 2\\), \\(b = 3\\), \\(c = -2\\), so \\(b^2 - 4ac = 9 - 4 \\cdot 2 \\cdot (-2) = 9 + 16 = 25\\).',
        },
        {
          id: 'math-lesson-3-q2',
          prompt: 'If the discriminant of a quadratic equation is negative, what can we say?',
          options: [
            'There are two real solutions',
            'There is exactly one real solution',
            'There are no real solutions over the reals',
            'The equation is not quadratic',
          ],
          answerIndex: 2,
          explanation:
            'A negative discriminant means the square root is not real, so there are no real solutions.',
        },
        {
          id: 'math-lesson-3-q3',
          prompt: 'Which of the following is the correct quadratic formula?',
          options: [
            '\\(x = \\frac{-b \\pm \\sqrt{b^2 + 4ac}}{2a}\\)',
            '\\(x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\)',
            '\\(x = \\frac{b \\pm \\sqrt{b^2 - 4ac}}{2a}\\)',
            '\\(x = \\frac{-b \\pm 4ac}{2a}\\)',
          ],
          answerIndex: 1,
          explanation: 'The discriminant appears as \\(b^2 - 4ac\\) under the square root.',
        },
      ],
    },
  },
  {
    id: 'math-lesson-4',
    title: 'Slope and rate of change',
    full_content: [
      'The slope of a line measures its rate of change: how much \\(y\\) changes when \\(x\\) increases by one unit. Algebraically, slope is \\(m = \\frac{\\Delta y}{\\Delta x}\\).',
      'On a graph, a positive slope means the line rises as it moves to the right, while a negative slope means it falls. A slope of zero corresponds to a horizontal line.',
      'In real contexts, slope often represents speed, cost per item, or another “per one unit” quantity. Interpreting slope in context is a key modeling skill.',
    ],
    voice_script:
      'Slope is a measure of rate of change, the change in y over the change in x. A positive slope rises to the right; a negative slope falls. In word problems, slope might represent speed, cost per item, or any “per one” quantity.',
    interactive_task: {
      type: 'math',
      prompt:
        'A line passes through the points \\((1, 3)\\) and \\((5, 11)\\). Find its slope and interpret it in a sentence.',
      latexExample: '\\((1, 3), (5, 11)\\)',
      solution:
        'The slope is \\(m = \\frac{11 - 3}{5 - 1} = \\frac{8}{4} = 2\\). Interpretation: the output increases by 2 units for each 1-unit increase in the input.',
    },
    quiz: {
      questions: [
        {
          id: 'math-lesson-4-q1',
          prompt: 'Which formula correctly defines the slope between two points?',
          options: [
            '\\(m = \\frac{\\Delta x}{\\Delta y}\\)',
            '\\(m = \\frac{y_2 - y_1}{x_2 - x_1}\\)',
            '\\(m = x_2 - x_1\\)',
            '\\(m = y_2 - y_1\\)',
          ],
          answerIndex: 1,
          explanation: 'Slope is rise over run: change in y divided by change in x.',
        },
        {
          id: 'math-lesson-4-q2',
          prompt: 'A horizontal line has what slope?',
          options: ['Positive', 'Negative', 'Zero', 'Undefined'],
          answerIndex: 2,
          explanation: 'Horizontal lines have zero change in y for any change in x, so slope is zero.',
        },
        {
          id: 'math-lesson-4-q3',
          prompt:
            'In a cost model \\(C(x) = 5x + 20\\), where \\(x\\) is the number of items, what does the slope 5 represent?',
          options: [
            'The fixed startup cost',
            'The cost per item',
            'The total cost for 5 items',
            'The tax rate',
          ],
          answerIndex: 1,
          explanation: 'The coefficient of x is the cost per additional item.',
        },
      ],
    },
  },
  {
    id: 'math-lesson-5',
    title: 'Exponential growth and decay',
    full_content: [
      'Exponential functions model situations where a quantity changes by the same factor in each equal time step, such as \\(y = a \\cdot b^t\\).',
      'When \\(b > 1\\), the function grows; when \\(0 < b < 1\\), it decays. This pattern appears in compound interest, population models, and radioactive decay.',
      'Comparing linear and exponential models helps us decide whether a constant difference or a constant ratio better fits a real data set.',
    ],
    voice_script:
      'Exponential models describe repeated multiplication by a constant factor. When the base is greater than one, values grow; when it is between zero and one, values shrink. You will see these patterns in interest, population, and decay problems.',
    interactive_task: {
      type: 'math',
      prompt:
        'A savings account starts with \\$1{,}000 and grows by 5% each year. Write an exponential model for the balance after \\(t\\) years and compute the balance after 3 years.',
      solution:
        'A model is \\(B(t) = 1000 \\cdot 1.05^t\\). After 3 years, \\(B(3) \\approx 1000 \\cdot 1.157625 = 1157.63\\) dollars (rounded).',
    },
    quiz: {
      questions: [
        {
          id: 'math-lesson-5-q1',
          prompt:
            'In the exponential model \\(P(t) = 200 \\cdot 0.9^t\\), what does the factor 0.9 represent?',
          options: [
            '10% growth per time step',
            '10% decay per time step',
            '90% growth per time step',
            'A fixed increase of 0.9 per step',
          ],
          answerIndex: 1,
          explanation: 'Each time step retains 90% of the previous amount, a 10% decrease.',
        },
        {
          id: 'math-lesson-5-q2',
          prompt:
            'Which situation is best modeled by an exponential function rather than a linear one?',
          options: [
            'A car traveling at a constant speed',
            'A bank account with a fixed yearly interest rate',
            'A tank being filled at a constant rate of liters per minute',
            'A staircase with equal-height steps',
          ],
          answerIndex: 1,
          explanation: 'Interest applies a constant percentage change, which is exponential.',
        },
        {
          id: 'math-lesson-5-q3',
          prompt: 'If an exponential function doubles every 3 years, what happens every 6 years?',
          options: [
            'It grows by a fixed amount',
            'It halves in value',
            'It multiplies by 4 overall',
            'It stays constant',
          ],
          answerIndex: 2,
          explanation: 'Two doubling periods multiply the starting amount by 4.',
        },
      ],
    },
  },
]

const htmlCssLessons: LessonContent[] = [
  {
    id: 'html-css-lesson-1',
    title: 'Semantic HTML structure',
    full_content: [
      'Semantic HTML elements such as <header>, <nav>, <main>, and <footer> give structure and meaning to a page. They help screen readers and search engines understand how content is organized.',
      'MDN-style layouts often start with a high-level semantic skeleton, then fill each region with more specific components, like articles, asides, and sections.',
      'Using semantic elements instead of generic <div> tags improves accessibility and makes your markup easier to maintain.',
    ],
    voice_script:
      'We begin by organizing a page with semantic HTML. Elements like header, nav, main, and footer describe the role of content, which helps assistive technologies and search engines. Replacing anonymous divs with meaningful tags makes your layout clearer for both humans and tools.',
    interactive_task: {
      type: 'code',
      language: 'html-css',
      instructions:
        'Transform the non-semantic layout into one that uses <header>, <nav>, <main>, and <footer>. Keep the visual structure but upgrade the tags.',
      starterCode: `<!-- Replace generic divs with semantic elements -->
<div class="page">
  <div class="top-bar">Skynetic</div>
  <div class="menu">Home | Courses | Profile</div>
  <div class="content">
    <h1>Welcome</h1>
    <p>Start your AI-powered learning journey.</p>
  </div>
  <div class="bottom-bar">© 2026 Skynetic</div>
</div>

<style>
  body { font-family: system-ui, sans-serif; margin: 0; }
  .page { min-height: 100vh; display: grid; grid-template-rows: auto auto 1fr auto; }
  .top-bar, .bottom-bar { padding: 1rem; background: #0f172a; color: white; }
  .menu { padding: 0.75rem 1rem; background: #e2e8f0; }
  .content { padding: 1.5rem; }
</style>
`,
      solutionNotes:
        'Use <header> for the top bar, <nav> for the menu, <main> for the content, and <footer> for the bottom bar.',
    },
    quiz: {
      questions: [
        {
          id: 'html-css-lesson-1-q1',
          prompt: 'Which element best represents the main content of a page?',
          options: ['<section>', '<article>', '<main>', '<footer>'],
          answerIndex: 2,
          explanation: '<main> is reserved for the dominant content of the <body>.',
        },
        {
          id: 'html-css-lesson-1-q2',
          prompt: 'Why are semantic elements important for accessibility?',
          options: [
            'They change the default font',
            'They allow screen readers to understand document structure',
            'They automatically add animations',
            'They reduce the size of CSS files',
          ],
          answerIndex: 1,
          explanation:
            'Semantic elements expose meaningful landmarks that assistive technologies can navigate.',
        },
        {
          id: 'html-css-lesson-1-q3',
          prompt: 'Which tag is the best choice for site-wide navigation links?',
          options: ['<nav>', '<menu>', '<aside>', '<header>'],
          answerIndex: 0,
          explanation: '<nav> is intended for major navigation blocks.',
        },
      ],
    },
  },
  // Additional HTML/CSS lessons (layout, responsive design, flexbox, and component styling)
  {
    id: 'html-css-lesson-2',
    title: 'Flexbox layout fundamentals',
    full_content: [
      'Flexbox is a one-dimensional layout system that makes it easier to align and distribute space among items in a container.',
      'The main properties are display: flex on the container and flex, justify-content, and align-items on children. These let you build modern navigation bars and card grids with minimal CSS.',
      'MDN examples typically show how small changes to these properties affect alignment and wrapping in real UI snippets.',
    ],
    voice_script:
      'Flexbox helps you align items in a row or column. By setting display flex on a container and using properties like justify-content and align-items, you can build navigation bars and card layouts that respond gracefully to screen size.',
    interactive_task: {
      type: 'code',
      language: 'html-css',
      instructions:
        'Convert the stacked card list into a responsive flex row that wraps on small screens. Center cards when they wrap.',
      starterCode: `<div class="cards">
  <div class="card">Lesson 1</div>
  <div class="card">Lesson 2</div>
  <div class="card">Lesson 3</div>
</div>

<style>
  body { font-family: system-ui, sans-serif; margin: 0; padding: 1.5rem; background: #020617; color: #e5e7eb; }
  .cards { /* TODO: turn into a flex layout */ }
  .card {
    padding: 1rem 1.25rem;
    margin-bottom: 1rem;
    border-radius: 0.75rem;
    background: #0f172a;
  }
</style>
`,
    },
    quiz: {
      questions: [
        {
          id: 'html-css-lesson-2-q1',
          prompt: 'Which declaration turns an element into a flex container?',
          options: [
            'display: grid;',
            'display: inline-block;',
            'display: flex;',
            'display: block;',
          ],
          answerIndex: 2,
          explanation: 'display: flex; activates flex formatting on the container.',
        },
        {
          id: 'html-css-lesson-2-q2',
          prompt: 'Which property controls how flex items are aligned along the main axis?',
          options: ['align-items', 'justify-content', 'flex-wrap', 'align-content'],
          answerIndex: 1,
          explanation: 'justify-content distributes space along the main axis.',
        },
        {
          id: 'html-css-lesson-2-q3',
          prompt:
            'To allow flex items to move onto multiple lines, which property and value combination is correct?',
          options: [
            'flex-wrap: wrap;',
            'flex-flow: column;',
            'align-items: stretch;',
            'flex-direction: row;',
          ],
          answerIndex: 0,
          explanation: 'flex-wrap: wrap; allows items to wrap onto new lines.',
        },
      ],
    },
  },
  {
    id: 'html-css-lesson-3',
    title: 'Responsive typography with rem units',
    full_content: [
      'Using rem units for font-size ties text sizing to the root element, allowing you to scale a whole interface by changing just one value.',
      'Media queries combined with rem-based spacing help layouts adapt gracefully to mobile, tablet, and desktop viewports.',
      'Modern design systems document recommended text scales in a style guide, then reuse those tokens consistently across components.',
    ],
    voice_script:
      'Responsive type often uses rem units so that changing the root font size rescales the whole hierarchy. Combined with media queries, this lets you tune readability on phones, tablets, and large monitors with only a few well-chosen breakpoints.',
    interactive_task: {
      type: 'code',
      language: 'html-css',
      instructions:
        'Refactor the heading and body text to use rem units. Add a simple media query that increases the root font size on large screens.',
      starterCode: `<h1 class="title">Skynetic Course Overview</h1>
<p class="body">
  This paragraph describes what you will learn in this track.
</p>

<style>
  body { font-family: system-ui, sans-serif; margin: 0; padding: 1.5rem; }
  .title { font-size: 32px; }
  .body { font-size: 16px; line-height: 1.6; }
</style>
`,
    },
    quiz: {
      questions: [
        {
          id: 'html-css-lesson-3-q1',
          prompt: 'What does 1rem represent by default in most browsers?',
          options: [
            'The height of the viewport',
            'The font-size of the root <html> element',
            'The font-size of the parent element',
            'One pixel',
          ],
          answerIndex: 1,
          explanation: 'rem is based on the root element’s font-size.',
        },
        {
          id: 'html-css-lesson-3-q2',
          prompt: 'Which tool adjusts layout based on viewport width?',
          options: ['CSS variables', 'Media queries', 'Pseudo-elements', 'Transitions'],
          answerIndex: 1,
          explanation: 'Media queries apply different rules at different viewport sizes.',
        },
        {
          id: 'html-css-lesson-3-q3',
          prompt: 'Why prefer rem units over px for a design system?',
          options: [
            'rem values are always larger',
            'They ignore user preferences',
            'They scale together when the root size changes',
            'They require less CSS',
          ],
          answerIndex: 2,
          explanation: 'Changing the root font-size scales all rem-based sizes consistently.',
        },
      ],
    },
  },
  {
    id: 'html-css-lesson-4',
    title: 'Utility-first styling with Tailwind-like classes',
    full_content: [
      'Utility classes such as p-4, text-sm, and bg-slate-900 capture small, reusable styling decisions that compose into complex designs.',
      'A Tailwind-style approach encourages you to design directly in markup, then extract components only when patterns repeat.',
      'Well-named utilities mirror design tokens like spacing scale, color palette, and typography rhythm.',
    ],
    voice_script:
      'Utility-first CSS uses small, single-purpose classes for padding, colors, and typography. By composing these utilities in your markup, you can prototype quickly and stay aligned with a shared design system.',
    interactive_task: {
      type: 'code',
      language: 'html-css',
      instructions:
        'Style the lesson card using utility-like classes in plain CSS: spacing, rounded corners, and a subtle shadow.',
      starterCode: `<div class="lesson-card">
  <h2>Lesson overview</h2>
  <p>Describe what the learner will achieve by the end of this lesson.</p>
</div>

<style>
  body { font-family: system-ui, sans-serif; margin: 0; padding: 1.5rem; background: #020617; color: #e5e7eb; }
  .lesson-card {
    /* Add padding, border radius, background, and shadow here */
  }
</style>
`,
    },
    quiz: {
      questions: [
        {
          id: 'html-css-lesson-4-q1',
          prompt: 'What is a key benefit of utility-first CSS?',
          options: [
            'It hides all CSS from the markup',
            'It allows rapid iteration using small, composable classes',
            'It eliminates the need for design tokens',
            'It forces you to write long custom selectors',
          ],
          answerIndex: 1,
          explanation: 'Utilities make it easy to mix and match small styling decisions.',
        },
        {
          id: 'html-css-lesson-4-q2',
          prompt: 'Which of the following is most similar to a Tailwind utility?',
          options: [
            '.btn-primary { ... }',
            '.card { ... }',
            '.p-4 { padding: 1rem; }',
            '.navbar { ... }',
          ],
          answerIndex: 2,
          explanation: 'p-4 is a single-purpose padding utility.',
        },
        {
          id: 'html-css-lesson-4-q3',
          prompt: 'Design tokens usually define which aspects of a design system?',
          options: [
            'Build tools',
            'Spacing, color, and typography scales',
            'Database schemas',
            'Deployment pipelines',
          ],
          answerIndex: 1,
          explanation: 'Tokens capture core visual decisions like spacing and color.',
        },
      ],
    },
  },
  {
    id: 'html-css-lesson-5',
    title: 'Accessible color and contrast',
    full_content: [
      'Accessible interfaces use sufficient contrast between text and background to remain readable for users with low vision or on low-quality displays.',
      'Designers often target WCAG contrast ratios, testing primary text and important UI controls against chosen backgrounds.',
      'Color should not be the only channel used to convey information; patterns or text labels provide a non-color backup.',
    ],
    voice_script:
      'Color choices affect readability. Adequate contrast between text and background is essential, and color alone should not carry all meaning. We back up color with labels, icons, or patterns so that everyone can understand the interface.',
    interactive_task: {
      type: 'code',
      language: 'html-css',
      instructions:
        'Adjust the text and background colors of the alert component to improve contrast while keeping a “success” feel.',
      starterCode: `<div class="alert">
  Lesson saved successfully.
</div>

<style>
  body { font-family: system-ui, sans-serif; margin: 0; padding: 1.5rem; background: #020617; }
  .alert {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 9999px;
    background: #22c55e33; /* low-contrast green */
    color: #22c55e;        /* low-contrast text */
  }
</style>
`,
    },
    quiz: {
      questions: [
        {
          id: 'html-css-lesson-5-q1',
          prompt: 'Why is sufficient color contrast important?',
          options: [
            'It reduces file size',
            'It improves readability for many users',
            'It increases animation performance',
            'It makes layouts responsive',
          ],
          answerIndex: 1,
          explanation: 'Contrast directly affects whether text is legible.',
        },
        {
          id: 'html-css-lesson-5-q2',
          prompt: 'Which is a good practice when using color to show status?',
          options: [
            'Rely only on color changes',
            'Add icons or text labels alongside color',
            'Use as many colors as possible',
            'Hide status from screen readers',
          ],
          answerIndex: 1,
          explanation: 'Redundancy ensures meaning is clear even without color.',
        },
        {
          id: 'html-css-lesson-5-q3',
          prompt: 'Which pair is more likely to pass contrast guidelines for body text?',
          options: [
            'Light gray text on white background',
            'Dark gray text on white background',
            'Yellow text on white background',
            'Light gray text on light blue background',
          ],
          answerIndex: 1,
          explanation: 'Dark text on a light background usually yields better contrast.',
        },
      ],
    },
  },
]

// TODO: For brevity, the remaining subjects use focused, concise content blocks
// in the same Khan Academy / MDN-inspired style as above.

export const subjectCourses: SubjectCourse[] = [
  {
    id: 'math',
    subjectId: 'mathematics',
    title: 'Mathematics foundations',
    category: 'School subjects',
    level: 'Core',
    description:
      'Build confidence with linear equations, systems, quadratics, slope, and exponential models.',
    tags: ['Algebra', 'Functions', 'Modeling'],
    lessons: mathLessons,
  },
  {
    id: 'html-css',
    subjectId: 'html-css',
    title: 'HTML & CSS for modern interfaces',
    category: 'Programming',
    level: 'Beginner',
    description:
      'Learn semantic markup, flexbox, responsive typography, utility-first styling, and accessible color.',
    tags: ['HTML', 'CSS', 'Responsive'],
    lessons: htmlCssLessons,
  },
  // Biology, Chemistry, English, Russian, Uzbek, Git/GitHub, Firebase, and MUI
  // can be expanded following the same LessonContent pattern: five lessons each
  // with full_content, voice_script, interactive_task, and a three-question quiz.
]

/**
 * Utility that adapts a LessonContent entry into the runtime Lesson type.
 * This is used by the catalog builder so the rest of the app can keep working
 * with the existing Course/Lesson interfaces.
 */
export const buildLessonsFromContent = (courseId: string, contents: LessonContent[]): Lesson[] =>
  contents.map((item, index) => ({
    id: item.id,
    courseId,
    title: item.title,
    summary: item.full_content[0] ?? '',
    durationMinutes: 18 + index * 4,
    theory: item.full_content,
    examples: [],
    exercises: [
      {
        id: `${item.id}-task`,
        prompt: item.interactive_task.prompt,
        type: 'practice',
        hint:
          'Use the ideas from the lesson above to structure your answer. The AI tutor can help you check your reasoning.',
      },
    ],
    quiz: {
      id: `${item.id}-quiz`,
      title: `${item.title} check`,
      type: 'lesson-review',
      questions: item.quiz.questions,
    },
    sources: ['Skynetic course engine'],
    fullContent: item.full_content,
    voiceScript: item.voice_script,
    interactiveTask: item.interactive_task,
  }))

