"use client";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

import outputs from "@/amplify_outputs.json";
import { Amplify } from "aws-amplify";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function SamplePage() {
  const [faqs, setFaqs] = useState<Array<Schema["FAQ"]["type"]>>([]);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [newAnswer, setNewAnswer] = useState<string>("");

  useEffect(() => {
    const fetchFaqs = async () => {
      const { data } = await client.models.FAQ.list();
      console.log(data);
      setFaqs(data);
    };
    fetchFaqs();
  }, []);

  const addFaq = async () => {
    if (newQuestion && newAnswer) {
      await client.models.FAQ.create({
        question: newQuestion,
        answer: newAnswer,
      });
      setNewQuestion("");
      setNewAnswer("");
      // FAQリストを再取得
      const { data } = await client.models.FAQ.list();
      setFaqs(data);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">FAQページ</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="質問を入力"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="border border-gray-300 p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="回答を入力"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          className="border border-gray-300 p-2 rounded mr-2"
        />
        <button
          onClick={addFaq}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          追加
        </button>
      </div>
      <ul className="list-disc pl-5">
        {faqs.map((faq) => (
          <li key={faq.question} className="mb-2">
            <strong>{faq.question}</strong>: {faq.answer}
          </li>
        ))}
      </ul>
    </div>
  );
}
