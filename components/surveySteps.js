import { MARKET_OPTIONS } from "@/lib/markets";

export function getInitialForm() {
  return {
    marketInterest: "",
    participationModel: "",
    basedNear: "",
    capitalAvailable: "",
    ownCapital: "",
    investTimeline: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    website: "",
  };
}

/** @param {"list" | "map"} marketPresentation */
export function buildSurveySteps(marketPresentation = "list") {
  const marketStep =
    marketPresentation === "map"
      ? {
          id: "marketInterest",
          type: "market_map",
          title: "Which market are you interested in?",
          subtitle: "Tap a pin on the map to select a city, or choose “My city is not listed” below.",
        }
      : {
          id: "marketInterest",
          type: "choice",
          title: "Which market are you interested in?",
          options: [
            ...MARKET_OPTIONS.map((m) => ({ value: m.value, label: m.label })),
            { value: "other_city", label: "My city is not listed" },
          ],
        };

  return [
    marketStep,
    {
      id: "participationModel",
      type: "choice",
      title: "Which of these is closer to what you have in mind?",
      options: [
        { value: "hands_on_run_market", label: "I want to be hands on and run the market" },
        {
          value: "invest_solve_team",
          label: "I want to invest and have Solve\u2019s team run it",
        },
        {
          value: "unsure_both",
          label: "I am not sure yet, I want to understand both",
        },
      ],
    },
    {
      id: "basedNear",
      type: "choice",
      title: "Where would you be based?",
      options: [
        { value: "live_in_market", label: "I live in that market now" },
        { value: "within_hour", label: "Within about an hour of it" },
        { value: "would_relocate", label: "I would relocate for this" },
        { value: "remote", label: "I would be remote" },
      ],
    },
    {
      id: "capitalAvailable",
      type: "choice",
      title: "How much capital do you have available to invest?",
      options: [
        { value: "under_250k", label: "Under $250,000" },
        { value: "250k_500k", label: "$250,000 to $500,000" },
        { value: "500k_750k", label: "$500,000 to $750,000" },
        { value: "750k_1m", label: "$750,000 to $1,000,000" },
        { value: "1m_plus", label: "$1,000,000+" },
      ],
    },
    {
      id: "ownCapital",
      type: "choice",
      title: "Is this your own capital?",
      options: [
        { value: "mine_liquid_now", label: "Yes, mine and liquid now" },
        { value: "mine_sell_or_borrow", label: "Mine, but I would sell or borrow against an asset" },
        { value: "raise_from_others", label: "I would raise it from other investors" },
        { value: "not_sure_yet", label: "Not sure yet" },
      ],
    },
    {
      id: "investTimeline",
      type: "choice",
      title: "How soon are you looking to invest?",
      options: [
        { value: "ready_now", label: "Ready now" },
        { value: "within_three_months", label: "Within three months" },
        { value: "three_to_six_months", label: "Three to six months" },
        { value: "still_exploring", label: "Still exploring" },
      ],
    },
    {
      id: "contact",
      type: "contact",
      title: "How can we reach you?",
      subtitle:
        "Enter your details so we can follow up after you watch the overview and book a call.",
    },
  ];
}
