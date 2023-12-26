import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { DarkModeStatus } from "../../app/useStore";
import { Colors, getDarkTheme, getLightTheme } from "../../utils/colors";

export default function PrivacyPolicyScreen({ navigation }) {
  const mode = DarkModeStatus();
  return (
    <View
      style={[
        styles.page,
        {
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        },
      ]}
    >
      <View style={{ width: "100%" }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 10,
            paddingBottom: 50,
            width: "100%",
          }}
        >
          <View style={{ width: "100%" }}>
            <Text style={styles.heading}> </Text>
            <Text
              style={{ color: mode ? getDarkTheme.color : getLightTheme.color }}
            >
              Introduction Playwise is a social networking platform where one
              can engage and connect with other gamers, esports enthusiasts,
              gaming professionals, organizations, and gaming- businesses.
              Playwise, of PW Esports Private Limited (“Playwise”, ”Company”,
              “We”, “Our” or “Us”) respect your privacy and are committed to
              protecting it through our compliance with this policy. This policy
              describes the types of information we may collect from you or that
              you may provide when you visit the website https://playwise.gg
              (our “Website”) or our Mobile Application (“App”) and our
              practices for collecting, using, maintaining, protecting, and
              disclosing that information. This Privacy Policy is an electronic
              record in the form of an electronic contract formed under the
              information Technology Act, 2000 and the rules made thereunder and
              the amended provisions pertaining to electronic documents /
              records in various statutes as amended by the Information
              Technology Act, 2000. This policy applies to information Playwise
              collects: • On this Website and your interactions with our Website
              or App. • In email, text, and other electronic messages between
              you and our Website or App. • Through mobile and desktop
              applications you download from our Website, which provide
              dedicated non-browser-based interaction between you and our
              Website. • When you interact with our advertising and applications
              on third-party websites and services, if those applications or
              advertising include links to this policy. It does not apply to
              information collected by: • Us offline or through any other means,
              including on any other website operated by Company or any third
              party; or • Any third party, including through any application or
              content (including advertising) that may link to or be accessible
              from or on the Website Please read this policy carefully to
              understand our policies and practices regarding your information
              and how we will treat it. If you do not agree with our policies
              and practices, your choice is not to use our Website. By using
              this Website and submitting your personal data to its database,
              you agree to be bound by this Privacy Policy, and that Playwise
              may process your data for the purposes described in this Privacy
              Policy and consistent with the Website’s Terms of Use. This policy
              may change from time to time. Your continued use of this Website
              after we make changes is deemed to be acceptance of those changes,
              so please check the policy periodically for updates. 1.
              Information we collect and how we collect it We collect several
              types of information from and about users of our Website,
              including information: • By which you may be personally
              identified, such as name, postal address, e-mail address,
              telephone number, any other identifier by which you may be
              contacted online or offline (”personal information”); •
              Information relating to purchases (name, email address, and credit
              card information); • That is about you but individually does not
              identify you, such as your location. • That is about your
              interaction on this Website, including but not limited to, what
              you are viewing on the Website, how you view it, what links or
              webpages you click to, what parts or pages you spend the most time
              on, and your preferences on the Website • About your internet
              connection, the equipment you use to access our Website, and usage
              details. We collect this information: • Directly from you when you
              provide it to us. • Automatically as you navigate through the
              site. Information collected automatically may include usage
              details, IP addresses, and information collected through cookies,
              web beacons, and other tracking technologies. • From third
              parties, for example, our business partners, content providers,
              and affiliates. • From YouTube API Services (YouTube Privacy
              Policy). 2. Information you provide to us The information Playwise
              collects on or through our Website may include: • Information that
              you provide by filling in forms on our Website. This includes
              information provided at the time of registering to use our
              Website, subscribing to our service, posting material, or
              requesting further services. Playwise may also ask you for
              information when you report a problem with our Website. • Records
              and copies of your correspondence (including email addresses), if
              you contact us. • Your responses to surveys that we might ask you
              to complete for research purposes. • Details of transactions you
              carry out through our Website and of the fulfillment of your
              orders. You may be required to provide financial information
              before placing an order through our Website. • Your search queries
              on the Website. You also may provide information to be posted on
              public areas of the Website, or transmitted to other users of the
              Website or third parties (collectively, “User Contributions”).
              Your User Contributions are posted on and transmitted to others at
              your own risk. Although you may set certain privacy settings for
              such information by logging into your account profile, please be
              aware that no security measures are perfect or impenetrable.
              Additionally, we cannot control the actions of other users of the
              Website with whom you may choose to share your User Contributions.
              Therefore, we cannot and do not guarantee that your User
              Contributions will not be viewed by unauthorized persons. 3.
              Information we collect using automatic data tracking technologies
              As you navigate through and interact with our Website, we may use
              automatic data collection technologies to collect certain
              information about your equipment, browsing actions, and patterns,
              including: • Details of your visits to our Website, including
              traffic data, location data, logs, and other communication data
              and the resources that you access and use on the Website. •
              Information about your computer and internet connection, including
              your IP address, operating system, and browser type. We also may
              use these technologies to collect information about your online
              activities over time and across third-party websites or other
              online services (behavioral tracking). Please see Do Not Track
              Requests for information on how you can opt out of behavioral
              tracking on this website and how we respond to web browser signals
              and other mechanisms that enable consumers to exercise choice
              about behavioral tracking. The information we collect
              automatically may include personal information, or we may maintain
              it or associate it with personal information we collect in other
              ways or receive from third parties. It helps us to improve our
              Website and to deliver a better and more personalized service,
              including by enabling us to: • Estimate our audience size and
              usage patterns. • Store information about your preferences,
              allowing us to customize our Website according to your individual
              interests. • Prepare relevant information on our Website based on
              your and other consumers use and navigation of it. • Speed up your
              searches. • Recognize you when you return to our Website. The
              technologies we use for this automatic data collection may
              include: • Cookies (or browser cookies). A cookie is a small file
              placed on the hard drive of your computer. You may refuse to
              accept browser cookies by activating the appropriate setting on
              your browser. However, if you select this setting you may be
              unable to access certain parts of our Website. Unless you have
              adjusted your browser setting so that it will refuse cookies, our
              system will issue cookies when you direct your browser to our
              Website. • Flash Cookies. Certain features of our Website may use
              local stored objects (or Flash cookies) to collect and store
              information about your preferences and navigation to, from, and on
              our Website. Flash cookies are not managed by the same browser
              settings as are used for browser cookies. • Web Beacons. Pages of
              our the Website and our e-mails may contain small electronic files
              known as web beacons (also referred to as clear gifs, pixel tags,
              and single-pixel gifs) that permit Playwise, for example, to count
              users who have visited those pages or opened an email and for
              other related website statistics (for example, recording the
              popularity of certain website content and verifying system and
              server integrity). 4. Third party use of cookies and other data
              tracking technologies information we collect and how we collect it
              Some content or applications, including advertisements, on the
              Website are served by third-parties, including advertisers, ad
              networks and servers, content providers, and application
              providers. These third parties may use cookies alone or in
              conjunction with web beacons or other tracking technologies to
              collect information about you when you use our website. The
              information they collect may be associated with your personal
              information or they may collect information, including personal
              information, about your online activities over time and across
              different websites and other online services. They may use this
              information to provide you with interest-based (behavioral)
              advertising or other targeted content. We do not control these
              third parties’ tracking technologies or how they may be used. If
              you have any questions about an advertisement or other targeted
              content, you should contact the responsible provider directly. 5.
              How we use your information Playwise uses information that we
              collect about you or that you provide to us, including any
              personal information: • To present our Website and its contents to
              you. • To provide you with information, products, or services that
              you request from us or based on your interactions from our
              Website. • To fulfill any other purpose for which you provide it.
              • To provide you with notices about your account, including
              expiration and renewal notices. • To carry out our obligations and
              enforce our rights arising from any contracts entered into between
              you and us, including for billing and collection. • To notify you
              about changes to our Website or any products or services Playwise
              offers or provides though it. • To better update our Website based
              on your and other consumers interaction with it. • To allow you to
              participate in interactive features on our Website. • In any other
              way we may describe when you provide the information. • For any
              other purpose with your consent. We may also use your information
              to contact you about our own and third-parties’ goods and services
              that may be of interest to you. We may use the information we have
              collected from you to enable us to display advertisements to our
              advertisers’ target audiences. Even though we do not disclose your
              personal information for these purposes without your consent, if
              you click on or otherwise interact with an advertisement, the
              advertiser may assume that you meet its target criteria. 6.
              Disclosure of your information Playwise may disclose aggregated
              information about our users, and information that does not
              identify any individual, without restriction. Playwise may
              disclose personal information that we collect or you provide as
              described in this privacy policy: • To our subsidiaries and
              affiliates. • To contractors, service providers, and other third
              parties we use to support our business. • To a buyer or other
              successor in the event of a merger, divestiture, restructuring,
              reorganization, dissolution, or other sale or transfer of some or
              all of Playwise’s assets, whether as a going concern or as part of
              bankruptcy, liquidation, or similar proceeding, in which personal
              information held by Playwise about our Website users is among the
              assets transferred. • To third parties to market their products or
              services to you if you have not opted out of these disclosures.
              For more information, see How Playwise Uses and Discloses Your
              Information. • To fulfill the purpose for which you provide it. •
              For any other purpose disclosed by us when you provide the
              information. • With your consent. We may also disclose your
              personal information: • To comply with any court order, law, or
              legal process, including to respond to any government or
              regulatory request. • To enforce or apply our Terms of Use and
              other agreements, including for billing and collection purposes. •
              If Playwise believes disclosure is necessary or appropriate to
              protect the rights, property, or safety of Playwise, our
              customers, or others. This includes exchanging information with
              other companies and organizations for the purposes of fraud
              protection and credit risk reduction. 7. Accessing and correcting
              your information You can review and change your personal
              information by logging into the Website and visiting your account
              profile page. You may also send us an email to request access to,
              correct or delete any personal information that you have provided
              to us. We cannot delete your personal information except by also
              deleting your user account. We may not accommodate a request to
              change information if we believe the change would violate any law
              or legal requirement or cause the information to be incorrect. If
              you delete your User Contributions from the Website, copies of
              your User Contributions may remain viewable in cached and archived
              pages, or might have been copied or stored by other Website users.
              Proper access and use of information provided on the Website,
              including User Contributions, is governed by our Terms of Use. 8.
              Data Security We have implemented measures designed to secure your
              personal information from accidental loss and from unauthorized
              access, use, alteration, and disclosure. All information you
              provide to us is stored on secure servers behind firewalls.
              Playwise user’s personally identifiable information will be
              encrypted. We use a third-party payment provider to process all
              payments. We do not directly store any payment information. The
              safety and security of your information also depends on you. Where
              we have given you (or where you have chosen) a password for access
              to certain parts of our Website, you are responsible for keeping
              this password confidential. We ask you not to share your password
              with anyone. We urge you to be careful about giving out
              information in public areas of the Website like message boards.
              The information you share in public areas may be viewed by any
              user of the Website. Unfortunately, the transmission of
              information via the internet is not completely secure. Although we
              do our best to protect your personal information, we cannot
              guarantee the security of your personal information transmitted to
              our Website. Any transmission of personal information is at your
              own risk. We are not responsible for circumvention of any privacy
              settings or security measures contained on the Website. 9. Changes
              to this Privacy Policy Any changes in the Privacy Policy shall be
              posted on our website to reflect changes in our policy so that the
              users are always aware of what information we collect, use, and
              under what circumstances, if any, we may disclose it. Users should
              periodically review this page for the latest information on our
              privacy practices. Once posted, those changes are effective
              immediately. Continued access or use of the Application and/or the
              Services constitutes Your acceptance of the changes and the
              amended Privacy Policy. 10.Grievance Officer In the event you have
              any complaints or grievances regarding usage of Application or its
              Services, please contact Sunny Paliwal at{" "}
              {"<support@playwise.gg >"} who is our Grievance Officer and
              Compliance Officer. The complaints will be redressed in the manner
              provided under the Information Technology Act, 2000, the Consumer
              Protection Act, 2019 and rules framed thereunder. We will
              acknowledge the receipt of any consumer complaint within
              twenty-four hours and redresses the complaint within 15 days from
              the date of receipt of the complaint. 11. Contact information To
              ask questions or comment about this privacy policy and our privacy
              practices, contact us at:support@playwise.gg
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  heading: {
    textAlign: "left",
    fontSize: 18,
    fontWeight: "500",
    color: Colors.primary,
    marginVertical: 10,
  },
  body: {
    fontSize: 14,
    color: "grey",
    marginBottom: 20,
  },
});
