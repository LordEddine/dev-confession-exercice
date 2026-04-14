import { Header } from "@/components/Header";

import { getUserCredits, getPaymentHistory } from "@/actions/payment.actions";

export default async function BuyCreditsPage(){

    const [ userCredit, paymentHistory ] = await Promise.all([
        getUserCredits(),
        getPaymentHistory()
    ]);

    return(
        <div className="min-h-screen bg-gray-900 via-purple-900/20 to-gray-900">
            <Header />
            {userCredit && (
                <p>
                    Solde Actuel: {userCredit.credits}
                    Karma: {userCredit.karma}
                </p>
            )}
        </div>
    );
}