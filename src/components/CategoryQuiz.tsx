import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: { label: string; value: string; icon?: string }[];
}

interface CategoryQuizProps {
  category: string;
  onComplete: (answers: Record<string, string>) => void;
  onCancel: () => void;
}

const quizData: Record<string, QuizQuestion[]> = {
  venue: [
    {
      id: "setting",
      question: "What type of setting do you prefer?",
      options: [
        { label: "🏰 Grand & Royal", value: "grand" },
        { label: "🌿 Garden & Outdoor", value: "garden" },
        { label: "🏖️ Beach & Waterfront", value: "beach" },
        { label: "🏛️ Intimate & Boutique", value: "intimate" },
      ],
    },
    {
      id: "guest_count",
      question: "How many guests are you expecting?",
      options: [
        { label: "Under 100", value: "small" },
        { label: "100–300", value: "medium" },
        { label: "300–500", value: "large" },
        { label: "500+", value: "xlarge" },
      ],
    },
    {
      id: "amenities",
      question: "What matters most to you?",
      options: [
        { label: "🍽️ In-house Catering", value: "catering" },
        { label: "🅿️ Ample Parking", value: "parking" },
        { label: "🏨 Stay Arrangements", value: "stay" },
        { label: "🎨 Decoration Flexibility", value: "decor" },
      ],
    },
  ],
  dress: [
    {
      id: "style",
      question: "What style speaks to you?",
      options: [
        { label: "👗 Traditional / Lehenga", value: "traditional" },
        { label: "✨ Indo-Western Fusion", value: "fusion" },
        { label: "🌸 Pastel & Minimal", value: "minimal" },
        { label: "👑 Heavy & Royal", value: "royal" },
      ],
    },
    {
      id: "color",
      question: "Which colour palette do you prefer?",
      options: [
        { label: "❤️ Classic Red & Maroon", value: "red" },
        { label: "💗 Pastels & Pinks", value: "pastel" },
        { label: "💛 Gold & Ivory", value: "gold" },
        { label: "💜 Bold & Vibrant", value: "bold" },
      ],
    },
    {
      id: "fit",
      question: "What fit do you prefer?",
      options: [
        { label: "Flared & Voluminous", value: "flared" },
        { label: "Fitted & Sleek", value: "fitted" },
        { label: "A-Line & Flowy", value: "aline" },
        { label: "Mermaid / Fish-cut", value: "mermaid" },
      ],
    },
  ],
  catering: [
    {
      id: "cuisine",
      question: "What cuisine type do you prefer?",
      options: [
        { label: "🍛 Traditional Indian", value: "indian" },
        { label: "🌍 Multi-Cuisine", value: "multi" },
        { label: "🥗 Modern / Fusion", value: "fusion" },
        { label: "🌱 Vegetarian / Vegan", value: "veg" },
      ],
    },
    {
      id: "service",
      question: "What service style do you want?",
      options: [
        { label: "🍽️ Buffet Style", value: "buffet" },
        { label: "🧑‍🍳 Live Counters", value: "live" },
        { label: "🥂 Sit-down / Plated", value: "plated" },
        { label: "🎪 Food Stalls / Street", value: "stalls" },
      ],
    },
    {
      id: "priority",
      question: "What's your top priority?",
      options: [
        { label: "Variety & Options", value: "variety" },
        { label: "Presentation & Plating", value: "presentation" },
        { label: "Taste & Authenticity", value: "taste" },
        { label: "Dietary Accommodations", value: "dietary" },
      ],
    },
  ],
  photography: [
    {
      id: "photo_style",
      question: "What photography style do you love?",
      options: [
        { label: "📸 Candid & Natural", value: "candid" },
        { label: "🎬 Cinematic & Dramatic", value: "cinematic" },
        { label: "📷 Traditional & Posed", value: "traditional" },
        { label: "🎨 Artistic & Editorial", value: "editorial" },
      ],
    },
    {
      id: "coverage",
      question: "What coverage do you need?",
      options: [
        { label: "Full Day Coverage", value: "full" },
        { label: "Pre-wedding + Wedding", value: "pre_wedding" },
        { label: "Multi-day (all events)", value: "multi" },
        { label: "Highlights Only", value: "highlights" },
      ],
    },
    {
      id: "deliverables",
      question: "What deliverables matter most?",
      options: [
        { label: "📹 Video + Photos", value: "both" },
        { label: "📸 Photos Only", value: "photos" },
        { label: "🎥 Cinematic Film", value: "film" },
        { label: "🚁 Drone Shots", value: "drone" },
      ],
    },
  ],
  decoration: [
    {
      id: "theme",
      question: "What decoration theme appeals to you?",
      options: [
        { label: "🌸 Floral & Romantic", value: "floral" },
        { label: "✨ Glamorous & Luxe", value: "glam" },
        { label: "🍃 Rustic & Natural", value: "rustic" },
        { label: "🎨 Themed & Unique", value: "themed" },
      ],
    },
    {
      id: "focus",
      question: "Which area matters most?",
      options: [
        { label: "Stage / Mandap", value: "stage" },
        { label: "Entrance & Pathway", value: "entrance" },
        { label: "Table Settings", value: "tables" },
        { label: "Lighting & Ambience", value: "lighting" },
      ],
    },
    {
      id: "vibe",
      question: "What vibe do you want?",
      options: [
        { label: "Elegant & Sophisticated", value: "elegant" },
        { label: "Fun & Colourful", value: "fun" },
        { label: "Minimal & Chic", value: "minimal" },
        { label: "Grand & Opulent", value: "grand" },
      ],
    },
  ],
  music: [
    {
      id: "music_type",
      question: "What music style do you want?",
      options: [
        { label: "🎵 Live Band", value: "band" },
        { label: "🎧 DJ & Electronic", value: "dj" },
        { label: "🎻 Classical / Instrumental", value: "classical" },
        { label: "🎤 Bollywood & Sangeet", value: "bollywood" },
      ],
    },
    {
      id: "energy",
      question: "What energy level for the celebration?",
      options: [
        { label: "🔥 High Energy Party", value: "high" },
        { label: "💫 Elegant & Classy", value: "elegant" },
        { label: "🎶 Mix of Both", value: "mix" },
        { label: "🧘 Calm & Soothing", value: "calm" },
      ],
    },
    {
      id: "extras",
      question: "Any special additions?",
      options: [
        { label: "Sound & Light System", value: "sound" },
        { label: "LED Dance Floor", value: "led" },
        { label: "Fireworks / Cold Pyro", value: "pyro" },
        { label: "Fog & Special Effects", value: "fog" },
      ],
    },
  ],
};

