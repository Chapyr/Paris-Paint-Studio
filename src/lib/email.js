import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Paris Paint Studio <onboarding@resend.dev>';

/**
 * Send quote confirmation email to client
 */
export async function sendQuoteConfirmation({ to, clientName, subject, description }) {
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: '🎨 Votre demande de devis — Paris Paint Studio',
            html: `
                <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; padding: 40px; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <h1 style="color: #c9a84c; font-size: 24px; margin: 0;">Paris <span style="color: #e0e0e0;">Paint Studio</span></h1>
                    </div>
                    <h2 style="color: #c9a84c; font-size: 20px;">Bonjour ${clientName} 👋</h2>
                    <p>Merci pour votre demande de devis ! Nous avons bien reçu votre projet :</p>
                    <div style="background: #16213e; padding: 20px; border-radius: 8px; border-left: 4px solid #c9a84c; margin: 20px 0;">
                        <p style="margin: 0 0 8px 0;"><strong style="color: #c9a84c;">Sujet :</strong> ${subject || 'Demande de devis'}</p>
                        <p style="margin: 0;"><strong style="color: #c9a84c;">Description :</strong> ${description}</p>
                    </div>
                    <p>Votre commande a été créée dans votre <strong>espace client</strong>. Nous vous enverrons un devis chiffré dans les plus brefs délais.</p>
                    <p style="color: #888; font-size: 14px; margin-top: 32px; border-top: 1px solid #333; padding-top: 16px;">
                        — L'équipe Paris Paint Studio<br/>
                        <em>Peinture de figurines haut de gamme à Paris</em>
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error('❌ Email send error:', error);
            return false;
        }
        console.log('📧 Email de confirmation envoyé à', to, data?.id);
        return true;
    } catch (err) {
        console.error('❌ Email exception:', err);
        return false;
    }
}

/**
 * Send order completion email to client
 */
export async function sendOrderCompletionEmail({ to, clientName, orderId }) {
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: '✅ Votre commande est terminée — Paris Paint Studio',
            html: `
                <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; padding: 40px; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <h1 style="color: #c9a84c; font-size: 24px; margin: 0;">Paris <span style="color: #e0e0e0;">Paint Studio</span></h1>
                    </div>
                    <h2 style="color: #c9a84c; font-size: 20px;">Bonne nouvelle, ${clientName} ! 🎉</h2>
                    <p>Votre commande de peinture est <strong style="color: #4ade80;">terminée</strong> !</p>
                    <div style="background: #16213e; padding: 20px; border-radius: 8px; border-left: 4px solid #4ade80; margin: 20px 0;">
                        <p style="margin: 0;"><strong style="color: #c9a84c;">Référence :</strong> ${orderId.slice(0, 8).toUpperCase()}</p>
                        <p style="margin: 8px 0 0 0;"><strong style="color: #4ade80;">Statut :</strong> Terminée ✓</p>
                    </div>
                    <p>Nous vous contacterons prochainement pour organiser la livraison de vos figurines.</p>
                    <p>Connectez-vous à votre <strong>espace client</strong> pour consulter les détails de votre commande.</p>
                    <p style="color: #888; font-size: 14px; margin-top: 32px; border-top: 1px solid #333; padding-top: 16px;">
                        — L'équipe Paris Paint Studio<br/>
                        <em>Peinture de figurines haut de gamme à Paris</em>
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error('❌ Email send error:', error);
            return false;
        }
        console.log('📧 Email de complétion envoyé à', to, data?.id);
        return true;
    } catch (err) {
        console.error('❌ Email exception:', err);
        return false;
    }
}

/**
 * Send price quote email when admin sets the price
 */
export async function sendPriceQuoteEmail({ to, clientName, orderId, price, description }) {
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: '💰 Votre devis est prêt — Paris Paint Studio',
            html: `
                <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; padding: 40px; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <h1 style="color: #c9a84c; font-size: 24px; margin: 0;">Paris <span style="color: #e0e0e0;">Paint Studio</span></h1>
                    </div>
                    <h2 style="color: #c9a84c; font-size: 20px;">Bonjour ${clientName} 👋</h2>
                    <p>Votre devis a été chiffré ! Voici le détail :</p>
                    <div style="background: #16213e; padding: 20px; border-radius: 8px; border-left: 4px solid #c9a84c; margin: 20px 0;">
                        <p style="margin: 0 0 8px 0;"><strong style="color: #c9a84c;">Référence :</strong> ${orderId.slice(0, 8).toUpperCase()}</p>
                        ${description ? `<p style="margin: 0 0 8px 0;"><strong style="color: #c9a84c;">Projet :</strong> ${description}</p>` : ''}
                        <p style="margin: 0; font-size: 24px;"><strong style="color: #c9a84c;">Montant :</strong> <span style="color: #4ade80; font-weight: bold;">${price}€</span></p>
                    </div>
                    <p>Connectez-vous à votre <strong>espace client</strong> pour accepter et procéder au paiement sécurisé via Stripe.</p>
                    <p style="color: #888; font-size: 14px; margin-top: 32px; border-top: 1px solid #333; padding-top: 16px;">
                        — L'équipe Paris Paint Studio<br/>
                        <em>Peinture de figurines haut de gamme à Paris</em>
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error('❌ Email send error:', error);
            return false;
        }
        console.log('📧 Email de devis chiffré envoyé à', to, data?.id);
        return true;
    } catch (err) {
        console.error('❌ Email exception:', err);
        return false;
    }
}
