import { Link } from "react-router-dom";
import LegalPage, { LegalSection } from "../components/LegalPage";
import { STORE_NAME, WHATSAPP_DISPLAY, WHATSAPP_LINK } from "../config/store";

const LegalNotes = () => (
  <LegalPage title="Legal Notes and Terms of Sale">
    <p className="mt-6 text-gray-800 leading-relaxed">
      By using this website or placing an order, you agree to these terms.
      Please read them together with our{" "}
      <Link to="/privacy-policy" className="text-brand underline">
        Privacy Policy
      </Link>{" "}
      and{" "}
      <Link to="/cookie-policy" className="text-brand underline">
        Cookie Policy
      </Link>
      .
    </p>

    <LegalSection title="1. About us">
      <p>
        This website is operated by {STORE_NAME}, a Nigerian fashion retailer.
        You can reach us on WhatsApp at{" "}
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
          className="text-brand underline"
        >
          {WHATSAPP_DISPLAY}
        </a>
        .
      </p>
    </LegalSection>

    <LegalSection title="2. Using the website">
      <ul className="list-disc pl-6 space-y-1">
        <li>You must be at least 18 to create an account or place an order.</li>
        <li>Give accurate details and keep your password private.</li>
        <li>
          You are responsible for activity on your account. Tell us promptly if
          you think someone else has used it.
        </li>
        <li>
          Do not misuse the website, attempt to break into it, or interfere
          with how it works.
        </li>
      </ul>
    </LegalSection>

    <LegalSection title="3. Products and prices">
      <p>
        All prices are in Nigerian Naira (₦). We take care with product photos
        and descriptions, but colours may look slightly different on your
        screen. Items are sold while stock lasts. If we find a pricing or
        listing error, we may correct it and cancel or re-confirm affected
        orders with you.
      </p>
    </LegalSection>

    <LegalSection title="4. Placing an order">
      <p>
        Placing an order on the website sends us your request and reserves the
        items for you. An order is only final once we confirm it with you on
        WhatsApp. We may decline or cancel an order, for example if an item is
        unavailable or payment is not received, and we will tell you if we do.
        Unpaid orders may be cancelled and the items returned to stock.
      </p>
    </LegalSection>

    <LegalSection title="5. Payment">
      <p>
        The website does not take payment. After you place an order, you pay us
        directly using the details we confirm with you on WhatsApp. Only pay
        according to details given in our official WhatsApp chat. We will never
        ask for your card PIN, OTP or account password.
      </p>
    </LegalSection>

    <LegalSection title="6. Tax, delivery and delivery fees">
      <p>
        Where tax (VAT, currently 7.5%) applies, it is shown in your cart and
        at checkout. Delivery is not included in the website total. The
        delivery fee and timing are agreed with you on WhatsApp before your
        order is dispatched.
      </p>
    </LegalSection>

    <LegalSection title="7. Faulty, damaged or wrong items">
      <p>
        If an item arrives faulty, damaged or different from what you ordered,
        message us on WhatsApp as soon as possible after delivery, with photos
        if you can. We will work with you on a repair, exchange or refund where
        appropriate. These terms do not take away any rights you have as a
        consumer under Nigerian law.
      </p>
    </LegalSection>

    <LegalSection title="8. Intellectual property">
      <p>
        The {STORE_NAME} name, logo, photos, text and design on this website
        belong to us or our licensors. Please do not copy or reuse them without
        our written permission.
      </p>
    </LegalSection>

    <LegalSection title="9. Our responsibility">
      <p>
        We work to keep the website available and accurate, but we provide it
        "as is" and cannot promise it will always be uninterrupted or error
        free. To the extent the law allows, we are not responsible for indirect
        or consequential losses. Nothing in these terms excludes liability that
        cannot lawfully be excluded.
      </p>
    </LegalSection>

    <LegalSection title="10. Links to other sites">
      <p>
        Links to other websites and apps, including WhatsApp, are for your
        convenience. We are not responsible for their content or practices.
      </p>
    </LegalSection>

    <LegalSection title="11. Governing law">
      <p>
        These terms are governed by the laws of the Federal Republic of
        Nigeria, and the courts of Nigeria have jurisdiction over any dispute.
      </p>
    </LegalSection>

    <LegalSection title="12. Changes">
      <p>
        We may update these terms from time to time. The date at the top shows
        when they last changed. Orders are governed by the terms in force when
        you placed them.
      </p>
    </LegalSection>
  </LegalPage>
);
export default LegalNotes;