// Fallback quiz for custom categories
const defaultQuiz: QuizQuestion[] = [
  {
    id: "quality",
    question: "What quality level are you looking for?",
    options: [
      { label: "💎 Premium & Luxury", value: "premium" },
      { label: "⭐ High Quality", value: "high" },
      { label: "👍 Good Value", value: "value" },
      { label: "💰 Budget Friendly", value: "budget" },
    ],
  },
  {
    id: "style_pref",
    question: "What style do you prefer?",
    options: [
      { label: "Traditional", value: "traditional" },
      { label: "Modern", value: "modern" },
      { label: "Fusion", value: "fusion" },
      { label: "Minimal", value: "minimal" },
    ],
  },
  {
    id: "priority_pref",
    question: "What's your top priority?",
    options: [
      { label: "Quality", value: "quality" },
      { label: "Price", value: "price" },
      { label: "Reviews & Reputation", value: "reviews" },
      { label: "Availability", value: "availability" },
    ],
  },
];

export default function CategoryQuiz({ category, onComplete, onCancel }: CategoryQuizProps) {
  const questions = quizData[category] || defaultQuiz;
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = questions[currentQ];
  const isLast = currentQ === questions.length - 1;
  const progress = ((currentQ + 1) / questions.length) * 100;

  const selectAnswer = (value: string) => {
    const updated = { ...answers, [question.id]: value };
    setAnswers(updated);

    if (isLast) {
      setTimeout(() => onComplete(updated), 400);
    } else {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    }
  };

  return (
    <Card className="shadow-elegant border-0 overflow-hidden">
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <Badge variant="outline">
            Question {currentQ + 1} of {questions.length}
          </Badge>
        </div>
        <CardTitle className="text-xl">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => selectAnswer(option.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all hover:border-primary hover:bg-primary/5 ${
                answers[question.id] === option.value
                  ? "border-primary bg-primary/10"
                  : "border-border"
              }`}
            >
              <span className="font-medium text-foreground">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={currentQ > 0 ? () => setCurrentQ(currentQ - 1) : onCancel}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentQ > 0 ? "Previous" : "Cancel"}
          </Button>
          {answers[question.id] && !isLast && (
            <Button variant="outline" onClick={() => setCurrentQ(currentQ + 1)}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
