"use client";

import { useState } from "react";
import { createConfession } from "@/actions/confession.actions";
import { Category } from "../generated/prisma/client";
import { CATEGORY_MAP } from "@/lib/types";
import { useRouter } from "next/navigation";

export function ConfessionForm() {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      formData.set("isAnonymous", isAnonymous.toString());
      await createConfession(formData);
      router.push("/confessions");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Catégorie */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Catégorie de votre fail
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(CATEGORY_MAP).map(([key, { label, icon }]) => (
            <label
              key={key}
              className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition border border-gray-700 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-900/30"
            >
              <input
                type="radio"
                name="category"
                value={key}
                defaultChecked={key === "BUG"}
                className="sr-only"
              />
              <span className="text-xl">{icon}</span>
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Votre confession
        </label>
        <textarea
          name="content"
          rows={5}
          maxLength={500}
          placeholder="J'avoue que j'ai..."
          onChange={(e) => setCharCount(e.target.value.length)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          required
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">Minimum 10 caractères</span>
          <span
            className={`text-xs ${
              charCount > 450 ? "text-red-400" : "text-gray-500"
            }`}
          >
            {charCount}/500
          </span>
        </div>
      </div>

      {/* Mode anonyme */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsAnonymous(!isAnonymous)}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            isAnonymous ? "bg-purple-600" : "bg-gray-700"
          }`}
        >
          <span
            className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
              isAnonymous ? "left-8" : "left-1"
            }`}
          />
        </button>
        <span className="text-gray-300">
          {isAnonymous ? "🎭 Anonyme" : "👤 Avec mon pseudo"}
        </span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
      >
        {isSubmitting ? "Confession en cours..." : "Confesser"}
      </button>
    </form>
  );
}