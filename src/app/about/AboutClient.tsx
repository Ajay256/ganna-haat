"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import {
  Wheat,
  Store,
  Gavel,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Truck,
  CheckCircle2,
  XCircle,
  Users,
  Scale,
  FileText,
  PhoneCall,
  MapPin,
  Award,
  HelpCircle,
  ChevronDown,
  Sparkles,
  HeartHandshake,
  Banknote,
  Clock,
  Building2,
  BadgeCheck,
} from "lucide-react";

export const AboutClient: React.FC = () => {
  const { t, language } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const isHi = language === "hi";

  const stats = [
    {
      value: "10,000+",
      label: isHi ? "पंजीकृत गन्ना किसान" : "Registered Cane Farmers",
      desc: isHi ? "पश्चिमी उत्तर प्रदेश व चीनी बेल्ट से" : "Across Western UP & Sugar Belt",
    },
    {
      value: "500+",
      label: isHi ? "सत्यापित चीनी मिलें व कोल्हू" : "Verified Mills & Crushers",
      desc: isHi ? "लाइसेंस प्राप्त व प्रमाणीकृत खरीदार" : "Licensed & Certified Buyers",
    },
    {
      value: "1.5 लाख+",
      label: isHi ? "क्विंटल गन्ने का सफल व्यापार" : "Quintals Successfully Traded",
      desc: isHi ? "पारदर्शी डिजिटल पर्ची प्रणाली द्वारा" : "Via Verified Digital Slips",
    },
    {
      value: "100%",
      label: isHi ? "समयबद्ध सीधा भुगतान" : "Guaranteed Direct Payout",
      desc: isHi ? "बिना किसी बिचौलिया कटौती के" : "Direct to Farmer Bank Account",
    },
  ];

  const comparisons = [
    {
      feature: isHi ? "भाव निर्धारण (Price Discovery)" : "Price Discovery",
      traditional: isHi
        ? "सीमित विकल्प, स्थानीय दलालों द्वारा तय किया गया एकतरफ़ा कम भाव।"
        : "Limited buyer options; one-sided lower rate dictated by middleman cartel.",
      gannahaat: isHi
        ? "खुली डिजिटल नीलामी; अनेक मिलों व कोल्हू खरीदारों की प्रतिस्पर्धी लाइव बोलियाँ।"
        : "Open digital auction; competitive live bids from multiple verified mills & crushers.",
    },
    {
      feature: isHi ? "तौल व घटतौली (Weighment & Accuracy)" : "Weighment Accuracy",
      traditional: isHi
        ? "अक्सर घटतौली और वजन में 5-10% की मनमानी कटौती की शिकायतें।"
        : "Frequent weighbridge manipulation and unjustified 5-10% deduction disputes.",
      gannahaat: isHi
        ? "सत्यापित धर्मकांटा पर्ची, डिजिटल रिकॉर्डिंग और पारदर्शी वजन प्रमाणन।"
        : "Certified weighbridge slips, digital logging, and 100% verified weight slips.",
    },
    {
      feature: isHi ? "भुगतान का समय (Payment Timeline)" : "Payment Timeline",
      traditional: isHi
        ? "महीनों तक मिलों के चक्कर, पर्ची अटकना और भुगतान में भारी अनिश्चितता।"
        : "Months-long delays, bureaucratic slip approvals, and painful payment uncertainty.",
      gannahaat: isHi
        ? "सौदा तय होने व तौल सत्यापन के 24-48 घंटों में सीधा बैंक खाता अंतरण।"
        : "Guaranteed 24-48 hour direct account settlement following weighment verification.",
    },
    {
      feature: isHi ? "कमीशन व बिचौलिया (Middlemen & Cuts)" : "Middleman Commissions",
      traditional: isHi
        ? "बिचौलियों और दलालों द्वारा प्रति क्विंटल ₹15-₹30 का अनुचित कमीशन।"
        : "Brokers and middlemen pocketing ₹15-₹30 per quintal in commissions.",
      gannahaat: isHi
        ? "0% छिपा हुआ कमीशन — किसान को अपनी मेहनत का पूरा-पूरा वाजिब दाम।"
        : "0% hidden commission — farmer keeps 100% of the agreed auction value.",
    },
    {
      feature: isHi ? "ढुलाई व कटाई समय (Harvest Coordination)" : "Harvest & Logistics",
      traditional: isHi
        ? "ट्रैक्टर-ट्रॉली की मिल गेट पर कई-कई दिनों तक कतारें और गन्ने का सूखना।"
        : "Days-long queue of loaded tractor-trolleys at mill gates causing weight loss.",
      gannahaat: isHi
        ? "निर्धारित स्लॉट पर सीधा खेत से उठाव व त्वरित धर्मकांटा अनलोडिंग।"
        : "Pre-scheduled farm pickup slots and rapid weighbridge unloading.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: isHi ? "फसल लिस्टिंग करें" : "List Your Harvest",
      desc: isHi
        ? "किसान भाई अपने मोबाइल से गन्ने की किस्म (जैसे Co 0238, Co 0118), अनुमानित मात्रा (क्विंटल) व खेत का स्थान दर्ज करें।"
        : "Farmers enter cane variety (e.g., Co 0238, Co 0118), estimated quintals, cut date, and field location via mobile.",
      icon: Wheat,
    },
    {
      number: "02",
      title: isHi ? "लाइव प्रतिस्पर्धी बोलियां" : "Receive Live Bids",
      desc: isHi
        ? "सत्यापित चीनी मिलें, खांडसारी इकाइयाँ व कोल्हू खरीदार आपकी फसल पर पारदर्शी तरीके से ₹/क्विंटल में बोलियां लगाते हैं।"
        : "Verified sugar mills, khandsari units, and gur crushers submit real-time competitive bids in ₹/quintal.",
      icon: Gavel,
    },
    {
      number: "03",
      title: isHi ? "सर्वोत्तम भाव चुनें" : "Accept the Best Bid",
      desc: isHi
        ? "आपको जिस खरीदार का भाव व शर्तें सबसे अनुकूल लगें, उसे एक क्लिक में स्वीकार करें और सौदा पक्का करें।"
        : "Select the most competitive bid with a single click. Contact info and pickup terms are instantly confirmed.",
      icon: HeartHandshake,
    },
    {
      number: "04",
      title: isHi ? "तौल व त्वरित भुगतान" : "Weighment & Payout",
      desc: isHi
        ? "प्रमाणित धर्मकांटे पर गन्ने का तौल होता है, डिजिटल पर्ची बनती है और सीधा किसान के बैंक खाते में भुगतान अंतरित होता है।"
        : "Sugarcane is weighed at a certified bridge, digital slip is issued, and payment settles directly into your account.",
      icon: Banknote,
    },
  ];

  const pillars = [
    {
      icon: Wheat,
      title: isHi ? "किसान प्रथम नीति" : "Farmer-First Philosophy",
      desc: isHi
        ? "हमारा प्रत्येक नियम, फ़ीचर और सेवा केवल एक लक्ष्य को समर्पित है — अन्नदाता को उसकी मेहनत का सर्वोच्च और समय पर मूल्य दिलाना।"
        : "Every policy, tool, and service is built around a single core goal: empowering growers with fair, on-time realization.",
    },
    {
      icon: ShieldCheck,
      title: isHi ? "100% पारदर्शिता व सत्यनिष्ठा" : "Total Transparency",
      desc: isHi
        ? "कोई गुप्त कमीशन नहीं, कोई बंद कमरे का सौदा नहीं। सभी बोलियाँ, तौल पर्चियाँ और भाव पूरी तरह खुले और पारदर्शी होते हैं।"
        : "No secret commissions or backroom cuts. Every bid, slip, and trade ledger is fully auditable and tamper-proof.",
    },
    {
      icon: Building2,
      title: isHi ? "सत्यापित खरीदार व मिल नेटवर्क" : "Verified Buyer Network",
      desc: isHi
        ? "मंच पर केवल वही मिलें व कोल्हू जुड़ सकते हैं जिनका सत्यापन, पैन, जीएसटी और स्थानीय मंडी साख की पूर्ण जांच की गई हो।"
        : "Only mills and crushers with verified GST, trade registrations, and payment credibility are approved on GannaHaat.",
    },
    {
      icon: Scale,
      title: isHi ? "डिजिटल तौल सुरक्षा" : "Digital Slip & Weigh Security",
      desc: isHi
        ? "घटतौली की ऐतिहासिक समस्या का समाधान। आधुनिक कंप्यूटराइज्ड पर्ची और जीपीएस युक्त वाहन ट्रैकिंग।"
        : "Eradicating arbitrary weighment cuts through certified computerized slips and timestamped weight verification.",
    },
  ];

  const varieties = [
    {
      code: "Co 0238 (Karan 4)",
      type: isHi ? "अगेती किस्म (Early Maturity)" : "Early Maturity Variety",
      sugar: "12.0% - 13.5%",
      highlight: isHi ? "सर्वाधिक लोकप्रिय, उच्च रिकवरी" : "Highest sucrose yield, industry standard",
    },
    {
      code: "Co 0118 (Karan 2)",
      type: isHi ? "अगेती किस्म (Early Maturity)" : "Early Maturity Variety",
      sugar: "12.5% - 13.2%",
      highlight: isHi ? "रोग प्रतिरोधी, ठोस तना, शानदार रस" : "Red-rot resistant, dense stalk, high juice quality",
    },
    {
      code: "Co 15023",
      type: isHi ? "नवीनतम उच्च शर्करा किस्म" : "Advanced High-Sucrose Variety",
      sugar: "13.0% - 14.0%",
      highlight: isHi ? "अत्यधिक तेज वृद्धि, मिलों की पहली पसंद" : "Rapid growth, premium demand across modern mills",
    },
    {
      code: "CoLk 14201",
      type: isHi ? "मध्यम-अगेती किस्म" : "Mid-Early Maturity Variety",
      sugar: "11.8% - 12.8%",
      highlight: isHi ? "मजबूत पैदावार, सूखे व पाले के प्रति सहनशील" : "Drought-hardy, solid tonnage per acre",
    },
  ];

  const faqs = [
    {
      q: isHi
        ? "क्या गन्ना हाट पर किसान के पंजीकरण का कोई शुल्क है?"
        : "Is there any registration fee for sugarcane farmers?",
      a: isHi
        ? "नहीं, गन्ना हाट पर किसानों के लिए पंजीकरण, फसल लिस्टिंग और बोलियां प्राप्त करना 100% निःशुल्क है। हम किसानों से कोई अग्रिम शुल्क या गुप्त कमीशन नहीं लेते हैं।"
        : "No. Registration, crop listing, and receiving bids are 100% free for farmers. We do not charge any upfront fees or hidden commissions from growers.",
    },
    {
      q: isHi
        ? "क्या छोटे किसान भी (जैसे 20-50 क्विंटल) गन्ना बेच सकते हैं?"
        : "Can smallholder farmers (with 20-50 quintals) sell on GannaHaat?",
      a: isHi
        ? "हाँ, बिल्कुल! गन्ना हाट सभी किसानों के लिए खुला है — चाहे आपके पास 20 क्विंटल हो या 2,000 क्विंटल। स्थानीय कोल्हू और खांडसारी इकाइयाँ छोटे लॉट के लिए तुरंत बोली लगाती हैं।"
        : "Yes, absolutely! GannaHaat welcomes all farmers whether you have 20 quintals or 2,000 quintals. Local gur crushers and khandsari processors actively bid on smaller volumes.",
    },
    {
      q: isHi
        ? "गन्ने का तौल कहाँ और कैसे होता है?"
        : "Where and how is the sugarcane weighed?",
      a: isHi
        ? "तौल निकटतम प्रमाणित सरकारी/अधिकृत धर्मकांटे पर होता है। तौल पर्ची सीधे मोबाइल पर अपलोड होती है ताकि किसान और खरीदार दोनों के पास प्रमाणित वजन रिकॉर्ड रहे।"
        : "Weighment takes place at the nearest certified government or licensed computerized weighbridge. Digital slips are uploaded directly to the platform for instant verification by both parties.",
    },
    {
      q: isHi
        ? "खरीदार किसान को भुगतान कैसे करता है?"
        : "How and when does the buyer make payment?",
      a: isHi
        ? "सौदा पक्का होने और तौल पर्ची की पुष्टि होते ही खरीदार द्वारा सीधे किसान के बैंक खाते (UPI / NEFT / IMPS) में भुगतान किया जाता है। गन्ना हाट सुरक्षा प्रोटोकॉल सुनिश्चित करता है कि भुगतान समय पर पहुंचे।"
        : "Once the deal is confirmed and the weighment slip is verified, payment is directly transferred to the farmer's bank account (via UPI/NEFT/IMPS). Our verification system ensures prompt settlement.",
    },
    {
      q: isHi
        ? "क्या चीनी मिलें भी इस प्लेटफॉर्म से गन्ना खरीद सकती हैं?"
        : "Can industrial sugar mills procure raw cane through this platform?",
      a: isHi
        ? "हाँ, चीनी मिलें, खांडसारी इकाइयाँ और एथेनॉल उत्पादक इकाइयाँ 'खरीदार (Buyer)' के रूप में पंजीकृत होकर अपने क्षेत्र के उच्च रिकवरी गन्ने की सीधे खरीद कर सकती हैं।"
        : "Yes. Sugar mills, khandsari units, jaggery manufacturers, and biofuel/ethanol plants can register as verified Buyers to procure high-recovery sugarcane directly from growers.",
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-cane-700">
        <Link href="/" className="hover:text-cane-950 font-medium">
          {t.nav.home}
        </Link>
        <span>/</span>
        <span className="text-cane-950 font-bold">{t.nav.about}</span>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cane-950 via-cane-900 to-cane-950 text-white p-6 sm:p-12 lg:p-16 shadow-2xl border border-cane-800/80">
        {/* Background Image with priority LCP */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/sugar-cane-field-ripe-harvest_843560-3447.avif"
            alt={isHi ? "लहलहाता गन्ने का खेत — गन्ना हाट" : "Sugarcane farm ready for harvest — GannaHaat"}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover object-center opacity-25 mix-blend-luminosity scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cane-950 via-cane-900/90 to-cane-950/85" />
        </div>

        {/* Decorative Glows */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-cane-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-jaggery-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-cane-200">
            <Sparkles className="w-4 h-4 text-cane-300" />
            <span>
              {isHi
                ? "भारत का समर्पित डिजिटल गन्ना नीलामी मंच"
                : "India's Dedicated Digital Sugarcane Marketplace"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight">
            {isHi ? (
              <>
                गन्ना किसानों को मिले <span className="text-cane-300">उचित भाव</span>, मिलों को{" "}
                <span className="text-jaggery-300">सर्वोत्तम गन्ना</span>
              </>
            ) : (
              <>
                Empowering Sugarcane Farmers with <span className="text-cane-300">Fair Prices</span> & Mills with{" "}
                <span className="text-jaggery-300">Quality Cane</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-cane-100/90 leading-relaxed max-w-3xl">
            {isHi
              ? "गन्ना हाट (GannaHaat) की शुरुआत भारत के गन्ना बहुल क्षेत्रों के किसानों, चीनी मिलों और कोल्हू व्यापारियों के बीच दशकों पुरानी बिचौलिया संस्कृति, घटतौली और भुगतान में होने वाली देरी को खत्म करने के संकल्प के साथ हुई है। हम तकनीक के माध्यम से सीधे खेत से मिल तक पारदर्शी, समयबद्ध और सुरक्षित व्यापार को संभव बनाते हैं।"
              : "GannaHaat was established with a singular mission: to eliminate middleman commissions, weighbridge exploitation, and delayed payments across India's sugarcane belt. By connecting growers directly with licensed mills and crushers, we bring transparent price discovery and guaranteed settlement to the agricultural heartland."}
          </p>

          {/* Quick value badges */}
          <div className="pt-2 flex flex-wrap gap-3 text-xs sm:text-sm font-semibold text-cane-100">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm">
              <BadgeCheck className="w-4 h-4 text-cane-400" />
              {isHi ? "0% छिपा हुआ कमीशन" : "Zero Middleman Cuts"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm">
              <Scale className="w-4 h-4 text-cane-400" />
              {isHi ? "सत्यापित धर्मकांटा पर्ची" : "Certified Weighbridge Slips"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm">
              <Banknote className="w-4 h-4 text-cane-400" />
              {isHi ? "सीधा व त्वरित बैंक भुगतान" : "Direct Bank Settlement"}
            </span>
          </div>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link
              href="/farmer/listings/new"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cane-500 to-cane-400 hover:from-cane-400 hover:to-cane-300 text-cane-950 font-black text-sm sm:text-base shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <Wheat className="w-5 h-5" />
              <span>{isHi ? "फसल बेचें (किसान लिस्टिंग)" : "Sell Cane (Farmer Listing)"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/buyer/marketplace"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-sm sm:text-base backdrop-blur-md transition-colors"
            >
              <Store className="w-5 h-5 text-cane-300" />
              <span>{isHi ? "लाइव मंडी देखें (खरीदार)" : "Explore Live Mandi"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Banner */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-5 sm:p-6 rounded-2xl bg-white border border-cane-200/80 shadow-xs hover:shadow-md transition-shadow"
          >
            <p className="text-2xl sm:text-3xl font-black text-cane-800 tracking-tight">
              {stat.value}
            </p>
            <h4 className="text-sm sm:text-base font-bold text-cane-950 mt-1">
              {stat.label}
            </h4>
            <p className="text-xs text-cane-600 mt-1">{stat.desc}</p>
          </div>
        ))}
      </section>

      {/* Mission & Vision Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cane-50 to-cane-100/60 border border-cane-200/90 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cane-600 text-white flex items-center justify-center shadow-sm">
            <Wheat className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-cane-950">
            {isHi ? "हमारा संकल्प (Our Mission)" : "Our Core Mission"}
          </h2>
          <p className="text-sm sm:text-base text-cane-800 leading-relaxed">
            {isHi
              ? "भारत के प्रत्येक गन्ना किसान को उसकी फसल का वास्तविक, पारदर्शी और प्रतिस्पर्धी बाजार मूल्य दिलाना। बिचौलियों के चंगुल और अनिश्चितताओं को समाप्त कर, खेती को एक लाभप्रद और स्वाभिमानी व्यवसाय बनाना।"
              : "To empower every sugarcane farmer across India with true, competitive market value for their harvest. By eliminating intermediary exploitation, we strive to make sugarcane farming financially rewarding, transparent, and resilient."}
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-cane-900 font-medium pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cane-600 shrink-0" />
              <span>{isHi ? "हर किसान को खुली बोली का लाभ" : "Open price discovery for every grower"}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cane-600 shrink-0" />
              <span>{isHi ? "चीनी मिलों के लिए सुगम व ताजा आपूर्ति" : "Smooth, fresh cane supply for sugar factories"}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cane-600 shrink-0" />
              <span>{isHi ? "स्थानीय कोल्हू व गुड़ उद्योग का सशक्तीकरण" : "Revitalizing rural jaggery & khandsari clusters"}</span>
            </li>
          </ul>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-jaggery-50 to-jaggery-100/60 border border-jaggery-200/90 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-jaggery-600 text-white flex items-center justify-center shadow-sm">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-cane-950">
            {isHi ? "हमारा दृष्टिकोण (Our Vision)" : "Our Vision"}
          </h2>
          <p className="text-sm sm:text-base text-jaggery-950 leading-relaxed">
            {isHi
              ? "एक ऐसा डिजिटल भारत जहाँ कृषि उत्पादक और प्रसंस्करण उद्योग बिना किसी रुकावट के एक-दूसरे से सीधे जुड़े हों। डेटा, गति और विश्वास पर आधारित एक संपूर्ण कृषि-पारिस्थितिकी तंत्र का निर्माण।"
              : "A digitally connected India where primary agricultural producers and industrial processors trade seamlessly with total trust, driven by fair pricing, real-time demand insights, and zero friction."}
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-jaggery-950 font-medium pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-jaggery-600 shrink-0" />
              <span>{isHi ? "डिजिटल तौल पर्ची व त्वरित भुगतान मानक" : "Gold standard in digital weighing & settlement"}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-jaggery-600 shrink-0" />
              <span>{isHi ? "किसानों के लिए शून्य तकनीकी बाधा" : "Zero technical friction for rural smartphone users"}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-jaggery-600 shrink-0" />
              <span>{isHi ? "राष्ट्रीय स्तर पर चीनी बेल्ट का एकीकरण" : "Unified national sugarcane marketplace"}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* The Problem We Solve: Traditional Mandi vs GannaHaat */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cane-100 text-cane-800 text-xs font-bold uppercase tracking-wider">
            {isHi ? "समस्या का समाधान" : "Solving Grassroots Problems"}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-cane-950">
            {isHi ? "पारंपरिक मंडी व्यवस्था बनाम गन्ना हाट" : "Traditional Mandi vs. GannaHaat"}
          </h2>
          <p className="text-sm sm:text-base text-cane-700">
            {isHi
              ? "जानिए कैसे गन्ना हाट पुरानी व्यवस्था की खामियों को दूर कर किसानों और खरीदारों दोनों को सीधा फायदा पहुंचाता है।"
              : "See how GannaHaat dismantles systemic pain points to create a win-win for growers and processors alike."}
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-cane-200 bg-white shadow-xs">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-cane-200 bg-cane-50/70 text-xs uppercase tracking-wider font-bold text-cane-900">
                <th className="py-4 px-6 w-1/4">{isHi ? "प्रमुख पहलू" : "Feature / Aspect"}</th>
                <th className="py-4 px-6 w-3/8 text-red-900 bg-red-50/60">
                  <div className="flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>{isHi ? "पारंपरिक व्यवस्था (Old System)" : "Traditional Mandi / Middlemen"}</span>
                  </div>
                </th>
                <th className="py-4 px-6 w-3/8 text-cane-950 bg-cane-100/60">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cane-700" />
                    <span>{isHi ? "गन्ना हाट डिजिटल मंच" : "GannaHaat Digital Marketplace"}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cane-100 text-xs sm:text-sm">
              {comparisons.map((c, i) => (
                <tr key={i} className="hover:bg-cane-50/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-cane-950">{c.feature}</td>
                  <td className="py-4 px-6 text-red-900/90 bg-red-50/20">{c.traditional}</td>
                  <td className="py-4 px-6 text-cane-950 font-medium bg-cane-50/30">
                    <span className="inline-flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-cane-600 shrink-0 mt-0.5" />
                      <span>{c.gannahaat}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How It Works (4 Steps) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cane-100 text-cane-800 text-xs font-bold uppercase tracking-wider">
            {isHi ? "सरल कार्यप्रणाली" : "Simple Process"}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-cane-950">
            {isHi ? "गन्ना हाट कैसे काम करता है?" : "How GannaHaat Works"}
          </h2>
          <p className="text-sm sm:text-base text-cane-700">
            {isHi
              ? "केवल 4 सरल चरणों में गन्ने की लिस्टिंग से लेकर बैंक खाते में भुगतान तक की पूरी प्रक्रिया।"
              : "Four transparent steps from listing your crop to receiving direct payment in your bank."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-white border border-cane-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-cane-100 group-hover:bg-cane-600 group-hover:text-white text-cane-800 flex items-center justify-center transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-cane-200 group-hover:text-cane-400 transition-colors">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-cane-950">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-cane-700 leading-relaxed">{step.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-cane-100 text-[11px] font-semibold text-cane-500 uppercase tracking-wider">
                  {isHi ? `चरण ${idx + 1}` : `Phase ${idx + 1}`}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Visual Crop Highlight Card */}
      <section className="relative rounded-3xl overflow-hidden bg-cane-950 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cane-300 text-xs font-bold">
              {isHi ? "उच्च शर्करा रिकवरी व किस्में" : "High Sucrose & Variety Focus"}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
              {isHi ? (
                <>
                  गन्ना केवल वजन नहीं — <br />
                  <span className="text-cane-300">मिठास और रिकवरी</span> का भी मूल्य है
                </>
              ) : (
                <>
                  Sugarcane Isn't Just Tonnage — <br />
                  <span className="text-cane-300">Sucrose & Recovery</span> Deserve Premium Rates
                </>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-cane-200 leading-relaxed">
              {isHi
                ? "गन्ना हाट पर किसान अपनी गन्ने की विशिष्ट किस्म जैसे Co 0238, Co 0118 या Co 15023 लिस्ट कर सकते हैं। मिलों और उच्च गुणवत्ता वाले गुड़ निर्माताओं को जब बेहतर शर्करा वाली फसल मिलती है, तो वे अधिक प्रतिस्पर्धी भाव देने के लिए तत्पर रहते हैं।"
                : "GannaHaat explicitly captures crop variety and harvest maturity. Sugar mills and gourmet jaggery producers looking for high-brix, early-ripening varieties compete actively, granting farmers a well-deserved premium over baseline statutory rates."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {varieties.map((v, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm"
                >
                  <p className="text-sm font-bold text-white">{v.code}</p>
                  <p className="text-[11px] text-cane-300">{v.type}</p>
                  <p className="text-xs text-cane-100 font-semibold mt-1">
                    {isHi ? "रिकवरी:" : "Recovery:"} {v.sugar}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[300px]">
            <Image
              src="/images/sugarcane-field.avif"
              alt={isHi ? "लहलहाता गन्ने का खेत" : "Lush sugarcane crop"}
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-cane-950 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Four Core Pillars */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cane-100 text-cane-800 text-xs font-bold uppercase tracking-wider">
            {isHi ? "हमारे मूल्य" : "Our Values"}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-cane-950">
            {isHi ? "जिन सिद्धांतों पर खड़ा है गन्ना हाट" : "The Core Pillars Behind GannaHaat"}
          </h2>
          <p className="text-sm sm:text-base text-cane-700">
            {isHi
              ? "हम केवल एक वेबसाइट नहीं, बल्कि ग्रामीण समृद्धि और कृषक सम्मान का डिजिटल आंदोलन हैं।"
              : "We are more than a software portal — we are a movement for rural equity, dignity, and agricultural fairness."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-cane-200/90 shadow-xs hover:border-cane-400 transition-colors flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-cane-600 text-white flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-cane-950">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-cane-700 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Regional Focus & Physical Footprint */}
      <section className="p-6 sm:p-10 rounded-3xl bg-cane-900 text-white border border-cane-800 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cane-300 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{isHi ? "पश्चिमी उत्तर प्रदेश व चीनी बेल्ट" : "Heartland of India's Sugar Belt"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              {isHi ? "जमीनी उपस्थिति और किसान सहायता केंद्र" : "Ground Presence & Mandi Centers"}
            </h2>
            <p className="text-xs sm:text-sm text-cane-200 leading-relaxed">
              {isHi
                ? "गन्ना हाट की तकनीकी टीम और फील्ड समन्वयक एशिया की सबसे बड़ी गुड़ मंडी — मुज़फ़्फ़रनगर, मेरठ, शामली, बिजनौर, सहारनपुर, बागपत और बुलंदशहर में सक्रिय रूप से कार्य कर रहे हैं ताकि किसी भी किसान भाई को डिजिटल पर्ची या धर्मकांटा सत्यापन में कोई परेशानी न आए।"
                : "GannaHaat field coordinators are stationed across Asia's largest jaggery and sugarcane trade epicenters: Muzaffarnagar, Meerut, Shamli, Bijnor, Saharanpur, and Baghpat, ensuring on-ground support for digital slip generation and weighbridge coordination."}
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold text-cane-100">
              {["मुज़फ़्फ़रनगर", "मेरठ", "बिजनौर", "शामली", "सहारनपुर", "बागपत", "बुलंदशहर", "अमरोहा"].map(
                (district, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15"
                  >
                    📍 {district}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-cane-950/80 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-cane-400" />
              <span>{isHi ? "किसान सहायता हेल्पलाइन" : "Kisan Helpline & Desk"}</span>
            </h3>
            <p className="text-xs text-cane-300">
              {isHi
                ? "क्या आपको लिस्टिंग बनाने या बोली समझने में सहायता चाहिए? हमारे कृषि प्रतिनिधि सुबह 8:00 से शाम 7:00 तक आपकी सेवा में उपलब्ध हैं।"
                : "Need help listing your harvest or reviewing incoming bids? Our regional support desk is available Monday to Saturday."}
            </p>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-cane-400 font-medium">{isHi ? "टोल-फ्री हेल्पलाइन" : "Toll-Free Helpline"}</p>
              <p className="text-lg font-black text-cane-300">1800-GANNA-HAAT</p>
              <p className="text-[11px] text-cane-400">support@gannahaat.online</p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cane-100 text-cane-800 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isHi ? "सवाल-जवाब" : "FAQs"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-cane-950">
            {isHi ? "अक्सर पूछे जाने वाले सवाल" : "Frequently Asked Questions"}
          </h2>
          <p className="text-sm text-cane-700">
            {isHi
              ? "गन्ना हाट की कार्यप्रणाली और भुगतान सुरक्षा से संबंधित आपके मुख्य प्रश्नों के उत्तर।"
              : "Clear answers to the most common questions from farmers, mills, and traders."}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-cane-200/90 bg-white overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-cane-950 hover:bg-cane-50/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-cane-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-cane-700 leading-relaxed border-t border-cane-100 bg-cane-50/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Dual CTA Section */}
      <section className="rounded-3xl bg-gradient-to-r from-cane-800 via-cane-700 to-cane-800 text-white p-8 sm:p-12 text-center shadow-xl space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black">
            {isHi
              ? "आज ही गन्ना हाट से जुड़ें और पारदर्शी व्यापार का लाभ लें"
              : "Join GannaHaat Today — Trade Sugarcane with Confidence"}
          </h2>
          <p className="text-sm sm:text-base text-cane-100 leading-relaxed">
            {isHi
              ? "चाहे आप किसान हों या चीनी मिल/कोल्हू खरीदार, गन्ना हाट आपको देता है सही भाव, सुरक्षित भुगतान और विश्वसनीय बाज़ार।"
              : "Whether you're a farmer ready to harvest or a processor sourcing fresh tonnage, GannaHaat delivers transparent rates, reliable partners, and guaranteed settlements."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/farmer/listings/new"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white text-cane-950 font-black text-base shadow-lg hover:bg-cane-50 transition-all hover:scale-105"
          >
            <Wheat className="w-5 h-5 text-cane-700" />
            <span>{isHi ? "फसल लिस्ट करें (किसान)" : "List Cane Crop (Farmer)"}</span>
          </Link>

          <Link
            href="/buyer/marketplace"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-cane-950/80 hover:bg-cane-950 text-white font-bold text-base border border-white/20 transition-all"
          >
            <Store className="w-5 h-5 text-cane-300" />
            <span>{isHi ? "लाइव बोलियां देखें (खरीदार)" : "Browse Market (Buyer)"}</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
