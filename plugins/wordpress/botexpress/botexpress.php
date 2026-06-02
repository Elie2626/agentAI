<?php
/**
 * Plugin Name: botexpress Chatbot
 * Plugin URI:  https://www.botexpress.fr
 * Description: Ajoutez votre chatbot IA botexpress à votre site WordPress en un clic. Aucune connaissance technique requise.
 * Version:     1.0.0
 * Author:      botexpress
 * Author URI:  https://www.botexpress.fr
 * License:     GPL v2 or later
 * Text Domain: botexpress
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/* ── Admin settings page ── */

add_action( 'admin_menu', function () {
    add_options_page(
        'botexpress Chatbot',
        'botexpress',
        'manage_options',
        'botexpress',
        'botexpress_settings_page'
    );
} );

function botexpress_settings_page() {
    if ( ! current_user_can( 'manage_options' ) ) return;

    if ( isset( $_POST['botexpress_save'] ) ) {
        check_admin_referer( 'botexpress_save_settings' );
        update_option( 'botexpress_chatbot_id', sanitize_text_field( $_POST['botexpress_chatbot_id'] ) );
        update_option( 'botexpress_enabled',    isset( $_POST['botexpress_enabled'] ) ? '1' : '0' );
        echo '<div class="notice notice-success is-dismissible"><p><strong>Paramètres sauvegardés.</strong></p></div>';
    }

    $chatbot_id = get_option( 'botexpress_chatbot_id', '' );
    $enabled    = get_option( 'botexpress_enabled', '1' );
    ?>
    <div class="wrap">
        <h1 style="display:flex;align-items:center;gap:10px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#6366f1;border-radius:8px;">
                <svg width="20" height="20" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </span>
            botexpress Chatbot
        </h1>

        <form method="post" style="margin-top:20px;">
            <?php wp_nonce_field( 'botexpress_save_settings' ); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="botexpress_chatbot_id">Chatbot ID</label></th>
                    <td>
                        <input
                            type="text"
                            id="botexpress_chatbot_id"
                            name="botexpress_chatbot_id"
                            value="<?php echo esc_attr( $chatbot_id ); ?>"
                            class="regular-text"
                            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        />
                        <p class="description">
                            Trouvez votre Chatbot ID dans votre
                            <a href="https://www.botexpress.fr/dashboard" target="_blank">dashboard botexpress</a>
                            → sélectionnez votre chatbot → onglet <strong>Intégration</strong>.
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Activer le chatbot</th>
                    <td>
                        <label>
                            <input type="checkbox" name="botexpress_enabled" value="1" <?php checked( $enabled, '1' ); ?> />
                            Afficher le chatbot sur toutes les pages
                        </label>
                    </td>
                </tr>
            </table>

            <p class="submit">
                <input type="submit" name="botexpress_save" class="button button-primary" value="Sauvegarder les paramètres" />
            </p>
        </form>

        <?php if ( $chatbot_id && $enabled === '1' ) : ?>
            <div style="margin-top:16px;padding:14px 16px;background:#f0fdf4;border-left:4px solid #22c55e;border-radius:4px;">
                <strong style="color:#15803d;">✓ Chatbot actif</strong> — Votre chatbot botexpress est affiché sur votre site.
            </div>
        <?php elseif ( ! $chatbot_id ) : ?>
            <div style="margin-top:16px;padding:14px 16px;background:#fefce8;border-left:4px solid #eab308;border-radius:4px;">
                <strong style="color:#92400e;">⚠ Configuration incomplète</strong> — Entrez votre Chatbot ID pour activer le widget.
            </div>
        <?php else : ?>
            <div style="margin-top:16px;padding:14px 16px;background:#f1f5f9;border-left:4px solid #94a3b8;border-radius:4px;">
                <strong>Widget désactivé</strong> — Cochez "Activer le chatbot" pour l'afficher sur votre site.
            </div>
        <?php endif; ?>

        <hr style="margin:30px 0;" />
        <h2 style="font-size:14px;color:#64748b;">Besoin d'aide ?</h2>
        <p style="color:#64748b;font-size:13px;">
            Consultez la
            <a href="https://www.botexpress.fr" target="_blank">documentation</a>
            ou contactez-nous via le
            <a href="https://www.botexpress.fr/dashboard" target="_blank">support botexpress</a>.
        </p>
    </div>
    <?php
}

/* ── Inject widget in footer ── */

add_action( 'wp_footer', function () {
    $chatbot_id = get_option( 'botexpress_chatbot_id', '' );
    $enabled    = get_option( 'botexpress_enabled', '1' );

    if ( empty( $chatbot_id ) || $enabled !== '1' ) return;
    ?>
    <script
        src="https://www.botexpress.fr/widget.js"
        data-chatbot-id="<?php echo esc_attr( $chatbot_id ); ?>"
        data-api-url="https://agentai-23tt.onrender.com"
        defer
    ></script>
    <?php
} );
