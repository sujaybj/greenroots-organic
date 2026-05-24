# Literature Gap Analysis Tool Plan

## Goal Description
Build a prompt-engineered workflow pipeline in Python to analyze 15 literature papers on speculative anti-gravity concepts. The pipeline will systematically extract methodological limitations, cluster thematic groupings, and generate candidate research gaps. 

## User Review Required
> [!IMPORTANT]
> Before we write code, I need you to confirm:
> 1. **Project Directory**: Where on your computer should I build this? (e.g., `C:\Users\sujay\Desktop\anti-gravity-lit-finder`).
> 2. **LLM Provider**: Which API will you be using for the prompts (OpenAI, Anthropic, or something else)?
> 3. **Data**: Please provide the remaining 10 papers when you are ready, or tell me if you'd like to scaffold the Python app with the 5 prototype papers first.

## Proposed Changes
We will create a foundational Python application with the following components:

### Core Pipeline
#### [NEW] `requirements.txt`
Dependencies such as `openai`, `anthropic`, `pydantic`, `python-dotenv` for API calling and payload validation.

#### [NEW] `main.py`
The orchestrator script that runs Stage 1 (Extraction), Stage 2 (Clustering), and Stage 3 (Gap Identification) sequentially.

#### [NEW] `prompts.py`
A module strictly for storing our complex prompt templates to ensure logic is kept separate from execution.

#### [NEW] `data/`
A directory to store the input abstracts (e.g., `input_papers.json`) and the output extractions (e.g., `extraction_results.csv`, `generated_gaps.md`).

## Verification Plan
### Automated Tests
- We will perform a dry-run of the pipeline exclusively on the 5 prototype papers.
- We will verify that the LLM correctly returns valid JSON for Stage 1.
- We will visually inspect the output of the gap generation to ensure it matches the constraints (no science-fiction claims, speculative labeling).
