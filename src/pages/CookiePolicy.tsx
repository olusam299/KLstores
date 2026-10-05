import { Link } from "react-router-dom";
import LegalPage, { LegalSection } from "../components/LegalPage";
import { STORE_NAME } from "../config/store";

const CookiePolicy = () => (
  <LegalPage title="Cookie Policy">
    <p className="mt-6 text-gray-800 leading-relaxed">
      This page explains how {STORE_NAME} uses cookies and similar browser
      storage. Our{" "}
      <Link to="/privacy-policy" className="text-brand underline">
        Privacy Policy
      </Link>{" "}
      explains how we handle personal data more generally.
    </p>

    <LegalSection title="1. What cookies and browser storage are">
      <p>
        Cookies are small files that websites save on your device. Websites can
        also save small pieces of data in your browser's local storage. Both
        let a site remember things between pages and visits.
      </p>
    </LegalSection>

    <LegalSection title="2. What we use">
      <p>
        We only use storage that is strictly necessary for the website to work:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 border-b">Item</th>
              <th className="p-3 border-b">Purpose</th>
              <th className="p-3 border-b">Lasts</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border-b align-top">Login session (sb-…-auth-token)</td>
              <td className="p-3 border-b align-top">
                Keeps you logged in to your account. Set by our authentication
                provider, Supabase.
              </td>
              <td className="p-3 border-b align-top">Until you log out or it expires</td>
            </tr>
            <tr>
              <td className="p-3 align-top">Shopping cart (klstores-cart)</td>
              <td className="p-3 align-top">
                Remembers the items in your cart so you don't lose them when you
                leave or refresh the page.
              </td>
              <td className="p-3 align-top">Until you place an order or clear your browser data</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        We do not use advertising, tracking or analytics cookies, and we do not
        build profiles of visitors.
      </p>
    </LegalSection>

    <LegalSection title="3. Third parties">
      <p>
        The website loads its typeface from Google Fonts, so Google receives
        your IP address when a page loads. We do not control Google's data
        practices. When you tap a WhatsApp button, you leave this website and
        WhatsApp's own policies apply.
      </p>
    </LegalSection>

    <LegalSection title="4. Consent">
      <p>
        Because we only use strictly necessary storage, we do not show a cookie
        banner. If we ever add analytics or advertising tools, we will update
        this page and ask for your consent first.
      </p>
    </LegalSection>

    <LegalSection title="5. Managing storage">
      <p>
        You can delete cookies and site data in your browser settings, and
        logging out ends your login session. If you block this storage
        completely, you will not be able to log in or keep items in your cart.
      </p>
    </LegalSection>
  </LegalPage>
);
export default CookiePolicy;
