# CoLab Market Opportunity Intelligence

**An independent strategy case by Felipe Mattos** for the [Business Strategy Analyst role at CoLab](https://job-boards.greenhouse.io/colabsoftware/jobs/5432674008).

## Question
With existing CoLab customer examples across multiple manufacturing verticals, where should the team focus **the next market-learning sprint**? This is intentionally not a TAM forecast or a claim about internal company priorities.

## What is real, and what is judgment?
- **Publicly sourced:** CoLab's existing product scope, cited customer industries, named case studies and the Bombardier AI partnership. URLs are in `data/sources.json` and the assumptions CSV.
- **Illustrative judgments:** 1–5 scores for fit, public evidence, impact, sales accessibility, and testability. These are not measured market values.
- **Unknown:** TAM/SAM/SOM, contract sizes, unit economics, pipeline, GTM ownership, win rates, sales cycles, implementation cost, actual company priorities.

## Model
Five segment profiles are stored in `data/opportunity_assumptions.csv`. The browser calculates a weighted arithmetic mean using five changeable weights (normalized by their sum). The order **may change** when weights change. Sliders do not imply statistically measured precision. The purpose is to make a transparent decision conversation possible.

## How to run
Serve repository root via any static server, e.g. `python -m http.server 8000`. Open `http://localhost:8000`.
Run quality tests: `python -m unittest discover -s tests -v`.
Check JavaScript syntax: `node --check app.js`.

## Recommended strategic next step
Use a four-week discovery sprint to compare one adjacent industrial equipment lane with automotive and aerospace benchmarks, using evidence from internal functions before committing resources. Update the ranking with verified inputs. If internal data disagrees, change the decision.

## Sources
See `data/sources.json`, and direct references linked on the page. All images and interface art are original HTML/CSS; this page is not CoLab-sponsored.

## Career framing
Felipe Mattos · [LinkedIn](https://www.linkedin.com/in/felipervm) · felipervm22@gmail.com. This case is a portfolio sample demonstrating research, ambiguity handling, strategy framing, business communication and analytical rigor—not an official product proposal.

## Alignment with the Business Strategy Analyst job description
- **Industry/market research:** five manufacturing segments and primary-source company/customer signals.
- **Ambiguous problem framing:** the question is where to spend the next **discovery sprint**, not a fabricated TAM ranking.
- **Synthesis:** weighted model, scenario sensitivity and executive-ready recommendation.
- **Cross-functional execution:** structured questions for Sales, Product, Marketing, Customer Success and Solutions Engineering.
- **Competitive analysis:** the pilot proposes a buyer-alternative research step; **the V1 does not claim to have completed competitor benchmarking**.
- **Action:** an explicit 4-week validation plan, stopping rules and evidence that would change the decision.

**Important limitation:** No customer interviews, internal pipeline, competitive win/loss data, market-size study, or internal CoLab access were available. These are inputs to gather, not results of this case.
