export function serviceSessionToItem(session: any) {
  return {
    id: session.id,
    dogName: session.dog.name,
    client: session.dog.owner,
    date: session.date.toISOString().slice(0, 10),
    focus: session.focus,
    outcome: session.outcome,
    generalDescription: session.generalDescription || '',
    dogBreed: session.dogBreed || session.dog.breed,
    learningHistory: session.learningHistory || '',
    situation: session.situation || '',
    nutrition: session.nutrition || '',
    health: session.health || '',
    hormoneAnalysis: session.hormoneAnalysis || '',
    activation: session.activation || '',
    stimulusAnalysis: session.stimulusAnalysis || '',
    prescribedPlan: session.prescribedPlan || '',
  };
}
