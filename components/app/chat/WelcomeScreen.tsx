import { Sparkles, Package, Search } from "lucide-react";

interface WelcomeScreenProps {
    onSuggestionClick: (message: { text: string }) => void;
    isSignedIn: boolean;
}

const productSuggestions = [
    "Mostre-me seus laços",
    "Lindas tiaras por menos de R$ 25,00",
    "Quais Viseiras você tem?"
];

const orderSuggestions = [
    "Como está minha ordem?",
    "Mostre-me minhas recented ordens",
    "Tem algumaordem minha enviada?",
];

export function WelcomeScreen({ onSuggestionClick, isSignedIn }: WelcomeScreenProps) {
    return (
        <div className="flex h-full flex-col items-center justify-center text-center px-4">
            <div className="rounded-full bg-amber-100 p-4 dark:bg-amber-900/30">
                <Sparkles className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
                Como eu posso te ajudar hoje?
            </h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                {isSignedIn
                    ? "Eu posso ajudar você encontrar laços, checar suas ordens, e rastrear suas entrgas"
                    : "Eu posso ajudar você a encontrar laços por material, cores ou preços. Me pergunte!"
                }
            </p>

            {/* Products Suggestions */}
            <div className="mt-6 w-full max-w-sm">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                    <Search className="h-3 w-3" />
                    Encontrar Produtos
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                    {productSuggestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            type="button"
                            onClick={() => onSuggestionClick({ text: suggestion })}
                            className="rounded-full border border-zinc-200 bg-white
                                px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-50
                                dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300
                                dark:hover:bg-zinc-700"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>

            {/* Order Suggestions - Only for signed in users */}
            {isSignedIn && (
                <div className="mt-4 w-full max-w-sm">
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                        <Package className="h-3 w-3" />
                        Suas Ordens
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {orderSuggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => onSuggestionClick({ text: suggestion })}
                                className="rounded-full border border-zinc-200 bg-white
                                    px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-50
                                    dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300
                                    dark:hover:bg-zinc-700"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
