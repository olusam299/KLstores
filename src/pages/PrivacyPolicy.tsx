import LegalPage, { LegalSection } from "../components/LegalPage";
import { STORE_NAME, WHATSAPP_DISPLAY, WHATSAPP_LINK } from "../config/store";

const PrivacyPolicy = () => (
  <LegalPage title="Privacy Policy">
    <p className="mt-6 text-gray-800 leading-relaxed">
      {STORE_NAME} ("we", "us") is an online fashion store. This policy explains
      what personal data we collect through this website, why we collect it,
      and the choices you have. We handle your data in line with the Nigeria
      Data Protection Act 2023.
    </p>

    <LegalSection title="1. Data we collect">
      <p>
        <strong>Account details:</strong> your name, email address and password.
        Your password is stored in encrypted form by our authentication
        provider; we cannot see it.
      </p>
      <p>
        <strong>Order details:</strong> the items you order, your phone number,
        your delivery address, and the date and status of each order.
      </p>
      <p>
        <strong>Messages:</strong> anything you send us on WhatsApp when you
        contact us or complete an order.
      </p>
      <p>
        <strong>Technical data:</strong> basic information your browser sends
        automatically (such as IP address and device type), which our hosting
        provider may record in server logs.
      </p>
    </LegalSection>

    <LegalSection title="2. How we use your data">
      <ul className="list-disc pl-6 space-y-1">
        <li>To create and manage your account, including password resets.</li>
        <li>To take, confirm, prepare and deliver your orders.</li>
        <li>
          To contact you about your order, such as delivery fees, timing and
          payment.
        </li>
        <li>To keep records we need for accounting, tax and legal reasons.</li>
        <li>To keep the website secure and working properly.</li>
      </ul>
      <p>
        We rely on the following lawful grounds: performing our contract with
        you (your order), meeting legal obligations, our legitimate interest in
        running and securing the store, and your consent where the law requires
        it. We do not use your data for advertising and we do not sell it.
      </p>
    </LegalSection>

    <LegalSection title="3. Who we share it with">
      <p>We share data only with the services we need to run the store:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Supabase</strong>, which hosts our database, user accounts and
          product images.
        </li>
        <li>
          <strong>Vercel</strong>, which hosts this website.
        </li>
        <li>
          <strong>Google Fonts</strong>, which delivers the website's typeface
          and therefore receives your IP address when a page loads.
        </li>
        <li>
          <strong>WhatsApp (Meta)</strong>, when you message us. WhatsApp's own
          privacy policy applies to that chat.
        </li>
        <li>
          <strong>Delivery or dispatch riders</strong>, who receive your name,
          phone number and address so they can deliver your order.
        </li>
      </ul>
      <p>
        We may also disclose data where the law, a court or a regulator
        requires us to.
      </p>
    </LegalSection>

    <LegalSection title="4. Payments">
      <p>
        This website does not take card payments or collect card details.
        Payment is arranged directly with us on WhatsApp after you place an
        order.
      </p>
    </LegalSection>

    <LegalSection title="5. Transfers outside Nigeria">
      <p>
        Our service providers may store or process data on servers outside
        Nigeria. Where that happens, we use providers that apply appropriate
        security safeguards.
      </p>
    </LegalSection>

    <LegalSection title="6. How long we keep your data">
      <p>
        We keep your account for as long as it is open. Order records are kept
        for as long as we need them for accounting, tax and legal purposes. You
        can ask us to delete your account at any time; we will delete what we
        are not legally required to keep.
      </p>
    </LegalSection>

    <LegalSection title="7. Security">
      <p>
        Data travels over encrypted (HTTPS) connections, and access to the
        database is restricted so that customers can only see their own
        accounts and orders. No online system is completely secure, so please
        use a strong password and do not share it.
      </p>
    </LegalSection>

    <LegalSection title="8. Your rights">
      <p>Under the Nigeria Data Protection Act 2023 you may:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>ask for a copy of the personal data we hold about you;</li>
        <li>ask us to correct data that is wrong or incomplete;</li>
        <li>ask us to delete your data, or restrict how we use it;</li>
        <li>object to our use of your data, or withdraw consent you gave;</li>
        <li>ask for your data in a portable format.</li>
      </ul>
      <p>
        To use any of these rights, message us on WhatsApp (see below). You
        also have the right to complain to the Nigeria Data Protection
        Commission if you believe your data has been mishandled.
      </p>
    </LegalSection>

    <LegalSection title="9. Children">
      <p>
        This website is not intended for anyone under 18, and we do not
        knowingly collect data from children.
      </p>
    </LegalSection>

    <LegalSection title="10. Changes to this policy">
      <p>
        We may update this policy from time to time. The date at the top shows
        when it last changed.
      </p>
    </LegalSection>

    <LegalSection title="11. Contact us">
      <p>
        For any privacy question or request, message {STORE_NAME} on WhatsApp:{" "}
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
  </LegalPage>
);
export default PrivacyPolicy;
