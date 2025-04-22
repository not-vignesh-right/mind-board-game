import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { UserContext } from "@/App";
import { Button } from "@/components/ui/button";
import Leaderboard from "@/components/Leaderboard";
import LoadingOverlay from "@/components/LoadingOverlay";
import ScoreBar from "@/components/ScoreBar";

export default function Results() {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  const { username } = useContext(UserContext);
  const battleId = Number(id);

  const { data: results, isLoading } = useQuery({
    queryKey: [`/api/battles/${battleId}/results`],
    enabled: !!battleId
  });

  if (isLoading) {
    return <LoadingOverlay message="Loading results..." description="Please wait while we gather the judging results" />;
  }

  if (!results) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold">Results not found</h2>
        <p className="text-gray-600 mt-2 mb-8">We couldn't find the results for this battle</p>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );
  }
  
  const { battle, scores } = results;
  const userWon = battle.userWon;
  const displayOpponentType = battle.opponentType === "ai" ? "AI Opponent" : "Human Opponent";

  return (
    <div className="max-w-6xl mx-auto">
      {/* Results Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-heading font-bold mb-4">Battle Results</h2>
        <p className="text-lg text-gray-600 mb-8">The AI has judged both solutions based on originality, logic, and expression.</p>
        
        {/* Battle prompt recap */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 inline-block">
          <p className="text-sm text-gray-500 font-medium">The Challenge Was:</p>
          <p className="text-lg text-primary font-semibold">{battle.prompt}</p>
        </div>
      </div>
      
      {/* Winner announcement */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl shadow-md p-8 mb-12 text-center">
        <div className={`inline-block ${userWon ? 'bg-green-500' : 'bg-amber-500'} text-white text-sm font-bold px-3 py-1 rounded-full mb-4`}>
          {userWon ? 'YOU WIN!' : 'AI WINS!'}
        </div>
        <h3 className="text-2xl font-heading font-bold mb-2">
          {userWon ? 'Congratulations!' : 'Good effort!'}
        </h3>
        <p className="text-lg text-gray-600 mb-6">
          {userWon 
            ? 'Your creative solution was judged to be more original and well-expressed.' 
            : 'The AI solution was judged to be more creative this time.'}
        </p>
        
        {/* Winner score visualization */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              {(battle.userScore / 10).toFixed(1)}
            </div>
            <div className="mx-4 font-heading font-bold text-xl text-neutral-dark">VS</div>
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
              {(battle.aiScore / 10).toFixed(1)}
            </div>
          </div>
        </div>
        
        <Button 
          className="bg-accent hover:bg-accent/90 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300"
          onClick={() => navigate("/")}
        >
          Start New Battle
        </Button>
      </div>
      
      {/* Detailed Scoring */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* User Score Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-primary text-white py-3 px-4">
            <h3 className="font-heading font-semibold">Your Solution</h3>
          </div>
          <div className="p-6">
            <div className="border border-gray-200 rounded-lg p-4 mb-6 text-sm max-h-48 overflow-auto">
              {battle.userSolution}
            </div>
            
            {/* Score breakdown */}
            <div className="space-y-4">
              <ScoreBar 
                label="Originality" 
                score={scores.userOriginality} 
                color="primary"
                feedback={scores.userOriginalityFeedback}
              />
              
              <ScoreBar 
                label="Logic" 
                score={scores.userLogic} 
                color="primary"
                feedback={scores.userLogicFeedback}
              />
              
              <ScoreBar 
                label="Expression" 
                score={scores.userExpression} 
                color="primary"
                feedback={scores.userExpressionFeedback}
              />
            </div>
          </div>
        </div>
        
        {/* Opponent Score Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-secondary text-white py-3 px-4">
            <h3 className="font-heading font-semibold">{displayOpponentType}'s Solution</h3>
          </div>
          <div className="p-6">
            <div className="border border-gray-200 rounded-lg p-4 mb-6 text-sm max-h-48 overflow-auto">
              {battle.aiSolution}
            </div>
            
            {/* Score breakdown */}
            <div className="space-y-4">
              <ScoreBar 
                label="Originality" 
                score={scores.aiOriginality} 
                color="secondary"
                feedback={scores.aiOriginalityFeedback}
              />
              
              <ScoreBar 
                label="Logic" 
                score={scores.aiLogic} 
                color="secondary"
                feedback={scores.aiLogicFeedback}
              />
              
              <ScoreBar 
                label="Expression" 
                score={scores.aiExpression} 
                color="secondary"
                feedback={scores.aiExpressionFeedback}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Judge Commentary */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-12">
        <h3 className="text-xl font-heading font-bold mb-4">AI Judge Commentary</h3>
        <div className="border-l-4 border-accent pl-4 py-2">
          <p className="text-gray-700 italic">{scores.judgeFeedback}</p>
        </div>
      </div>
      
      <Leaderboard />
    </div>
  );
}
