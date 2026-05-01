import os
from typing import List
from pydantic import BaseModel, Field
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.output_parsers import StrOutputParser
from vector_store import vector_store

# Models for structured output
class QuestionOption(BaseModel):
    label: str = Field(description="A, B, C or D")
    text: str = Field(description="The option content")

class Question(BaseModel):
    id: str = Field(description="Unique string ID for the question (e.g., q_1)")
    question: str = Field(description="The question text")
    type: str = Field(description="The type of question (mcq or short_answer)")
    options: List[QuestionOption] = Field(default=[], description="List of 4 options (required for mcq, empty for short_answer)")
    answer: str = Field(description="The correct answer (A/B/C/D for mcq, or a sample answer for short_answer)")
    explanation: str = Field(description="A brief explanation of why this answer is correct or what points should be covered")

class TestGenerationResponse(BaseModel):
    title: str = Field(description="A descriptive title for the test")
    questions: List[Question] = Field(description="List of questions")

# Flashcard Models
class Flashcard(BaseModel):
    front: str = Field(description="The question or term on the front of the card")
    back: str = Field(description="The answer or definition on the back of the card")

class FlashcardGenerationResponse(BaseModel):
    title: str = Field(description="A title for the flashcard set")
    flashcards: List[Flashcard] = Field(description="List of flashcards")

class GenerationService:
    def __init__(self):
        # We'll reload from env every time if needed or just use current session
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("⚠️ [ERROR] GROQ_API_KEY not found in environment!")
            
        # Using Llama 3.3 70B on Groq for state-of-the-art results
        self.llm = ChatGroq(
            model_name="llama-3.3-70b-versatile",
            groq_api_key=api_key,
            temperature=0.3,
            max_tokens=None,
            timeout=60,
            max_retries=2
        )
        self.test_parser = PydanticOutputParser(pydantic_object=TestGenerationResponse)
        self.flashcard_parser = PydanticOutputParser(pydantic_object=FlashcardGenerationResponse)

    async def generate_test(self, chroma_collection: str, num_questions: int = 10, difficulty: str = "medium", topic: str = "", question_type: str = "mcq") -> TestGenerationResponse:
        try:
            # 1. Retrieve context
            context = vector_store.get_context(chroma_collection, k=15)
            if not context:
                context = "No specific content found. Generate general questions about the topic if possible."
            
            # 2. Refine focus based on topic
            topic_str = f"Specifically focusing on: {topic}" if topic else ""
            
            # 3. Build Prompt
            prompt = ChatPromptTemplate.from_template(
                "You are a world-class educational examiner.\n"
                "Your goal is to create a {difficulty} difficulty test base on the provided text.\n"
                "{topic_str}\n\n"
                "### Guidelines:\n"
                "- Create exactly {num_questions} questions.\n"
                "- Question Type: {question_type}. \n"
                "  - If 'mcq', ensure 4 options (A, B, C, D) and specify the correct label.\n"
                "  - If 'short_answer', provide a clear sample answer.\n"
                "  - If 'mixed', provide a balance of both types.\n"
                "- Ensure accuracy and pedagogical value.\n"
                "- Return ONLY valid JSON matching the format below.\n\n"
                "### Document Context:\n{context}\n\n"
                "### JSON Format Instructions:\n{format_instructions}"
            )
            
            # 4. Chain & Execute
            print(f"🧠 [AI] Generating {difficulty} test ({num_questions} questions, type: {question_type}) for {chroma_collection}...")
            chain = prompt | self.llm | self.test_parser
            
            result = await chain.ainvoke({
                "num_questions": num_questions,
                "difficulty": difficulty,
                "topic_str": topic_str,
                "question_type": question_type,
                "context": context,
                "format_instructions": self.test_parser.get_format_instructions()
            })
            
            return result
        except Exception as e:
            print(f"❌ [AI] Error during test generation: {str(e)}")
            raise e

    async def generate_flashcards(self, chroma_collection: str, num_cards: int = 15, difficulty: str = "medium", topic: str = "") -> FlashcardGenerationResponse:
        try:
            # 1. Retrieve context
            context = vector_store.get_context(chroma_collection, k=15)
            
            # 2. Refine focus
            topic_str = f"Focusing on: {topic}" if topic else ""
            difficulty_instr = "Create simpler, foundational cards." if difficulty == "easy" else "Create challenging, in-depth cards." if difficulty == "hard" else "Create a balanced set of cards."

            # 3. Build Prompt
            prompt = ChatPromptTemplate.from_template(
                "You are a study aid creator.\n"
                "Create a set of {num_cards} flashcards based on the following document content.\n"
                "{difficulty_instr}\n"
                "{topic_str}\n\n"
                "Guidelines:\n"
                "- Cover key terms, concepts, and intricate details.\n"
                "- Keep cards concise yet informative.\n"
                "- Use ONLY valid JSON.\n\n"
                "Document Context:\n{context}\n\n"
                "{format_instructions}"
            )
            
            # 4. Chain & Execute
            print(f"🧠 [AI] Generating {num_cards} flashcards ({difficulty}) for {chroma_collection}...")
            chain = prompt | self.llm | self.flashcard_parser
            
            result = await chain.ainvoke({
                "num_cards": num_cards,
                "difficulty_instr": difficulty_instr,
                "topic_str": topic_str,
                "context": context,
                "format_instructions": self.flashcard_parser.get_format_instructions()
            })
            
            return result
        except Exception as e:
            print(f"❌ [AI] Error during flashcard generation: {str(e)}")
            raise e

    async def generate_summary(self, text: str) -> str:
        try:
            prompt = ChatPromptTemplate.from_template(
                "You are an expert summarizer. Provide a comprehensive but concise summary of the following text.\n"
                "The summary should depend on the length of the text but not exceed 1000 words if the document is long.\n"
                "Use markdown formatting: use bullet points for lists, bold important terms, and use headers (##) for sections to make it readable.\n"
                "Focus on the main ideas and key takeaways.\n\n"
                "TEXT:\n{text}\n\nSUMMARY:"
            )
            print("🧠 [AI] Generating document summary...")
            chain = prompt | self.llm | StrOutputParser()
            
            # Since document text can be very long, we'll summarize the first 15000 characters to save tokens and time if it's too large
            truncated_text = text[:15000] if len(text) > 15000 else text
            result = await chain.ainvoke({"text": truncated_text})
            return result
        except Exception as e:
            print(f"❌ [AI] Error during summary generation: {str(e)}")
            return "Summary could not be generated."

generation_service = GenerationService()
