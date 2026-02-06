import { AlertTriangle } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-6">
          <div className="flex gap-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900">
                Avertissement important
              </h3>
              <p className="mt-1 text-sm text-amber-800 leading-relaxed">
                Le Centre Ashifa n&apos;est pas un établissement medical et ne
                peut en aucun cas prescrire de médicaments ou d&apos;ordonnances.
                Le centre n&apos;est ni un établissement d&apos;enseignement
                religieux ni un lieu de culte, mais un lieu d&apos;accueil pour
                les personnes souffrantes du mal occulte. Nos thérapies sont
                complémentaires et né se substituent en aucun cas a un
                traitement medical.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
