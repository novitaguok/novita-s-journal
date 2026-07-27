---
title: "From Input to Impact: Driving Results with Prompt Engineering (Part 1: Foundational & Static Patterns)"
datePublished: 2026-07-27T02:44:21.068Z
cuid: cms2migtl00000akj1erqdhik
slug: from-input-to-impact-driving-results-with-prompt-engineering-part-1-foundational-static-patterns

---

**Prompt engineering** is the art and science of crafting inputs (prompts) to get clear, accurate, and useful responses from artificial intelligence models.

Instead of treating an AI like a standard search engine, prompt engineering treats it like a skilled assistant: the quality of the output directly depends on how you frame the instructions, context, and format.

### How Generative AI Work?

A brief answer: **probability**.

Generative AI is based on mathematical statistical theory. First, a model is trained on a massive dataset. During this process, the model learns the patterns of how data appears and how it correlates with other data within specific contexts.

Through this learning process, the model builds a distributed probability system. When given a prompt, it generates new content by continuously predicting the next most probable output.

Let's see the example below.

![](https://cdn.hashnode.com/uploads/covers/69f580b8ec32cba9e5aa8278/bdc22c82-e8a9-43e0-8d8f-d2a58450d6dc.png align="center")

A generative AI model processes the whole prompt to understand the correlation between every word. This allows the model to provide a context-relevant response.

What is interesting is that the responses provided are flexible and varied, even with the same model and prompt. This is due to the random seed that is used for randomization when choosing the output.

![](https://cdn.hashnode.com/uploads/covers/69f580b8ec32cba9e5aa8278/fc6c547d-5082-484e-87f2-ea1d3715b44c.png align="center")

To learn more about how Generative AI works, you can check out this reference: [Transformers (how LLMs work) explained visually](https://www.youtube.com/watch?si=IgjRhGGCfdXETPzr&v=wjZofJX0v4M&feature=youtu.be).

![](https://cdn.hashnode.com/uploads/covers/69f580b8ec32cba9e5aa8278/d512cfa0-caf8-456d-a627-9baa2ef9a154.png align="center")

### Challenges

1.  Training Dataset Cut-Off Date  
    Generative AI models are trained on massive datasets. However, these datasets are static and do not contain real-time updates. For example, OpenAI's GPT-4 has a knowledge cut-off date of October 2023, meaning the model lacks information about events or developments beyond that date.
    
2.  Bias  
    A model's output depends directly on the quality and balance of its training data, which is rarely free from bias. For instance, if you ask an AI to compare several products, but the training data contains significantly more positive information about Product A than its competitors, the model's response will likely lean in favor of Product A.
    
3.  Hallucinations  
    It is crucial for Generative AI users to understand that models generate responses by predicting the most probable next word, not by retrieving verified facts. This probabilistic nature can lead to "hallucinations"—instances where the model confidently generates incorrect or completely fabricated information.
    

### Best Practises

1.  Role  
    Define a specific persona or expert role for the AI to adopt. This helps the model tailor its tone, style, and complexity to match the target audience's level of understanding.
    
2.  Objective  
    Provide clear, direct instructions or goals. Setting explicit expectations reduces ambiguity and prevents the model from generating overly broad or generic answers.
    
3.  Context  
    Supply essential background data or relevant details for the AI to work with. Without sufficient context, the model will make assumptions to "fill in the gaps," which often leads to inaccurate or irrelevant results.
    
4.  Constraint / Limitation  
    Establish strict boundaries, such as response length, formatting rules, or topics to avoid. Setting clear limits keeps the model focused only on delivering what you need.
    

* * *

# Prompt Engineering Patterns

Pattern: The Persona

Defining Personas Using personas helps the AI model understand context and constraints, ensuring the generated output is more relevant, specific, and tailored to a particular viewpoint. A simple framework for this is the **R-I-C formula**:

*   **Role:** the job or identity (e.g., "Act as a senior software engineer").
    
*   **Identity:** key demographic and background details (e.g., "You have 7 years of experience writing in Kotlin and love teaching beginners").
    
*   **Communication style:** the tone, formatting, and behavior (e.g., "Keep explanations simple, encouraging, and end with a brief question").
    

**Example Formulas**

1.  The Expert/Professional Pattern  
    "Act as a \[Profession\] specializing in \[Specialty\]. You have \[Number\] years of experience. Please answer my questions using \[Tone/Style, e.g., clear, concise, professional English\]."
    
2.  The Fictional/Creative Pattern  
    "You are \[Character Name/Description\] from \[Context/Setting\]. Your personality is \[Traits\]. When you speak, use the vocabulary and voice of \[Character/Archetype\]."
    

## Pattern: The Audience/Reverse Persona

By specifying the target audience, the AI model adjusts its tone, terminology, and detail level to match the user's specific background and depth of knowledge.

**Example Formula**

"Explain \[Topic\] to me as if I am \[Audience Profile, e.g., a five-year-old child / an anxious first-time buyer\]. Use simple terms and avoid complex jargon."

## Pattern: Few-Shot

In simple terms, this pattern provides several input-output examples (shots). It is exceptionally helpful for tasks requiring a specific output format, such as information extraction or structured content creation.

*   **Example 1 Input:** "My internet keeps dropping every five minutes."
    
*   **Example 1 Output:** Category: Technical Issue
    
*   **Example 2 Input:** "Where is the refund status for my last order?"
    
*   **Example 2 Output:** Category: Billing Inquiry
    
*   **Your Turn Input:** "I cannot log into my mobile app account."
    
*   **Your Turn Output:** `[Model fills in: Category: Technical Issue]`
    

Or you can show the model the exact structural layout you expect back. E.g.,

*   **Example 1 Input:** "Send an email to John Smith at [john@example.com](mailto:john@example.com) about the meeting."
    
*   **Example 1 Output:** `{"name": "John Smith", "email": "`[`john@example.com`](mailto:john@example.com)`", "topic": "meeting"}`
    
*   **Example 2 Input:** "Message support for Sarah Jenkins regarding her subscription at [sarah@test.org](mailto:sarah@test.org)."
    
*   **Example 2 Output:** `{"name": "Sarah Jenkins", "email": "`[`sarah@test.org`](mailto:sarah@test.org)`", "topic": "subscription"}`
    
*   **Your Turn Input:** "Reach out to Alex Brown ([alex.b@sample.net](mailto:alex.b@sample.net)) to schedule an interview."
    
*   **Your Turn Output:** \[Model fills in: `{"name": "Alex Brown", "email": "`[`alex.b@sample.net`](mailto:alex.b@sample.net)`", "topic": "interview"}`\]
    

## Pattern: Chain-of-Thought

Research shows that Generative AI models are significantly more accurate when guided through a step-by-step reasoning process rather than asked to jump straight to a final answer. We can implement this in two ways:

1.  **Instructing the AI directly** to show its step-by-step reasoning (e.g., *"Think step-by-step before providing the final answer"*).
    
2.  **Providing worked-out examples** that demonstrate the complete reasoning process.
    

While both patterns guide the AI using examples, Few-Shot and Chain-of-Thought patterns differ in depth and purpose. Few-Shot Prompting simply provides input-output pairs to show the expected final format, helping the AI map a specific input to a desired output structure. On the other hand, Chain-of-Thought Prompting goes a step further by demonstrating the step-by-step reasoning behind an answer, guiding the model on **how** to solve the problem logically before reaching a conclusion.

**Example Prompt:**

*   `Q: A local bakery had 40 croissants at 8:00 AM. They sold 25 during the morning rush and baked a fresh batch of 30 at noon. How many croissants are available now?`
    
*   `A: The bakery started with 40 croissants. They sold 25, leaving 40 - 25 = 15. Then they baked 30 more, making 15 + 30 = 45. The answer is 45.`
    

**Target Question:** `A store receives a shipment of 150 phones. They sell 45 on Monday and 30 on Tuesday. On Wednesday, 10 damaged units are returned to stock. How many sellable phones remain?`

**AI Output:**

*   The store started with an initial inventory of 150 phones.
    
*   On Monday, 45 phones were sold: 150 - 45 = 105.
    
*   On Tuesday, 30 phones were sold: 105 - 30 = 75.
    
*   On Wednesday, 10 returned units were added back to stock: 75 + 10 = 85.
    
*   **The answer is 85 sellable phones.**
    

## Pattern: ReAct

As Generative AI users, we can empower models to utilize external tools when generating responses. **ReAct**—short for **Reasoning and Acting**—is an advanced evolution of the Chain-of-Thought pattern. Beyond guiding the model to process tasks step-by-step, ReAct enables the model to take actions—such as querying external APIs or databases—to retrieve real-time information it doesn't natively possess.

![](https://cdn.hashnode.com/uploads/covers/69f580b8ec32cba9e5aa8278/95836643-b698-4153-9389-afb16aaeb5ce.png align="center")

The ReAct framework operates through three core components:

*   **Thought:** The model formulates a step-by-step plan based on the user's prompt and the context currently available.
    
*   **Action:** The model executes a specific task to gather additional information, such as making an external API call or performing a search.
    
*   **Observation:** The model analyzes the data retrieved from the action and uses it to synthesize the final response.
    

**Example**

```plaintext
Question: What is the current market capitalization difference between Apple and Microsoft in USD?

Thought 1: I need to fetch the real-time market cap of Apple (AAPL).
Action 1: Search[Apple AAPL current market capitalization USD]
Observation 1: Apple's market capitalization is approximately $3.45 trillion USD.

Thought 2: I need to fetch the real-time market cap of Microsoft (MSFT).
Action 2: Search[Microsoft MSFT current market capitalization USD]
Observation 2: Microsoft's market capitalization is approximately $3.12 trillion USD.

Thought 3: I need to subtract Microsoft's market cap from Apple's market cap to find the difference.
Action 3: Calculator[3.45 - 3.12]
Observation 3: 0.33

Thought 4: I now have the final calculation in trillions.
Final Answer: The current market capitalization difference between Apple and Microsoft is approximately ($330 billion USD).
```

* * *

> **The Golden Rule:** The clearer your instructions, context, and examples, the less room the AI has to make assumptions or hallucinate.