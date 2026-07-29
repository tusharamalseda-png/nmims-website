import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile"),
  program: z.string().min(1, "Select a program"),
  state: z.string().min(1, "Select a state"),
  message: z.string().trim().max(1000, "Keep it under 1000 characters").optional(),
});

type FormData = z.infer<typeof schema>;

const programs = ["Online MBA", "Online MCA", "Online BBA", "Online BCA", "Other"];

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Puducherry",
];

/**
 * `compact` reproduces the exact card spec from the original static landing
 * page (src/pages/lp-online-mba.html .enquiry-card / .enquiry-head /
 * .enquiry-body / .field / .agree / .btn-orange rules) pixel-for-pixel.
 * Default (non-compact) keeps the original, larger homepage/program-page sizing.
 */
export function EnquiryForm({ compact = false, showMessage = false }: { compact?: boolean; showMessage?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: FormData) => {
    await new Promise((r) => setTimeout(r, 700));
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 4500);
  };

  return (
    <div
      className={
        compact
          ? "overflow-hidden rounded-[20px] bg-white shadow-[0_20px_45px_rgba(63,48,131,0.14)]"
          : "w-full overflow-hidden rounded-[20px] bg-white shadow-elegant"
      }
      id="enquire"
    >
      <div className={compact ? "bg-[linear-gradient(135deg,#FF6C4A,#ff8a5c)] px-6 py-5 text-white" : "bg-[linear-gradient(135deg,#FF6C4A,#ff8a5c)] px-7 py-6 text-white sm:px-9"}>
        <h3 className={compact ? "text-[19px] font-extrabold tracking-tight" : "text-2xl font-extrabold tracking-tight"} style={compact ? { marginBottom: 2 } : undefined}>
          Enquire Now
        </h3>
        <p className={compact ? "text-[12.5px] font-semibold text-[#fff0ea]" : "mt-1 text-sm font-semibold text-white/95"}>
          Hurry Up &amp; Get Free Counselling.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={compact ? "bg-[#faf8fc] px-6 pb-6 pt-[22px]" : "space-y-4 bg-[#faf8fc] p-7 sm:p-9"}
        noValidate
      >
        <Field label="Name" error={errors.name?.message} compact={compact}>
          <input
            {...register("name")}
            placeholder="Enter Name"
            className="input"
            autoComplete="name"
          />
        </Field>
        <Field label="Email ID" error={errors.email?.message} compact={compact}>
          <input
            type="email"
            {...register("email")}
            placeholder="Enter Email ID"
            className="input"
            autoComplete="email"
          />
        </Field>
        <Field label="Mobile Number" error={errors.mobile?.message} compact={compact}>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-[9px] border-[1.5px] border-r-0 border-[#e7e3f0] bg-[#efe9f7] px-3 text-sm font-semibold text-[#555]">
              +91
            </span>
            <input
              {...register("mobile")}
              placeholder="Enter Mobile Number"
              className="input !rounded-l-none"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel"
            />
          </div>
        </Field>
        <div className={compact ? "grid grid-cols-2 gap-3 mb-[14px]" : "grid grid-cols-2 gap-3"}>
          <Field label="Select Program" error={errors.program?.message} compact={false} noMargin>
            <select {...register("program")} className="input" defaultValue="">
              <option value="" disabled>Select Program</option>
              {programs.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>
          <Field label="State" error={errors.state?.message} compact={false} noMargin>
            <select {...register("state")} className="input" defaultValue="">
              <option value="" disabled>Select</option>
              {states.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>

        {showMessage && (
          <Field label="Your Message" error={errors.message?.message} compact={compact}>
            <textarea
              {...register("message")}
              placeholder="Tell us what you'd like help with"
              rows={4}
              className="input resize-none"
            />
          </Field>
        )}

        <label className={compact ? "flex items-center gap-2 text-[12.5px] text-[#777480]" : "flex items-center gap-2 text-xs text-muted-foreground"} style={compact ? { margin: "12px 0 16px" } : undefined}>
          <input type="checkbox" className="h-[15px] w-[15px]" />
          I agree to get updates from counsellor
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className={
            compact
              ? "w-full rounded-full bg-[#FF6C4A] p-[14px] text-[15px] font-semibold text-white shadow-[0_12px_25px_rgba(255,108,74,0.35)] transition-transform hover:scale-[1.02] active:scale-[0.99] disabled:opacity-70"
              : "mt-2 w-full rounded-full bg-[#FF6C4A] px-8 py-[15px] text-[15px] font-semibold text-white shadow-[0_12px_25px_rgba(255,108,74,0.35)] transition-transform hover:scale-[1.02] active:scale-[0.99] disabled:opacity-70"
          }
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
            onClick={() => setSubmitted(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              className="max-w-md rounded-3xl bg-card p-8 text-center shadow-elegant"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full gradient-primary text-primary-foreground">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="text-2xl font-extrabold text-foreground">Thank you!</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Your enquiry has been received. Our admission counsellor will reach out within the next 30 minutes.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 rounded-xl gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Continue Exploring
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .input {
          width: 100%;
          border-radius: 9px;
          border: 1.5px solid #e7e3f0;
          background: #fbfaff;
          padding: 11px 14px;
          font-size: 14px;
          color: #333;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .input:focus {
          border-color: #FF6C4A;
          box-shadow: 0 0 0 3px rgba(255,108,74,0.18);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  error,
  compact,
  noMargin,
  children,
}: {
  label: string;
  error?: string;
  compact?: boolean;
  noMargin?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${compact && !noMargin ? "mb-[14px]" : ""}`}>
      <span className="mb-[5px] block text-[12.5px] font-semibold text-[#6b6875]">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-destructive">{error}</span>}
    </label>
  );
}
