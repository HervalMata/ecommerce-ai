import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {Suspense} from "react";

export default function ProductDetailPage() {
    return (
        <div>
            {/* Back Link */}
            <Link href="/admin/inventory">
                <ArrowLeft />
                Voltar para o estoque
            </Link>

            {/* Product Detail */}
            <Suspense fallback={null}>

            </Suspense>
        </div>
    )
}
